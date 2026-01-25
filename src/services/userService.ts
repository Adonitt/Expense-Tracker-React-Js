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

        deleteUserById: async (userId: number): Promise<void> => {
            await apiClient(`/users/${userId}`, {
                method: 'DELETE',
            });
        }
    }
;
