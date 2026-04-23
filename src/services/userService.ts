import {apiClient} from "../helpers/client.ts";

export interface UserListPayload {
    id: number;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role: string;
    email: string;
}

export interface UserDetailsPayload {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: string;
    registeredAt: string
    isActive: boolean
}

// 1. Shto këtë Interface për Update të vetvetes (pa Role dhe IsActive)
export interface UpdateSelfPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

export interface UpdateUserPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: string;
    isActive: boolean;
}

export const userService = {
    getUsers: () =>
        apiClient<UserListPayload[]>('/users', {
            method: 'GET',
        }),

    getUserById: (id: number) =>
        apiClient<UserDetailsPayload>(`/users/${id}`, {
            method: 'GET'
        }),

    updateUserById: (id: number, form: object) =>
        apiClient<UpdateUserPayload>(`/users/edit/${id}`, {
            method: 'PUT',
            body: form
        }),

    // 2. Shto këtë metodë për thirrjen e endpoint-it të ri
    updateSelf: (form: UpdateSelfPayload) =>
        apiClient<UpdateUserPayload>('/users/update-self', {
            method: 'PUT',
            body: form
        }),

    deleteUserById: async (userId: number): Promise<void> => {
        await apiClient(`/users/${userId}`, {
            method: 'DELETE',
        });
    },
};