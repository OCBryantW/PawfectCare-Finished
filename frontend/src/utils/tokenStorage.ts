import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = '@auth_token';

export const tokenStorage = {
    async get(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Failed to get token:', error);
            return null;
        }
    },

    async set(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Failed to set token:', error);
        }
    },

    async remove(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    },
};