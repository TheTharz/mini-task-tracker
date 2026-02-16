export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status?: TaskStatus;
    priority?: string;
    dueDate?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> { }

export interface TaskSearchParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
    status?: TaskStatus;
    priority?: string;
    search?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
