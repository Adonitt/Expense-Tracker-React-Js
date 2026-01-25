import {useEffect, useState} from "react";
import {transactionsService} from "../../services/transactionsService.ts";
import {DataGrid, GridActionsCellItem, type GridColDef, type GridRowParams} from "@mui/x-data-grid";
import PageContainer from "../users/PageContainer.tsx";
import {Box, Button, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {TransactionDetailsPopUp} from "./TransactionDetailsPopUp.tsx";
import {TransactionEditPopUp} from "./TransactionEditPopUp.tsx";
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import {TransactionCreatePopUp} from "./TransactionCreatePopUp.tsx";
import {TransactionDeleteDialog} from "./TransactionDeleteDialog.tsx";

export function TransactionsList() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectTransactionId, setSelectTransactionId] = useState<number | null>(null);
    const [popUpOpen, setPopUpOpen] = useState(false);

    const [editTransactionId, setEditTransactionId] = useState<number | null>(null);
    const [editPopUpOpen, setEditPopUpOpen] = useState(false);

    const [createPopUpOpen, setCreatePopUpOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null);

    const fetchTransactions = () => {
        setLoading(true);
        setError(null);

        transactionsService.getAllTransactions()
            .then(res => setTransactions(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleCreate = () => {
        setCreatePopUpOpen(true)
    }

    const handleRowClick = (id: number) => {
        setSelectTransactionId(id);
        setPopUpOpen(true);
    };

    const handleEdit = (id: number) => {
        setEditTransactionId(id);
        setEditPopUpOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteTransactionId(id);
        setDeleteDialogOpen(true);
    }


    const handleDelete = (id: number) => {
        console.log("Delete transaction", id);
    };

    const columns: GridColDef[] = [
        {
            field: "id", headerName: "ID", width: 100, align: "center",
        },
        // {field: "debtId", headerName: "Debt ID", width: 200},
        // {field: "userId", headerName: "User ID", width: 100},
        // {field: "userFullName", headerName: "User Name", width: 200},
        {
            field: "amount",
            align: "center",

            headerName: "Amount €",
            width: 100,
            renderCell: (params) => {
                const isIncome = params.row.type === "INCOME";
                return (
                    <span
                        style={{
                            backgroundColor: isIncome ? "green" : "red",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                        }}
                    >
                        {isIncome ? `+${params.value}` : `-${params.value}`}
                    </span>
                );
            }
        },
        {
            field: "type",
            headerName: "Type",
            width: 150,
            align: "center",

            renderCell: (params) => {
                const isIncome = params.row.type === "INCOME";
                return (
                    <span
                        style={{
                            backgroundColor: isIncome ? "green" : "red",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                        }}
                    >
                        {params.row.type}
                    </span>
                );
            }
        },
        {
            field: "category", headerName: "Category", align: "center",
            width: 150
        },
        {
            field: "date", headerName: "Date", align: "center",
            width: 100
        },
        {
            field: "actions",
            type: "actions",
            align: "center",

            headerName: "Actions",
            width: 100,
            align: "center",

            getActions: (params) => {
                if (params.row.category === "DEBT") return [<p>Link to Debt</p>];
                return [
                    <GridActionsCellItem
                        key="edit"
                        icon={<EditIcon/>}
                        label="Edit"
                        onClick={() => handleEdit(params.id as number)}
                    />,
                    <GridActionsCellItem
                        key="delete"
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(params.id as number);
                        }}
                    />
                ];
            },
        },

    ];

    const rows = transactions.map(t => ({
        id: t.id,
        debtId: t.debtId ?? "-",
        userId: t.userId,
        userFullName: t.userFullName,
        amount: t.amount,
        type: t.type,
        date: t.date,
        category: t.category,
    }));

    return (
        <PageContainer title="Transactions List">
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{mb: 2, justifyContent: "space-between"}}
            >
                <Typography variant="h6">Transactions</Typography>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    startIcon={<AddIcon/>}
                >
                    Create
                </Button>
            </Stack>

            <Box sx={{width: "100%"}}>
                {error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        pageSizeOptions={[5, 10, 25]}
                        autoHeight
                        onRowClick={(params: GridRowParams) => handleRowClick(params.id as number)}
                    />
                )}
            </Box>

            {selectTransactionId && (
                <TransactionDetailsPopUp
                    open={popUpOpen}
                    onClose={() => setPopUpOpen(false)}
                    transactionId={selectTransactionId}
                    onDeleted={() => {
                        setPopUpOpen(false);
                        fetchTransactions();
                    }}
                />
            )}

            {editTransactionId && (
                <TransactionEditPopUp
                    open={editPopUpOpen}
                    onClose={() => setEditPopUpOpen(false)}
                    transactionId={editTransactionId}
                    onSaved={fetchTransactions}
                />
            )}

            {createPopUpOpen && (
                <TransactionCreatePopUp
                    open={createPopUpOpen}
                    onClose={() => setCreatePopUpOpen(false)}
                    onCreated={() => {
                        setCreatePopUpOpen(false);
                        fetchTransactions();
                    }}
                />
            )}

            <TransactionDeleteDialog
                open={deleteDialogOpen}
                transactionId={deleteTransactionId}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={() => fetchTransactions()}
            />

        </PageContainer>
    );
}
