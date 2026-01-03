import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/AuthSlice';
import serviceReducer from './slices/ServiceSlice';
import bookingReducer from './slices/BookingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        services: serviceReducer,
        bookings: bookingReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;