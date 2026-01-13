import { apiClient } from "../helpers/client.ts";

export interface UserListPayload {
    id: number;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role: string;
    email: string;
}

export const userService = {
    getUsers: () =>
        apiClient<UserListPayload[]>('/users', {
            method: 'GET',
        }),
};
