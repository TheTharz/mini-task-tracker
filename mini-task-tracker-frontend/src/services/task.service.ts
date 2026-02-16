
import { apiClient } from './api.client';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskSearchParams, PaginatedResponse } from '../types/task.types';

export const taskService = {
    getTasks: async (params?: TaskSearchParams): Promise<PaginatedResponse<Task>> => {
        try {
            const response = await apiClient.get<any>('/tasks', { params });
            const data = response.data;

            // Map the nested API response to our flat frontend interface
            return {
                content: data.content,
                totalElements: data.page.totalElements,
                totalPages: data.page.totalPages,
                size: data.page.size,
                number: data.page.number,
                first: data.page.number === 0,
                last: data.page.number === data.page.totalPages - 1,
                empty: data.content.length === 0
            };
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    createTask: async (task: CreateTaskRequest): Promise<Task> => {
        try {
            const response = await apiClient.post<Task>('/tasks', task);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    updateTask: async (id: string, task: UpdateTaskRequest): Promise<Task> => {
        try {
            const response = await apiClient.put<Task>(`/tasks/${id}`, task);
            return response.data;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    deleteTask: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/tasks/${id}`);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
};
