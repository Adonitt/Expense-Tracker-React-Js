import { useState } from "react";
import { type CreateTransactionPayload, transactionsService } from "../../services/transactionsService.ts";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    TextField,
    Button,
    DialogActions,
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
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

/** LABELS (UI only) */
const typeLabel: Record<string, string> = {
    INCOME: "Të hyrë",
    EXPENSE: "Shpenzim"
};

const categoryLabel: Record<string, string> = {
    SALARY: "Rrogë",
    FREELANCE: "Freelance",
    BUSINESS: "Biznes",
    INVESTMENT: "Investim",
    GIFTS: "Dhurata",
    SAVINGS: "Kursime",
    OTHER: "Tjetër",

    RENT: "Qira",
    GROCERIES: "Ushqime",
    UTILITIES: "Fatura",
    SUBSCRIPTIONS: "Abonime",
    TRANSPORT: "Transport",
    HEALTHCARE: "Shëndetësi",
    ENTERTAINMENT: "Argëtim",
    EDUCATION: "Arsim",
    TAXES: "Taksë",
    INSURANCE: "Sigurim",
    SHOPPING: "Pazar",
    TRAVEL: "Udhëtim"
};

export function TransactionCreatePopUp({
                                           open,
                                           onClose,
                                           onCreated
                                       }: TransactionCreatePopUpProps) {

    const [form, setForm] = useState<CreateTransactionPayload>({
        category: "SALARY",
        amount: 0,
        type: "INCOME",
        description: "",
        date: new Date().toISOString().split("T")[0]
    });

    const incomeCategories = ["SALARY", "FREELANCE", "BUSINESS", "INVESTMENT", "GIFTS", "SAVINGS", "OTHER"];
    const expenseCategories = ["RENT", "GROCERIES", "UTILITIES", "SUBSCRIPTIONS", "TRANSPORT", "HEALTHCARE", "ENTERTAINMENT", "EDUCATION", "TAXES", "INSURANCE", "SHOPPING", "TRAVEL", "OTHER"];

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validate = () => {
        if (!form.amount || form.amount <= 0) return "Shuma duhet me qenë më e madhe se 0";
        if (!form.type) return "Tipi është i detyrueshëm";
        if (!form.category) return "Kategoria është e detyrueshme";
        if (!form.date) return "Data është e detyrueshme";
        return null;
    };

    const handleSave = async () => {
        const validationError = validate();
        if (validationError) {
            toast.warning(validationError);
            return;
        }

        try {
            setSaving(true);
            await transactionsService.createTransaction(form);
            onCreated();
            onClose();
            toast.success("Transaksioni u krijua me sukses!");
        } catch (err: any) {
            setError(err.message || "Gabim gjatë krijimit të transaksionit");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 4, backgroundImage: "none" } }}
        >
            <DialogTitle sx={{ fontWeight: 800 }}>
                Krijo Transaksion të Ri
            </DialogTitle>

            <DialogContent dividers sx={{ borderBottom: "none" }}>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Grid container spacing={3} sx={{ mt: 0.5 }}>

                    {/* AMOUNT */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">
                            Shuma (€)
                        </Typography>

                        <TextField
                            fullWidth
                            type="number"
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

                    {/* TYPE */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">
                            Tipi
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            value={form.type}
                            onChange={(e) => {
                                const newType = e.target.value as "INCOME" | "EXPENSE";
                                setForm({
                                    ...form,
                                    type: newType,
                                    category: newType === "INCOME" ? "SALARY" : "RENT"
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
                            <MenuItem value="INCOME">{typeLabel.INCOME}</MenuItem>
                            <MenuItem value="EXPENSE">{typeLabel.EXPENSE}</MenuItem>
                        </TextField>
                    </Grid>

                    {/* CATEGORY */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">
                            Kategoria
                        </Typography>

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
                                <MenuItem key={cat} value={cat}>
                                    {categoryLabel[cat]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* DATE */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">
                            Data
                        </Typography>

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

                    {/* DESCRIPTION */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary">
                            Përshkrimi
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            placeholder="Shkruaj një shënim..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
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
                <Button onClick={onClose} sx={{ borderRadius: 2, px: 3 }}>
                    Anulo
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: 2, px: 4, fontWeight: "bold" }}
                >
                    {saving ? "Duke ruajtur..." : "Krijo"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}