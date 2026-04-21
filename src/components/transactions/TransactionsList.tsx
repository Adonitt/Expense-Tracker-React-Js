import {useEffect, useState} from "react";
import {transactionsService} from "../../services/transactionsService.ts";
import {DataGrid, GridActionsCellItem, type GridColDef} from "@mui/x-data-grid";
import PageContainer from "../users/PageContainer.tsx";
import {Box, Button, Stack, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {TransactionEditPopUp} from "./TransactionEditPopUp.tsx";
import {TransactionCreatePopUp} from "./TransactionCreatePopUp.tsx";
import {TransactionDeleteDialog} from "./TransactionDeleteDialog.tsx";
import {TransactionDetailsPopUp} from "./TransactionDetailsPopUp.tsx";
import TextField from "@mui/material/TextField";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {BalanceCard} from "../../helpers/BalanceCard.tsx";


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

    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [selectedDebtId, setSelectedDebtId] = useState<number | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);


    const fetchTransactions = (from?: string, to?: string) => {
        if (!from || !to) return;

        setLoading(true);
        setError(null);

        transactionsService.getFilteredTransactions(from, to)
            .then(res => setTransactions(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    const getLast7Days = () => {
        const today = new Date();
        const last7 = new Date();

        last7.setDate(today.getDate() - 7);

        return {
            from: last7.toISOString().split("T")[0],
            to: today.toISOString().split("T")[0],
        };
    };

    useEffect(() => {
        const {from, to} = getLast7Days();
        setFromDate(from);
        setToDate(to);
        fetchTransactions(from, to);
    }, []);

    const handleCreate = () => setCreatePopUpOpen(true);

    const handleRowClick = (row: any) => {
        if (row.type === "DEBT") {
            setSelectedDebtId(row.debtId);
            setDetailsOpen(true);
        } else {
            setSelectTransactionId(row.id);
            setPopUpOpen(true);
        }
    };

    const handleEdit = (id: number) => {
        setEditTransactionId(id);
        setEditPopUpOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteTransactionId(id);
        setDeleteDialogOpen(true);
    };

    const handleApplyFilter = () => {
        if (!fromDate || !toDate) {
            alert("Select both dates");
            return;
        }

        if (fromDate > toDate) {
            alert("From date cannot be after To date");
            return;
        }

        fetchTransactions(fromDate, toDate);
    };

    const handleReset = () => {
        const {from, to} = getLast7Days();
        setFromDate(from);
        setToDate(to);
        fetchTransactions(from, to);
    };

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 100, align: "center"},
        {
            field: "amount",
            headerName: "Amount €",
            width: 120,
            align: "center",
            renderCell: (params) => {
                const isIncome = params.row.type === "INCOME";
                return (
                    <span style={{
                        backgroundColor: isIncome ? "green" : "red",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                    }}>
                        {isIncome ? `+${params.value}` : `-${params.value}`}
                    </span>
                );
            },
        },
        {
            field: "type",
            headerName: "Type",
            width: 120,
            align: "center",
        },
        {field: "category", headerName: "Category", width: 150, align: "center"},
        {field: "description", headerName: "Description", width: 150, align: "center"},
        {field: "date", headerName: "Date", width: 120, align: "center"},
        {
            headerName: "Actions",
            field: "actions",
            type: "actions",
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
                        handleDeleteClick(params.id as number);
                    }}
                />,
            ],
        },
    ];
    const isDark = localStorage.theme === "dark";
    const isLight = localStorage.theme === "light";

    const rows = transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        date: t.date,
        category: t.category,
        description: t.description,
    }));

    const totalIncome = transactions
        .filter(t => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const difference = totalIncome - totalExpense;

    return (
        <PageContainer title="Transactions List">

            <Stack direction="row" justifyContent="space-between" sx={{mb: 2}}>
                <Typography variant="h6">Transactions</Typography>
                <Button variant="contained" startIcon={<AddIcon/>} onClick={handleCreate}>
                    Create
                </Button>
            </Stack>

            <Stack
                direction={{xs: "column", md: "row"}}
                spacing={2}
                sx={{
                    mb: 2,
                    alignItems: {md: "center"},
                    flexWrap: "wrap"
                }}
            >
                <TextField
                    type="date"
                    size="small"
                    label="From"
                    InputLabelProps={{shrink: true}}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    sx={{width: {xs: "100%", md: 180}}}
                />

                <TextField
                    type="date"
                    size="small"
                    label="To"
                    InputLabelProps={{shrink: true}}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    sx={{width: {xs: "100%", md: 180}}}
                />

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        width: {xs: "100%", md: "auto"}
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleApplyFilter}
                        sx={{flex: {xs: 1, md: "unset"}}}
                    >
                        Apply
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleReset}
                        sx={{flex: {xs: 1, md: "unset"}}}
                    >
                        Last 7 Days
                    </Button>
                </Stack>
            </Stack>

            <Box
                sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: {xs: "flex-start", md: "center"},
                    flexDirection: {xs: "column", md: "row"},
                    gap: 1,

                    bgcolor: isDark ? "#1e293b" : "#e3f2fd",
                    border: isDark ? "1px solid #334155" : "none",
                }}
            >
                <Typography color={isDark ? "#cbd5e1" : "black"}>
                    Showing transactions
                </Typography>

                <Typography
                    fontWeight="bold"
                    sx={{
                        color: isDark ? "#60a5fa" : "#1976d2",
                    }}
                >
                    {fromDate} → {toDate}
                </Typography>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                autoHeight

                pagination
                pageSizeOptions={[5, 10, 25]}

                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                            page: 0,
                        },
                    },
                }}

                onRowClick={(params) => handleRowClick(params.row)}
            />


            <BalanceCard income={totalIncome} expense={totalExpense}/>

            {selectTransactionId && (
                <TransactionDetailsPopUp
                    open={popUpOpen}
                    onClose={() => setPopUpOpen(false)}
                    transactionId={selectTransactionId}
                    onDetails={() => fetchTransactions(fromDate, toDate)}
                />
            )}

            {editTransactionId && (
                <TransactionEditPopUp
                    open={editPopUpOpen}
                    onClose={() => setEditPopUpOpen(false)}
                    transactionId={editTransactionId}
                    onSaved={() => fetchTransactions(fromDate, toDate)}
                />
            )}

            {createPopUpOpen && (
                <TransactionCreatePopUp
                    open={createPopUpOpen}
                    onClose={() => setCreatePopUpOpen(false)}
                    onCreated={() => fetchTransactions(fromDate, toDate)}
                />
            )}

            <TransactionDeleteDialog
                open={deleteDialogOpen}
                transactionId={deleteTransactionId}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={() => fetchTransactions(fromDate, toDate)}
            />

            {selectedDebtId && (
                <DebtDetailsPopUp
                    open={detailsOpen}
                    debtId={selectedDebtId}
                    onClose={() => setDetailsOpen(false)}
                    onDetails={fetchDebts}
                />
            )}

        </PageContainer>
    );
}