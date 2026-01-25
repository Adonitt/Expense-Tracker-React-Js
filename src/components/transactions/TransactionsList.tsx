import {useEffect, useState} from "react";
import {transactionsService} from "../../services/transactionsService.ts";
import {DataGrid, GridActionsCellItem, type GridColDef, type GridRowParams} from "@mui/x-data-grid";
import PageContainer from "../users/PageContainer.tsx";
import {Box, Button, Tooltip, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {TransactionDetailsPopUp} from "./TransactionDetailsPopUp.tsx";
import {TransactionEditPopUp} from "./TransactionEditPopUp.tsx";
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';

export function TransactionsList() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectTransactionId, setSelectTransactionId] = useState<number | null>(null);
    const [popUpOpen, setPopUpOpen] = useState(false);

    const [editTransactionId, setEditTransactionId] = useState<number | null>(null);
    const [editPopUpOpen, setEditPopUpOpen] = useState(false);

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

    }

    const handleRowClick = (id: number) => {
        setSelectTransactionId(id);
        setPopUpOpen(true);
    };

    const handleEdit = (id: number) => {
        setEditTransactionId(id);
        setEditPopUpOpen(true);
    };

    const handleDelete = (id: number) => {
        console.log("Delete transaction", id);
    };

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 200},
        // {field: "debtId", headerName: "Debt ID", width: 200},
        // {field: "userId", headerName: "User ID", width: 100},
        // {field: "userFullName", headerName: "User Name", width: 200},
        {
            field: "amount",
            headerName: "Amount €",
            width: 200,
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
            width: 250,
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
        {field: "category", headerName: "Category", width: 200},
        {field: "date", headerName: "Date", width: 150},
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: (params) => [
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
                        handleDelete(params.id as number);
                    }}
                />
            ],
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
                sx={{ mb: 2, justifyContent: "space-between" }}
            >
                <Typography variant="h6">Transactions</Typography>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    startIcon={<AddIcon />}
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

        </PageContainer>
    );
}
