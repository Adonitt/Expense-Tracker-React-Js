import * as React from "react";
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
    TextField,
    Typography
} from "@mui/material";
import type {TransactionDetailsPayload} from "../../services/transactionsService.ts";
import {transactionsService} from "../../services/transactionsService.ts";
import {toast} from "react-toastify";

interface TransactionEditPopUpProps {
    open: boolean;
    onClose: () => void;
    transactionId: number;
    onSaved?: () => void;
}

export function TransactionEditPopUp({open, onClose, transactionId, onSaved}: TransactionEditPopUpProps) {
    const [transaction, setTransaction] = useState<TransactionDetailsPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>("");

    useEffect(() => {
        if (!transactionId || !open) return;

        setLoading(true);
        setTransaction(null);
        setError(null);
        toast.warning('Updating transaction with ID: ' + transactionId + ' ...')

        transactionsService.getTransactionById(transactionId)
            .then(res => {
                setTransaction(res);
                setAmount(res.amount);
                setType(res.type);
                setCategory(res.category);
                setDescription(res.description);
                setDate(res.date);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [transactionId, open]);

    const handleSave = async () => {
        if (!transaction) return;

        // ✅ Simple validation
        if (amount <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }
        if (!type) {
            toast.error("Type is required");
            return;
        }
        if (!category) {
            toast.error("Category is required");
            return;
        }
        if (!description.trim()) {
            toast.error("Description is required");
            return;
        }
        if (!date) {
            toast.error("Date is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await transactionsService.updateTransactionById(
                {category, amount, type, description, date},
                transactionId
            );
            toast.success(`Transaction with ID: ${transactionId} updated successfully!`);

            if (onSaved) onSaved();
            onClose();
        } catch (err: any) {
            toast.error(err.message || `Failed to update transaction with ID: ${transactionId}`);
        } finally {
            setSaving(false);
        }
    };

    const incomeCategories = ["SALARY", "FREELANCE", "BUSINESS", "INVESTMENT", "GIFTS", "SAVINGS", "OTHER"];
    const expenseCategories = ["RENT", "GROCERIES", "UTILITIES", "SUBSCRIPTIONS", "TRANSPORT", "HEALTHCARE", "ENTERTAINMENT", "EDUCATION", "TAXES", "INSURANCE", "SHOPPING", "TRAVEL", "OTHER"];


    return (
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
            <DialogTitle>Edit Transaction - ID: {transactionId}</DialogTitle>
            <DialogContent dividers>
                {loading && <CircularProgress sx={{display: 'block', mx: 'auto', my: 3}}/>}
                {error && <Typography color="error">{error}</Typography>}

                {transaction && (
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Amount</Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </Paper>
                        </Grid>


                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2, borderRadius: 2}}>
                                <Typography variant="overline" sx={{mb: 1, display: 'block'}}>Type</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    SelectProps={{native: true}}
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: 'background.default',
                                        '& select': {padding: '10px', fontSize: '0.95rem'},
                                        '& fieldset': {borderColor: '#ccc'},
                                        '&:hover fieldset': {borderColor: '#999'},
                                    }}
                                >
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                </TextField>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2, borderRadius: 2}}>
                                <Typography variant="overline" sx={{mb: 1, display: 'block'}}>Category</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    SelectProps={{native: true}}
                                    variant="outlined"
                                    sx={{backgroundColor: 'background.default'}}
                                >
                                    {(type === "INCOME" ? incomeCategories : expenseCategories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </TextField>
                            </Paper>
                        </Grid>


                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Description</Typography>
                                <TextField
                                    fullWidth
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Date</Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    InputLabelProps={{shrink: true}}
                                />
                            </Paper>
                        </Grid>

                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}
                        disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </DialogActions>
        </Dialog>
    );
}
