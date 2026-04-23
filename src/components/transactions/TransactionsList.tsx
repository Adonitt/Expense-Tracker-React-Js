import {useEffect, useState} from "react";
import {transactionsService} from "../../services/transactionsService.ts";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    Paper,
    Stack,
    TablePagination,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import PageContainer from "../users/PageContainer.tsx";
import {TransactionEditPopUp} from "./TransactionEditPopUp.tsx";
import {TransactionCreatePopUp} from "./TransactionCreatePopUp.tsx";
import {TransactionDeleteDialog} from "./TransactionDeleteDialog.tsx";
import {TransactionDetailsPopUp} from "./TransactionDetailsPopUp.tsx";
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

    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const isDark = localStorage.theme === "dark";

    const fetchTransactions = (from?: string, to?: string) => {
        if (!from || !to) return;
        setLoading(true);
        transactionsService.getFilteredTransactions(from, to)
            .then(res => setTransactions(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const today = new Date();
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);
        const f = last7.toISOString().split("T")[0];
        const t = today.toISOString().split("T")[0];
        setFromDate(f);
        setToDate(t);
        fetchTransactions(f, t);
    }, []);

    const setMonthFilter = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const f = firstDay.toISOString().split("T")[0];
        const t = now.toISOString().split("T")[0];
        setFromDate(f);
        setToDate(t);
        setPage(0);
        fetchTransactions(f, t);
    };

    const handleApplyFilter = () => {
        setPage(0);
        fetchTransactions(fromDate, toDate);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const paginatedTransactions = transactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);
    const totalVolume = totalIncome + totalExpense;
    const expensePercentage = totalVolume > 0 ? (totalExpense / totalVolume) * 100 : 0;

    return (
        <PageContainer title="Finance Tracker">
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 4}}>
                <Box>
                    <Typography variant="h4" fontWeight="800">Transactions</Typography>
                    <Typography variant="body2" color="text.secondary">Manage your daily cash flow</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => setCreatePopUpOpen(true)}
                    sx={{borderRadius: 3, px: 3, py: 1, boxShadow: 3}}
                >
                    Add New
                </Button>
            </Stack>

            <Paper elevation={0} sx={{p: 2, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider'}}>
                <Stack direction={{xs: "column", md: "row"}} spacing={2} alignItems="center">
                    <TextField
                        type="date" size="small" label="From" InputLabelProps={{shrink: true}}
                        value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                        sx={{width: {xs: "100%", md: 200}}}
                    />
                    <TextField
                        type="date" size="small" label="To" InputLabelProps={{shrink: true}}
                        value={toDate} onChange={(e) => setToDate(e.target.value)}
                        sx={{width: {xs: "100%", md: 200}}}
                    />
                    <Button variant="contained" onClick={handleApplyFilter} startIcon={<FilterListIcon/>}>
                        Apply
                    </Button>
                    <Button variant="outlined" onClick={setMonthFilter} startIcon={<CalendarMonthIcon/>}>
                        This Month
                    </Button>
                </Stack>
            </Paper>

            <Typography variant="h6" sx={{mb: 2, fontWeight: 'bold'}}>Activity Feed</Typography>
            <Paper elevation={0}
                   sx={{borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden'}}>
                <List sx={{p: 0}}>
                    {loading ? (
                        <LinearProgress/>
                    ) : transactions.length === 0 ? (
                        <Typography sx={{p: 4, textAlign: 'center'}}>No transactions found.</Typography>
                    ) : (
                        paginatedTransactions.map((t, index) => (
                            <Box key={t.id}>
                                <ListItem
                                    disablePadding
                                    sx={{
                                        py: {xs: 1.5, sm: 2},
                                        px: {xs: 1.5, sm: 2},
                                        flexDirection: {xs: 'column', sm: 'row'},
                                        alignItems: {xs: 'flex-start', sm: 'center'},
                                        '&:hover': {bgcolor: 'action.hover', cursor: 'pointer'},
                                        position: 'relative'
                                    }}
                                    onClick={() => {
                                        setSelectTransactionId(t.id);
                                        setPopUpOpen(true);
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" sx={{width: '100%'}} spacing={2}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexGrow: {xs: 1, sm: 0},
                                            minWidth: {sm: '180px', md: '220px'}
                                        }}>
                                            <ListItemAvatar sx={{minWidth: 'auto', mr: 2}}>
                                                <Avatar sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: t.type === "INCOME" ? 'success.900' : 'error.900',
                                                    color: t.type === "INCOME" ? '#4caf50' : '#f44336',
                                                    border: '1px solid'
                                                }}>
                                                    {t.type === "INCOME" ? <TrendingUpIcon fontSize="small"/> :
                                                        <TrendingDownIcon fontSize="small"/>}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <Box>
                                                <Typography fontWeight="700" variant="body1" sx={{lineHeight: 1.2}}>
                                                    {t.category}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {t.date}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{
                                            minWidth: {xs: 'auto', sm: '100px'},
                                            textAlign: 'right',
                                            pr: {xs: 0, sm: 20},
                                            ml: 'auto'
                                        }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="900"
                                                sx={{
                                                    color: t.type === "INCOME" ? "success.main" : "error.main",
                                                    fontSize: {xs: '1.1rem', sm: '1rem'}
                                                }}
                                            >
                                                {t.type === "INCOME" ? `+${t.amount}` : `-${t.amount}`}€
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            flexGrow: 1,
                                            display: {xs: 'none', sm: 'block'},
                                            px: 2
                                        }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontStyle: 'italic',
                                                    fontSize: '0.85rem',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {t.description || "—"}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {t.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: {xs: 'block', sm: 'none'},
                                                pl: 7,
                                                width: '80%',
                                                fontStyle: 'italic',
                                                fontSize: '0.85rem',
                                                mt: 0.5
                                            }}
                                        >
                                            {t.description}
                                        </Typography>
                                    )}

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            width: {xs: '100%', sm: 'auto'},
                                            justifyContent: {xs: 'flex-end', sm: 'center'},
                                            mt: {xs: 1, sm: 0},
                                            position: {sm: 'absolute'},
                                            right: {sm: 16}
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditTransactionId(t.id);
                                                setEditPopUpOpen(true);
                                            }}
                                            sx={{bgcolor: {xs: 'action.selected', sm: 'transparent'}}}
                                        >
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteTransactionId(t.id);
                                                setDeleteDialogOpen(true);
                                            }}
                                            sx={{bgcolor: {xs: 'error.lighter', sm: 'transparent'}}}
                                        >
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                    </Stack>
                                </ListItem>
                                {index < paginatedTransactions.length - 1 && <Divider component="li"/>}
                            </Box>
                        ))
                    )}
                </List>
                {!loading && transactions.length > 0 && (
                    <TablePagination
                        component="div"
                        count={transactions.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                    />
                )}
            </Paper>
            <Grid spacing={3} sx={{m: 4}}>

                <Grid item xs={12} md={8}>

                    <Paper sx={{p: 3, borderRadius: 4, height: '100%', bgcolor: isDark ? '#1e293b' : '#fff'}}>

                        <Typography variant="subtitle2" gutterBottom color="text.secondary">EXPENSE VS INCOME

                            RATIO</Typography>

                        <Stack direction="row" justifyContent="space-between" sx={{mb: 1}}>

                            <Typography variant="h6" fontWeight="bold" color="error.main">-{totalExpense}€</Typography>

                            <Typography variant="h6" fontWeight="bold" color="success.main">+{totalIncome}€</Typography>

                        </Stack>

                        <Tooltip title={`${Math.round(expensePercentage)}% of total volume is expenses`}>

                            <Box sx={{

                                width: '100%',

                                height: 12,

                                bgcolor: '#e0e0e0',

                                borderRadius: 5,

                                overflow: 'hidden',

                                display: 'flex'

                            }}>

                                <Box sx={{width: `${expensePercentage}%`, bgcolor: 'error.main', transition: '0.5s'}}/>

                                <Box sx={{

                                    width: `${100 - expensePercentage}%`,

                                    bgcolor: 'success.main',

                                    transition: '0.5s'

                                }}/>

                            </Box>

                        </Tooltip>

                        <Stack direction="row" spacing={2} sx={{mt: 2}}>

                            <Chip size="small" label="Expenses" sx={{bgcolor: 'error.light', color: 'error.dark'}}/>

                            <Chip size="small" label="Income" sx={{bgcolor: 'success.light', color: 'success.dark'}}/>

                        </Stack>

                    </Paper>

                </Grid>

                <Grid item xs={12} md={4}>

                    <BalanceCard income={totalIncome} expense={totalExpense}/>

                </Grid>

            </Grid>


            {/* Të gjitha Pop-ups tuaja mbesin njësoj */}

            {createPopUpOpen && <TransactionCreatePopUp open={createPopUpOpen} onClose={() => setCreatePopUpOpen(false)}

                                                        onCreated={() => fetchTransactions(fromDate, toDate)}/>}

            {editPopUpOpen && <TransactionEditPopUp open={editPopUpOpen} onClose={() => setEditPopUpOpen(false)}

                                                    transactionId={editTransactionId!}

                                                    onSaved={() => fetchTransactions(fromDate, toDate)}/>}

            <TransactionDeleteDialog open={deleteDialogOpen} transactionId={deleteTransactionId}

                                     onClose={() => setDeleteDialogOpen(false)}

                                     onDelete={() => fetchTransactions(fromDate, toDate)}/>

            {selectTransactionId && <TransactionDetailsPopUp open={popUpOpen} onClose={() => setPopUpOpen(false)}

                                                             transactionId={selectTransactionId}

                                                             onDetails={() => fetchTransactions(fromDate, toDate)}/>}


        </PageContainer>

    );

}