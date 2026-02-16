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
};
