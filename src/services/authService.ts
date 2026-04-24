import { apiClient } from "../helpers/client.ts";

interface LoginPayload {
    email: string,
    password: string
}

interface RegisterPayload {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
    password: string
    confirmPassword: string
}

interface ChangePasswordPayload {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export const authService = {
    login: (data: LoginPayload) =>
        apiClient('/auth/login', { method: 'POST', body: data }),

    register: (data: RegisterPayload) =>
        apiClient('/auth/register', { method: 'POST', body: data }),

    changePassword: (data: ChangePasswordPayload) =>
        apiClient('/auth/change-password', { method: 'PUT', body: data }),

    forgotPassword: (email: string) =>
        apiClient("/auth/forgot-password", {
            method: "POST",
            body: { email }
        }),

    resetPassword: (data: {
        token: string;
        newPassword: string;
        confirmPassword: string;
    }) =>
        apiClient("/auth/reset-password", {
            method: "POST",
            body: data
        }),
};