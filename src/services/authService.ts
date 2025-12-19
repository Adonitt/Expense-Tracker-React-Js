import {apiClient} from "../helpers/client.ts";

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

export const authService = {
    login: (data: LoginPayload) => apiClient('/auth/login', {method: 'POST', body: data}),
    register: (data: RegisterPayload) => apiClient('/auth/register', {method: 'POST', body: data}),
}