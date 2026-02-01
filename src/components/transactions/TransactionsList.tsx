import {useEffect, useState} from "react";
import {transactionsService} from "../../services/transactionsService.ts";
import {DataGrid, GridActionsCellItem, type GridColDef, type GridRowParams} from "@mui/x-data-grid";
import PageContainer from "../users/PageContainer.tsx";
import {Box, Button, MenuItem, Select, Stack, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import {TransactionEditPopUp} from "./TransactionEditPopUp.tsx";
import {TransactionCreatePopUp} from "./TransactionCreatePopUp.tsx";
import {TransactionDeleteDialog} from "./TransactionDeleteDialog.tsx";
import {TransactionDetailsPopUp} from "./TransactionDetailsPopUp.tsx";
import TextField from "@mui/material/TextField";

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

    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    const fetchTransactions = (year?: number | null, month?: number | null, day?: number | null) => {
        setLoading(true);
        setError(null);

        transactionsService.getFilteredTransactions(year, month, day)
            .then(res => setTransactions(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    const showToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        setSelectedYear(year);
        setSelectedMonth(month);

        fetchTransactions(year, month);
    };

    useEffect(() => {
        showToday();
    }, []);

    const handleCreate = () => setCreatePopUpOpen(true);
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
    };

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 100, align: "center"},
        {
            field: "amount",
            headerName: "Amount €",
            width: 100,
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
                        {isIncome ? `+${params.value}` : `-${params.value}`}
                    </span>
                );
            },
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
            },
        },
        {field: "category", headerName: "Category", width: 150, align: "center"},
        {field: "date", headerName: "Date", width: 100, align: "center"},
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            align: "center",
            getActions: (params) => {
                if (params.row.category === "DEBT") return [<p key="debt">Link to Debt</p>];
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
                    />,
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

    const monthNames = [
        "",
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
// Llogarit totalet
    const totalIncome = transactions
        .filter(t => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const difference = totalIncome - totalExpense;


    return (
        <PageContainer title="Transactions List">
            <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2, justifyContent: "space-between"}}>
                <Typography variant="h6">Transactions</Typography>
                <Button variant="contained" onClick={handleCreate} startIcon={<AddIcon/>}>
                    Create
                </Button>
            </Stack>

            {/* Filters */}
            <Stack direction="row" spacing={1} sx={{mb: 2, alignItems: "center"}}>
                <TextField
                    type="number"
                    size="small"
                    label="Day"
                    InputProps={{inputProps: {min: 1, max: 31}}}
                    value={selectedDay ?? ""}
                    onChange={(e) => {
                        const day = e.target.value ? Number(e.target.value) : null;
                        setSelectedDay(day);
                        fetchTransactions(selectedYear, selectedMonth, day);
                    }}
                />

                <Select
                    size="small"
                    value={selectedMonth ?? ""}
                    onChange={(e) => {
                        const month = Number(e.target.value);
                        setSelectedMonth(month);
                        fetchTransactions(selectedYear, month, selectedDay);
                    }}
                >
                    <MenuItem value="" disabled>Select Month</MenuItem>
                    {Array.from({length: 12}, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>{monthNames[i + 1]}</MenuItem>
                    ))}
                </Select>

                <Select
                    size="small"
                    value={selectedYear ?? ""}
                    onChange={(e) => {
                        const year = Number(e.target.value);
                        setSelectedYear(year);
                        fetchTransactions(year, selectedMonth, selectedDay);
                    }}
                >
                    <MenuItem value="" disabled>Select Year</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2026}>2026</MenuItem>
                </Select>

                <Button
                    variant="outlined"
                    onClick={() => {
                        const today = new Date();
                        setSelectedYear(today.getFullYear());
                        setSelectedMonth(today.getMonth() + 1);
                        setSelectedDay(today.getDate());
                        fetchTransactions(today.getFullYear(), today.getMonth() + 1, today.getDate());
                    }}
                >
                    Show Today
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => {
                        const today = new Date();
                        setSelectedDay(null);
                        setSelectedMonth(today.getMonth() + 1);
                        setSelectedYear(today.getFullYear());
                        fetchTransactions(today.getFullYear(), today.getMonth() + 1);
                    }}
                >
                    Clear Day
                </Button>
            </Stack>


            <Box sx={{mb: 2, p: 2, bgcolor: "#e3f2fd", borderRadius: 2}}>
                <Typography color="black">
                    {selectedDay
                        ? `Showing transactions for date: ${selectedDay} ${monthNames[selectedMonth ?? 0]} ${selectedYear}`
                        : selectedMonth && selectedYear
                            ? `Showing transactions for this month: ${monthNames[selectedMonth]} ${selectedYear}`
                            : "Showing transactions for today"}
                </Typography>
            </Box>

            <Box sx={{width: "100%"}}> {error ? (<Typography color="error">{error}</Typography>) : (
                <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[5, 10, 25]} autoHeight
                          onRowClick={(params: GridRowParams) => handleRowClick(params.id as number)}
                          localeText={{noRowsLabel: "No transactions found for the selected date/month!"}}/>)} </Box>
            <Box color='black' sx={{mt: 2, p: 2, bgcolor: "#f0f0f0", borderRadius: 2}}> <Typography variant="body1">Total
                Income: €{totalIncome}</Typography> <Typography variant="body1">Total Expense:
                €{totalExpense}</Typography> <Typography variant="body1" fontWeight="bold"> Difference:
                €{difference} </Typography> </Box>
            {
                selectTransactionId && (
                    <TransactionDetailsPopUp
                        open={popUpOpen}
                        onClose={() => setPopUpOpen(false)}
                        transactionId={selectTransactionId}
                        onDetails={() => fetchTransactions(selectedYear, selectedMonth, selectedDay)}
                    />
                )
            }

            {
                editTransactionId && (
                    <TransactionEditPopUp
                        open={editPopUpOpen}
                        onClose={() => setEditPopUpOpen(false)}
                        transactionId={editTransactionId}
                        onSaved={() => fetchTransactions(selectedYear, selectedMonth, selectedDay)}
                    />
                )
            }

            {
                createPopUpOpen && (
                    <TransactionCreatePopUp
                        open={createPopUpOpen}
                        onClose={() => setCreatePopUpOpen(false)}
                        onCreated={() => fetchTransactions(selectedYear, selectedMonth, selectedDay)}
                    />
                )
            }

            <TransactionDeleteDialog
                open={deleteDialogOpen}
                transactionId={deleteTransactionId}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={() => fetchTransactions(selectedYear, selectedMonth, selectedDay)}
            />
        </PageContainer>
    )
        ;
}
