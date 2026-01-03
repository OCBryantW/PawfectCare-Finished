import { api } from "../lib/axios";
import { tokenStorage } from "../utils/tokenStorage";
import { RegisterData, User } from "../../redux/Types";

export const authService = {
    login: async (email: string, password: string): Promise<User> => {
        const { data } = await api.post('/auth/login', {
            email,
            password,
        });

        // ✅ Save token if backend returns it
        if (data.token) {
            await tokenStorage.set(data.token);
        }

        return data.user;
    },

    register: async (payload: RegisterData): Promise<User> => {
        const { data } = await api.post('/auth/register', {
            full_name: payload.fullname,
            phone: payload.phone,
            email: payload.email,
            password: payload.password,
        });

        return data.user;
    },

    logout: async (): Promise<void> => {
        await tokenStorage.remove();
    },
};