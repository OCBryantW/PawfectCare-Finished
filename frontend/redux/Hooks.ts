import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./Store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// AUTH HOOK
export const useAuth = () => {
    const auth = useAppSelector(state => state.auth);
    return auth;
};

// SERVICE HOOK
export const useServices = () => {
    const services = useAppSelector(state => state.services);
    // const dispatch = useAppDispatch();

    const getTotalPrice = () => {
        return services.selectedServices.reduce((total, service) => total + service.price, 0);
    };

    const getTotalDuration = () => {
        return services.selectedServices.reduce((total, service) => {
            const duration = parseInt(service.duration);
            return total + duration;
        }, 0);
    };

    const isServiceSelected = (serviceId: string) => {
        return services.selectedServices.some(s => s.id === serviceId);
    };

    return {
        ...services,
        getTotalPrice,
        getTotalDuration,
        isServiceSelected
    };
};

export const useBookings = () => {
    const bookings = useAppSelector(state => state.bookings);

    const getBookingStatus = (booking: any): 'not-started' | 'on-going' | 'done' => {
        const now  = new Date();
        const bookingDate = new Date(booking.date);
        const [hours, minutes] = booking.time.split(':').map(Number);

        bookingDate.setHours(hours, minutes, 0, 0);

        // Calculate total duration
        const totalMinutes = booking.services.reduce((total: number, service: any) => {
            return total + parseInt(service.duration);
        }, 0);

        const endTime = new Date(bookingDate.getTime() + totalMinutes * 60000);

        if (now < bookingDate) {
            return 'not-started';
        } else if (now >= bookingDate && now < endTime){
            return 'on-going';
        } else {
            return 'done';
        }
    };

    return {
        ...bookings,
        getBookingStatus
    };
};