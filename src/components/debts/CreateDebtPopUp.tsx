import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    InputAdornment,
    IconButton,
    Typography,
    Grid,
    Avatar,
    Stack,
    Box
} from "@mui/material";
import {
    AccountCircle,
    Event,
    Description,
    Category,
    Close,
    AttachMoney,
    TrendingUp,
    TrendingDown
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { debtsService, type CreateDebtPayload } from "../../services/debtsService";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateDebtPopUp({ open, onClose, onCreated }: Props) {
    const initialForm: CreateDebtPayload = {
        amount: 0,
        person: "",
        description: "",
        type: "LENT",
        date: new Date().toISOString().split("T")[0],
    };

    const [form, setForm] = useState<CreateDebtPayload>(initialForm);
    const [saving, setSaving] = useState(false);

    const validate = () => {
        if (!form.amount || form.amount <= 0) return "Amount must be greater than 0";
        if (!form.person.trim()) return "Person is required";
        if (!form.description.trim()) return "Description is required";
        if (!form.date) return "Date is required";
        return null;
    };

    const handleClose = () => {
        setForm(initialForm);
        onClose();
    };

    const handleSave = async () => {
        const err = validate();
        if (err) {
            toast.warning(err);
            return;
        }

        try {
            setSaving(true);
            await debtsService.createDebt(form);
            toast.success("Debt created successfully");
            onCreated();
            handleClose();
        } catch (e: any) {
            toast.error(e.message || "Failed to create debt");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, pb: 1 }}>
                Create New Debt
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderBottom: 'none' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, mt: 1 }}>
                    <Avatar sx={{
                        width: 56,
                        height: 56,
                        bgcolor: form.type === "LENT" ? 'error.900' : 'success.900',
                        color: form.type === "LENT" ? '#f44336' : '#4caf50',
                        border: '1px solid'
                    }}>
                        {form.type === "LENT" ? <TrendingDown fontSize="large" /> : <TrendingUp fontSize="large" />}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="900" color={form.type === "LENT" ? "error.main" : "success.main"}>
                            {form.type === "LENT" ? "Money Lent" : "Money Borrowed"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Fill in the details for this debt
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={3}>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Person</Typography>
                        <TextField
                            fullWidth
                            placeholder="Person name?"
                            value={form.person}
                            onChange={(e) => setForm({ ...form, person: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Amount (€)</Typography>
                        <TextField
                            fullWidth
                            type="number"
                            placeholder="How much?"
                            value={form.amount || ""}
                            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoney color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Type</Typography>
                        <TextField
                            select
                            fullWidth
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Category color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        >
                            <MenuItem value="LENT">Lent (I gave)</MenuItem>
                            <MenuItem value="BORROWED">Borrowed (I took)</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Date</Typography>
                        <TextField
                            fullWidth
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Event color="primary" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Description & Reason
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                variant="standard"
                                placeholder="Why did this happen?"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 0.5 }}>
                                            <Description color="primary" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontSize: '0.95rem' }
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={handleClose} color="inherit" sx={{ borderRadius: 2, px: 3 }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: 2, px: 4, fontWeight: "bold", boxShadow: 3 }}
                >
                    {saving ? "Saving..." : "Create Debt"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}