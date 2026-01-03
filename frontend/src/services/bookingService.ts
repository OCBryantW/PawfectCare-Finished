import { api } from "../lib/axios";
import { BookingItem } from "../../redux/Types";

interface CreateBookingPayload {
    userId: string;
    serviceIds: string[];
    ownerName: string;
    ownerPhone: string;
    petName: string;
    date: string;
    time: string;
    notes: string;
}

export const bookingService = {
    getByUser: async (userId: string): Promise<BookingItem[]> => {
        const { data } = await api.get(`/bookings/user/${userId}`);
        return data.bookings;
    },

    create: async (payload: CreateBookingPayload): Promise<BookingItem> => {
        const { data } = await api.post('/bookings', payload);
        return data.booking;
    },

    cancel: async (bookingId: string): Promise<string> => {
        await api.delete(`/bookings/${bookingId}`);
        return bookingId;
    },

    getById: async (bookingId: string): Promise<BookingItem> => {
        const { data } = await api.get(`/bookings/${bookingId}`);
        return data.booking;
    },
};