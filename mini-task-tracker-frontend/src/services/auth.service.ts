import { apiClient } from './api.client';
import { AxiosError } from 'axios';
import type { RegisterRequest, RegisterResponse, ApiError, LoginRequest, LoginResponse } from '../types/auth.types';

export const authService = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await apiClient.post<RegisterResponse>('/users/register', data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data) {
                throw axiosError.response.data;
            }
            throw new Error(axiosError.message);
        }
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>('/users/login', data);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data) {
                throw axiosError.response.data;
            }
            throw new Error(axiosError.message);
        }
    },
    getCurrentUser: async (): Promise<any> => {
        try {
            const response = await apiClient.get('/users/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw error;
        }
    },

    logout: async (refreshToken: string): Promise<void> => {
        try {
            await apiClient.post('/users/logout', { refreshToken });
        } catch (error) {
            console.error('Error logging out:', error);
            // We verify logout even if server fails to ensure client side cleanup
        }
    }
};
