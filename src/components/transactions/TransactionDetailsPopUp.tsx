import {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import type {TransactionDetailsPayload} from "../../services/transactionsService.ts";
import {transactionsService} from "../../services/transactionsService.ts";
import {TransactionEditPopUp} from "./TransactionEditPopUp.tsx";
import {TransactionDeleteDialog} from "./TransactionDeleteDialog.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import {getLoggedInUser} from "../../utils/auth.ts";

interface TransactionDetailsPopUpProps {
    open: boolean;
    onClose: () => void;
    transactionId: number;
    onDetails: () => void;
}

export function TransactionDetailsPopUp({open, onClose, transactionId, onDetails}: TransactionDetailsPopUpProps) {
    const [transaction, setTransaction] = useState<TransactionDetailsPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editPopUpOpen, setEditPopUpOpen] = useState(false);
    const [deletePopUpOpen, setDeletePopUpOpen] = useState(false);

    const user = getLoggedInUser()
    const canModify =
        user?.isActive &&
        transaction?.type !== "DEBT" &&
        transaction?.status !== "INACTIVE";

    useEffect(() => {
        if (!transactionId || !open) return;
        setLoading(true);
        setTransaction(null);
        setError(null);
        transactionsService.getTransactionById(transactionId)
            .then(res => setTransaction(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [transactionId, open]);

    const handleEditClick = () => setEditPopUpOpen(true);
    const handleDeleteClick = () => setDeletePopUpOpen(true);

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{fontWeight: 800, pb: 1}}>Transaction Details</DialogTitle>

                <DialogContent dividers sx={{borderBottom: 'none'}}>
                    {loading && <CircularProgress sx={{display: 'block', mx: 'auto', my: 5}}/>}
                    {error && <Typography color="error" textAlign="center">{error}</Typography>}

                    {transaction && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 4}}>
                                <Avatar sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: transaction.type === "INCOME" ? 'success.900' : 'error.900',
                                    color: transaction.type === "INCOME" ? '#4caf50' : '#f44336',
                                    border: '1px solid'
                                }}>
                                    {transaction.type === "INCOME" ? <TrendingUpIcon fontSize="large"/> :
                                        <TrendingDownIcon fontSize="large"/>}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="900"
                                                color={transaction.type === "INCOME" ? "success.main" : "error.main"}>
                                        {transaction.type === "INCOME" ? `+${transaction.amount}` : `-${transaction.amount}`}€
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: # {transactionId}
                                    </Typography>
                                </Box>
                                <Box sx={{ml: 'auto !important'}}>
                                    <Chip
                                        label={transaction.category}
                                        color={transaction.type === "INCOME" ? "success" : "error"}
                                        variant="outlined"
                                        sx={{fontWeight: 'bold'}}
                                    />
                                </Box>
                            </Stack>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Paper variant="outlined" sx={{p: 2, borderRadius: 3, bgcolor: 'action.hover'}}>
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{display: 'block', mb: 0.5, fontWeight: 'bold'}}>
                                            DESCRIPTION
                                        </Typography>
                                        <Typography variant="body1"
                                                    sx={{fontStyle: transaction.description ? 'normal' : 'italic'}}>
                                            {transaction.description || "No description provided."}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CalendarTodayIcon fontSize="small" color="action"/>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Date</Typography>
                                            <Typography variant="body2" fontWeight="600">{transaction.date}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <UpdateIcon fontSize="small" color="action"/>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">User</Typography>
                                            <Typography variant="body2"
                                                        fontWeight="600">{transaction.userFullName}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}><Divider sx={{my: 1}}/></Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Created At</Typography>
                                    <Typography
                                        variant="body2">{new Date(transaction.createdAt).toLocaleString()}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Last Update</Typography>
                                    <Typography variant="body2">
                                        {transaction.updatedAt ? new Date(transaction.updatedAt).toLocaleString() : '-'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{p: 3, pt: 1}}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<CloseIcon/>}
                        onClick={onClose}
                        sx={{borderRadius: 2}}
                    >
                        Close
                    </Button>

                    {canModify && (
                        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={handleEditClick}
                                sx={{ borderRadius: 2 }}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteClick}
                                sx={{ borderRadius: 2 }}
                            >
                                Delete
                            </Button>
                        </Stack>
                    )}
                </DialogActions>
            </Dialog>

            {transaction && (
                <TransactionEditPopUp
                    open={editPopUpOpen}
                    onClose={() => setEditPopUpOpen(false)}
                    transactionId={transactionId}
                    onSaved={() => {
                        setEditPopUpOpen(false);
                        transactionsService.getTransactionById(transactionId).then(res => setTransaction(res));
                        onDetails();
                    }}
                />
            )}

            {transaction && (
                <TransactionDeleteDialog
                    open={deletePopUpOpen}
                    onClose={() => setDeletePopUpOpen(false)}
                    transactionId={transactionId}
                    onDelete={() => {
                        setDeletePopUpOpen(false);
                        onClose();
                        onDetails();
                    }}
                />
            )}
        </>
    );
}