import axios, { AxiosError } from 'axios';
import type { RegisterRequest, RegisterResponse, ApiError, LoginRequest, LoginResponse } from '../types/auth.types';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '');

export const authService = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await axios.post<RegisterResponse>(`${API_URL}/users/register`, data);
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
            const response = await axios.post<LoginResponse>(`${API_URL}/users/login`, data);
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
