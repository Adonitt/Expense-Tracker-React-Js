import { useState } from "react";
import { type CreateTransactionPayload, transactionsService } from "../../services/transactionsService.ts";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    TextField,
    Button,
    Paper,
    DialogActions,
    Stack,
    Box,
    InputAdornment,
    MenuItem
} from "@mui/material";
import { toast } from "react-toastify";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import Grid from "@mui/material/Grid";

interface TransactionCreatePopUpProps {
    open: boolean,
    onClose: () => void
    onCreated: () => void
}

export function TransactionCreatePopUp({ open, onClose, onCreated }: TransactionCreatePopUpProps) {
    const [form, setForm] = useState<CreateTransactionPayload>({
        category: 'SALARY',
        amount: 0,
        type: 'INCOME',
        description: '',
        date: new Date().toISOString().split('T')[0]
    })

    const incomeCategories = ["SALARY", "FREELANCE", "BUSINESS", "INVESTMENT", "GIFTS", "SAVINGS", "OTHER"];
    const expenseCategories = ["RENT", "GROCERIES", "UTILITIES", "SUBSCRIPTIONS", "TRANSPORT", "HEALTHCARE", "ENTERTAINMENT", "EDUCATION", "TAXES", "INSURANCE", "SHOPPING", "TRAVEL", "OTHER"];

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const validate = () => {
        if (!form.amount || form.amount <= 0) return "Amount must be greater than 0";
        if (!form.type) return "Type is required";
        if (!form.category) return "Category is required";
        if (!form.date) return "Date is required";
        return null;
    }

    const handleSave = async () => {
        const validationError = validate()
        if (validationError) {
            toast.warning(validationError)
            return
        }
        try {
            setSaving(true)
            await transactionsService.createTransaction(form)
            onCreated()
            onClose()
            toast.success("Transaction created successfully!")
        } catch (err: any) {
            setError(err.message || "Failed to create transaction")
        } finally {
            setSaving(false)
        }
    }

    return (
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
            <DialogTitle sx={{ fontWeight: 800 }}>Create New Transaction</DialogTitle>

            <DialogContent dividers sx={{ borderBottom: 'none' }}>
                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Grid container spacing={3} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Amount (€)</Typography>
                        <TextField
                            fullWidth
                            type="number"
                            variant="outlined"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Type</Typography>
                        <TextField
                            select
                            fullWidth
                            value={form.type}
                            onChange={(e) => {
                                const newType = e.target.value as 'INCOME' | 'EXPENSE';
                                setForm({
                                    ...form,
                                    type: newType,
                                    category: newType === 'INCOME' ? 'SALARY' : 'RENT'
                                });
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CompareArrowsIcon color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        >
                            <MenuItem value="INCOME">Income</MenuItem>
                            <MenuItem value="EXPENSE">Expense</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Category</Typography>
                        <TextField
                            select
                            fullWidth
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CategoryIcon color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        >
                            {(form.type === "INCOME" ? incomeCategories : expenseCategories).map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Date</Typography>
                        <TextField
                            fullWidth
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Description</Typography>
                        <TextField
                            fullWidth
                            multiline
                            placeholder="Add a note..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start' }}>
                                        <DescriptionIcon color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 4 }
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={onClose}
                    disabled={saving}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                >
                    {saving ? "Saving..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}