import {apiClient} from "../helpers/client.ts";

export interface DebtsListPayload {
    id: number,
    amount: number,
    person: string,
    type: string,
    status: string,
    date: string,
    transactionId: number,
}

export interface DebtDetailsPayload {
    id: number,
    amount: number,
    person: string,
    description: string,
    type: string,
    status: string,
    date: string,
    transactionId: number,
    createdAt: string,
    updatedAt: string
}

export interface CreateDebtPayload {
    amount: number,
    person: string,
    description: string,
    type: string,
    status: string,
    date: string
}

export interface UpdateDebtPayload {
    amount: number,
    person: string,
    description: string,
    type: string,
    status: string,
    date: string
}


export const debtsService = {
    getAllDebts: async (): Promise<DebtsListPayload[]> => {
        return await apiClient<DebtsListPayload[]>('/debts', {
                method: 'GET'
            }
        )
    },
    getDebtById: async (id: number): Promise<DebtsListPayload> => {
        return await apiClient<DebtDetailsPayload>(`/debts/${id}`, {
            method: 'GET'
        });
    },
    createDebt: async (form: CreateDebtPayload) => apiClient('/debts/add', {
        method: 'POST',
        body: form
    }),
    updateDebtById: async (form: UpdateDebtPayload, id: number) => apiClient<UpdateDebtPayload>(`/debts/edit/${id}`, {
        method: "PUT",
        body: form
    }),
    deleteDebtById: async (debtId: number) => apiClient(`/debts/${debtId}`, {
        method: 'DELETE',
    })


}