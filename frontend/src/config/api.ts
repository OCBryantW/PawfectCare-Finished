import { API_URL } from '@env';

export const apiConfig = {
    baseURL: API_URL || 'http://10.105.41.112:3000/api',
    timeout: 10000,
};