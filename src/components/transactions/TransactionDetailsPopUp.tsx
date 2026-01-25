import {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import type {TransactionDetailsPayload} from "../../services/transactionsService.ts";
import {transactionsService} from "../../services/transactionsService.ts";
import {TransactionEditPopUp} from "./TransactionEditPopUp.tsx";

interface TransactionDetailsPopUpProps {
    open: boolean;
    onClose: () => void;
    transactionId: number;
}

export function TransactionDetailsPopUp({open, onClose, transactionId}: TransactionDetailsPopUpProps) {
    const [transaction, setTransaction] = useState<TransactionDetailsPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editPopUpOpen, setEditPopUpOpen] = useState(false);

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

    const handleEditClick = () => {
        setEditPopUpOpen(true);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        backgroundColor: 'background.default',
                        color: 'text.primary',
                    }
                }}
                BackdropProps={{
                    sx: {backgroundColor: 'rgba(0,0,0,0.9)'}
                }}
            >
                <DialogTitle>Transaction Details - ID: {transactionId}</DialogTitle>
                <DialogContent dividers>
                    {loading && <CircularProgress sx={{display: 'block', mx: 'auto', my: 3}}/>}
                    {error && <Typography color="error">{error}</Typography>}
                    {transaction && (
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">User ID</Typography>
                                    <Typography>{transaction.userId}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">User</Typography>
                                    <Typography>{transaction.userFullName}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Amount</Typography>
                                    <Typography>{transaction.type === "INCOME" ? `+${transaction.amount}` : `-${transaction.amount}`}</Typography>
                                </Paper>
                            </Grid>
                            {transaction.debtId && (
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Paper sx={{p: 2}}>
                                        <Typography variant="overline">Debt ID</Typography>
                                        <Typography>{transaction.debtId}</Typography>
                                    </Paper>
                                </Grid>
                            )}
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Type</Typography>
                                    <Typography>{transaction.type}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Category</Typography>
                                    <Typography>{transaction.category}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Description</Typography>
                                    <Typography>{transaction.description}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Date</Typography>
                                    <Typography>{transaction.date}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Created At</Typography>
                                    <Typography>{new Date(transaction.createdAt).toLocaleString()}</Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Last Updated At</Typography>
                                    <Typography>{transaction.updatedAt ? new Date(transaction.updatedAt).toLocaleString() : '-'}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Close</Button>
                    <Button variant="contained" onClick={handleEditClick}>Edit</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Popup */}
            {transaction && (
                <TransactionEditPopUp
                    open={editPopUpOpen}
                    onClose={() => setEditPopUpOpen(false)}
                    transactionId={transactionId}
                    onSaved={() => {
                        setEditPopUpOpen(false);
                        transactionsService.getTransactionById(transactionId).then(res => setTransaction(res));
                    }}
                />
            )}
        </>
    );
}
