export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
    profilePictureUrl: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}