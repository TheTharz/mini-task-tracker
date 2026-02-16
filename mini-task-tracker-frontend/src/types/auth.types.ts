export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface RegisterResponse extends User { }

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface ApiError {
    message: string;
    status: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    type: string;
    user: User;
}
