import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BookingState, BookingItem } from "../Types";
import { bookingService } from '../../src/services/bookingService';

const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null
};

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (userId: string, {rejectWithValue}) => {
        try {
            return await bookingService.getByUser(userId);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load bookings');
        }
    }
);

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData: {
        userId: string;
        serviceIds: string[];
        ownerName: string;
        ownerPhone: string;
        petName: string;
        date: string;
        time: string;
        notes: string;
    }, {rejectWithValue}) => {
        try {
            return await bookingService.create(bookingData);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'bookings/cancelBooking',
    async (bookingId: string, {rejectWithValue}) => {
        try {
            return await bookingService.cancel(bookingId);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel booking');
        }
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        updateBookingStatus: (state, action: PayloadAction<{id: string; status: 'not-started' | 'on-going' | 'done'}>) => {
            const booking = state.bookings.find(b => b.id === action.payload.id);
            if (booking) {
                booking.status = action.payload.status;
            }
        }
    },

    extraReducers: (builder) => {
        // FETCH BOOKING
        builder.addCase(fetchBookings.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBookings.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings = action.payload;
        });
        builder.addCase(fetchBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // CREATE BOOKING
        builder.addCase(createBooking.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings = [action.payload, ...state.bookings];
        });
        builder.addCase(createBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // CANCEL BOOKING
        builder.addCase(cancelBooking.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(cancelBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings = state.bookings.filter(b => b.id !== action.payload);
        });
        builder.addCase(cancelBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const {clearError, updateBookingStatus} = bookingSlice.actions;
export default bookingSlice.reducer;