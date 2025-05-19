export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: number; // Changed from string to number to match our enum
    bio: string | null;
    profilePictureUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
    lastLoginAt: string | null;
    postCount?: number; // Optional fields for detail view
    commentCount?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string; // Added this field
    firstName: string;
    lastName: string;
}

export interface UpdateUserProfileRequest {
    firstName: string;
    lastName: string;
    bio: string;
    profilePictureUrl: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface UpdateUserRoleRequest {
    role: number;
}

export interface UpdateUserStatusRequest {
    isActive: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
    expiration: string; // Added expiration field
}

export interface UserStatisticsResponse {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalComments: number;
    approvedComments: number;
    pendingComments: number;
}

// Define user roles to match backend enum
export const UserRole = {
    Reader: 0,
    Author: 1,
    Admin: 2
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];