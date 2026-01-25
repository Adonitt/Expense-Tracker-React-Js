import {apiClient} from "../helpers/client.ts";

export interface TransactionsListPayload {
    id: number;
    debtId: number
    userId: number
    userFullName: string
    amount: number
    type: string
    date: string
    category: string
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface TransactionDetailsPayload {
    id: number;
    debtId: number
    userId: number
    userFullName: string
    amount: number
    type: string
    date: string
    category: string
    description: string
    createdAt: string
    updatedAt: string
}

export interface UpdateTransactionPayload {
    category: string
    amount: number
    type: TransactionType
    description: string
    date: string
}


export interface CreateTransactionPayload {
    category: string
    amount: number
    type: TransactionType
    description: string
    date: string
}

export const transactionsService = {
    getAllTransactions: async (): Promise<TransactionsListPayload[]> => {
        return await apiClient<TransactionsListPayload[]>('/transactions', {
            method: 'GET'
        });
    },

    getTransactionById: async (id: number): Promise<TransactionDetailsPayload> => {
        return await apiClient<TransactionDetailsPayload>(`/transactions/${id}`, {
            method: 'GET'
        });
    },
    createTransaction: async (form: CreateTransactionPayload): Promise<CreateTransactionPayload> => {
        return await apiClient('/transactions/create', {
            method: 'POST',
            body: form
        })
    },
    updateTransactionById: async (form: UpdateTransactionPayload, id: number): Promise<UpdateTransactionPayload> => {
        return await apiClient<UpdateTransactionPayload>(`/transactions/edit/${id}`, {
            method: "PUT",
            body: form
        });
    },
    deleteTransactionById: async (transactionId: number): Promise<void> => {
        await apiClient(`/transactions/${transactionId}`, {
            method: 'DELETE',
        });
    }
}
