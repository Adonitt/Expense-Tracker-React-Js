import {apiClient} from "../helpers/client.ts";

export interface DebtsListPayload {
    id: number;
    amount: number;
    remainingAmount: number;
    paidAmount: number;
    person: string;
    type: "LENT" | "BORROWED";
    status: "PENDING" | "PAID";
    date: string;
    description: string;
}

export interface DebtDetailsPayload extends DebtsListPayload {
    createdAt: string;
    updatedAt: string;
    completed: boolean;
    lastPaymentAt: string
}

export interface CreateDebtPayload {
    amount: number;
    person: string;
    description: string;
    type: "LENT" | "BORROWED";
    status?: "PENDING" | "PAID";
    date: string;
}

export interface PayDebtPayload {
    amount: number;
}

export const debtsService = {

    getAllDebts: async () =>
        apiClient<DebtsListPayload[]>('/debts', {method: 'GET'}),

    getDebtById: async (id: number) =>
        apiClient<DebtDetailsPayload>(`/debts/${id}`, {method: 'GET'}),

    createDebt: async (form: CreateDebtPayload) =>
        apiClient('/debts', {
            method: 'POST',
            body: form
        }),

    updateDebtById: async (form: CreateDebtPayload, id: number) =>
        apiClient(`/debts/${id}`, {
            method: "PUT",
            body: form
        }),

    deleteDebtById: async (id: number) =>
        apiClient(`/debts/${id}`, {method: 'DELETE'}),

    payDebt: async (id: number, payload: PayDebtPayload) =>
        apiClient(`/debts/${id}/pay`, {
            method: "POST",
            body: payload
        })
};