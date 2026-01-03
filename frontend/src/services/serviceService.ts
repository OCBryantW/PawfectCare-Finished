import { api } from "../lib/axios";
import { Service, Testimonial } from "../../redux/Types";

export const serviceService = {
    getAll: async (): Promise<Service[]> => {
        const { data } = await api.get('/services');
        return data.services;
    },

    getById: async (serviceId: string): Promise<Service> => {
        const { data } = await api.get(`/services/${serviceId}`);
        return data.service;
    },

    getTestimonials: async (serviceId: string): Promise<Testimonial[]> => {
        const { data } = await api.get(`/services/${serviceId}/testimonials`);
        return data.testimonials;
    },
};
