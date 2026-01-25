import {useState} from "react";
import {type CreateTransactionPayload, transactionsService} from "../../services/transactionsService.ts";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Button, Paper} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {toast} from "react-toastify";

interface TransactionCreatePopUpProps {
    open: boolean,
    onClose: () => void
    onCreated: () => void
}

export function TransactionCreatePopUp({open, onClose, onCreated}: TransactionCreatePopUpProps) {
    const [form, setForm] = useState<CreateTransactionPayload>({
        category: 'SALARY',
        amount: 0,
        type: 'INCOME',
        description: '',
        date: ''
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
            toast.warning("Please fill all required fields and make sure the amount is greater than 0.")
            return
        }
        try {
            setSaving(true)
            await transactionsService.createTransaction(form)
            if (onCreated) onCreated()
            onClose()
            toast.success("Transaction created successfully!")
        } catch (err) {
            setError(err.message || "Failed to create transaction")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Transaction</DialogTitle>

            <DialogContent dividers>
                {error && <Typography color="error">{error}</Typography>}

                <Grid container spacing={2}>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="overline">Amount</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={form.amount}
                                onChange={(e) =>
                                    setForm({...form, amount: Number(e.target.value)})
                                }
                            />
                        </Paper>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="overline">Type</Typography>
                            <TextField
                                select
                                fullWidth
                                value={form.type}
                                onChange={(e) =>
                                    setForm({...form, type: e.target.value as any})
                                }
                                SelectProps={{native: true}}
                            >
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </TextField>
                        </Paper>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="overline">Category</Typography>
                            <TextField
                                select
                                fullWidth
                                value={form.category}
                                onChange={(e) =>
                                    setForm({...form, category: e.target.value})
                                }
                                SelectProps={{native: true}}
                            >
                                {(form.type === "INCOME"
                                        ? incomeCategories
                                        : expenseCategories
                                ).map(cat => (
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
                                value={form.description}
                                onChange={(e) =>
                                    setForm({...form, description: e.target.value})
                                }
                            />
                        </Paper>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="overline">Date</Typography>
                            <TextField
                                fullWidth
                                type="date"
                                value={form.date}
                                onChange={(e) =>
                                    setForm({...form, date: e.target.value})
                                }
                            />
                        </Paper>
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>

    )
}