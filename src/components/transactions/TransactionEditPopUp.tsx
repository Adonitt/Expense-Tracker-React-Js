import {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {
    AttachMoney,
    Category,
    Close,
    CompareArrows,
    Description,
    Event,
    TrendingDown,
    TrendingUp
} from "@mui/icons-material";
import {toast} from "react-toastify";
import {transactionsService} from "../../services/transactionsService.ts";

interface TransactionEditPopUpProps {
    open: boolean;
    onClose: () => void;
    transactionId: number;
    onSaved?: () => void;
}

export function TransactionEditPopUp({open, onClose, transactionId, onSaved}: TransactionEditPopUpProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<string>("INCOME");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>("");

    const incomeCategories = ["SALARY", "FREELANCE", "BUSINESS", "INVESTMENT", "GIFTS", "SAVINGS", "OTHER"];
    const expenseCategories = ["RENT", "GROCERIES", "UTILITIES", "SUBSCRIPTIONS", "TRANSPORT", "HEALTHCARE", "ENTERTAINMENT", "EDUCATION", "TAXES", "INSURANCE", "SHOPPING", "TRAVEL", "OTHER"];

    useEffect(() => {
        if (!transactionId || !open) return;

        setLoading(true);
        setError(null);

        transactionsService.getTransactionById(transactionId)
            .then(res => {
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
        if (amount <= 0 || !type || !category || !date) {
            toast.warning("Ju lutem mbushni të gjitha fushat e nevojshme.");
            return;
        }

        setSaving(true);
        try {
            await transactionsService.updateTransactionById(
                {category, amount, type, description, date},
                transactionId
            );
            toast.success("Transaksioni u përditësua me sukses!");
            if (onSaved) onSaved();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to update transaction");
        } finally {
            setSaving(false);
        }
    };
    const typeLabel: any = {
        INCOME: "Të ardhura",
        EXPENSE: "Shpenzim",
        DEBT: "Borxh"
    };
    const categoryLabels: Record<string, string> = {
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
        TRAVEL: "Udhëtim",
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{sx: {borderRadius: 4, backgroundImage: 'none'}}}
        >
            <DialogTitle sx={{display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800}}>
                Edit Transaction
                <IconButton onClick={onClose} size="small">
                    <Close/>
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{borderBottom: 'none'}}>
                {loading ? (
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', my: 5}}>
                        <CircularProgress size={40}/>
                        <Typography sx={{mt: 2}} color="text.secondary">Duke marrë të dhëna...</Typography>
                    </Box>
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 4, mt: 1}}>
                            <Avatar sx={{
                                width: 56,
                                height: 56,
                                bgcolor: type === "INCOME" ? 'success.900' : 'error.900',
                                color: type === "INCOME" ? '#4caf50' : '#f44336',
                                border: '1px solid'
                            }}>
                                {type === "INCOME" ? <TrendingUp fontSize="large"/> : <TrendingDown fontSize="large"/>}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="900"
                                            color={type === "INCOME" ? "success.main" : "error.main"}>
                                    ID: #{transactionId}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Përditëso duke mbushur fushat e nevojshme
                                </Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ml: 1}}>Vlera
                                    (€)</Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoney color="primary"/>
                                            </InputAdornment>
                                        ),
                                        sx: {borderRadius: 3}
                                    }}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary"
                                            sx={{ml: 1}}>Tipi</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={type}
                                    onChange={(e) => {
                                        const newType = e.target.value;
                                        setType(newType);
                                        setCategory(newType === 'INCOME' ? 'SALARY' : 'RENT');
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CompareArrows color="primary"/>
                                            </InputAdornment>
                                        ),
                                        sx: {borderRadius: 3}
                                    }}
                                >
                                    <MenuItem value="INCOME">Të hyra</MenuItem>
                                    <MenuItem value="EXPENSE">Shpenzime</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary"
                                            sx={{ml: 1}}>Kategoria</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Category color="primary"/>
                                            </InputAdornment>
                                        ),
                                        sx: {borderRadius: 3}
                                    }}
                                >
                                    {(type === "INCOME" ? incomeCategories : expenseCategories).map(cat => (
                                        <MenuItem key={cat} value={cat}>
                                            {categoryLabels[cat] || cat}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary"
                                            sx={{ml: 1}}>Data</Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Event color="primary"/>
                                            </InputAdornment>
                                        ),
                                        sx: {borderRadius: 3}
                                    }}
                                />
                            </Grid>

                            <Grid size={{xs: 12}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary"
                                            sx={{ml: 1}}>Përshkrimi</Typography>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'action.hover',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        variant="standard"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        InputProps={{
                                            disableUnderline: true,
                                            startAdornment: (
                                                <InputAdornment position="start"
                                                                sx={{alignSelf: 'flex-start', mt: 0.5}}>
                                                    <Description color="primary"/>
                                                </InputAdornment>
                                            ),
                                            sx: {fontSize: '0.95rem'}
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{p: 3, pt: 1}}>
                <Button onClick={onClose} color="inherit" sx={{borderRadius: 2, px: 3}}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || loading}
                    sx={{borderRadius: 2, px: 4, fontWeight: "bold", boxShadow: 3}}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}