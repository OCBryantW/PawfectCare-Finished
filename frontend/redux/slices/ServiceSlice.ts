import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ServiceState, Service } from "../Types";
import { serviceService } from '../../src/services/serviceService';

const initialState: ServiceState = {
    services: [],
    selectedServices: [],
    loading: false,
    error: null
};

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (_, {rejectWithValue}) => {
        try {
            return await serviceService.getAll();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load services');
        }
    }
);

export const fetchTestimonials = createAsyncThunk(
    'services/fetchTestimonials',
    async (serviceId: string, {rejectWithValue}) => {
        try {
            const testimonials = await serviceService.getTestimonials(serviceId);
            return { serviceId, testimonials };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load testimonials');
        }
    }
);

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        addService: (state, action: PayloadAction<Service>) => {
            const exists = state.selectedServices.find(s => s.id === action.payload.id);
            if (!exists) {
                state.selectedServices.push(action.payload);
            }
            console.log('Added service, now selected:', state.selectedServices.length); // ✅ DEBUG
        },

        removeService: (state, action: PayloadAction<string>) => {
            state.selectedServices = state.selectedServices.filter(
                s => s.id !== action.payload
            );
            console.log('Removed service, now selected:', state.selectedServices.length); // ✅ DEBUG
        },

        clearServices: (state) => {
            state.selectedServices = [];
        },

        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchServices.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchServices.fulfilled, (state, action) => {
            state.loading = false;
            state.services = action.payload;
        });
        builder.addCase(fetchServices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchTestimonials.fulfilled, (state, action) => {
            const {serviceId, testimonials} = action.payload;
            const service = state.services.find(s => s.id === serviceId);
            if (service) {
                service.testimonials = testimonials;
            }
        });
    }
});

export const {addService, removeService, clearServices, clearError} = serviceSlice.actions;
export default serviceSlice.reducer;