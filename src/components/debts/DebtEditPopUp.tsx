import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem,
    InputAdornment,
    IconButton,
    Box,
    Typography,
    CircularProgress
} from "@mui/material";

import {
    AccountCircle,
    AttachMoney,
    Event,
    Description,
    Category,
    Close
} from "@mui/icons-material";

import { debtsService } from "../../services/debtsService";
import { toast } from "react-toastify";

interface DebtEditPopUpProps {
    open: boolean;
    onClose: () => void;
    debtId: number;
    onSaved: () => void;
}

export function DebtEditPopUp({
                                  open,
                                  onClose,
                                  debtId,
                                  onSaved
                              }: DebtEditPopUpProps) {

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        amount: 0,
        person: "",
        description: "",
        type: "LENT" as "LENT" | "BORROWED",
        status: "PENDING" as "PENDING" | "PAID",
        date: ""
    });

    useEffect(() => {
        if (!open || !debtId) return;

        setLoading(true);

        debtsService.getDebtById(debtId)
            .then(res => {
                setForm({
                    amount: res.amount,
                    person: res.person,
                    description: res.description,
                    type: res.type,
                    status: res.status,
                    date: res.date
                });
            })
            .finally(() => setLoading(false));

    }, [open, debtId]);

    const handleSave = async () => {
        if (form.amount <= 0) return toast.error("Amount must be greater than 0");
        if (!form.person.trim()) return toast.error("Person is required");
        if (!form.description.trim()) return toast.error("Description is required");

        try {
            setSaving(true);

            await debtsService.updateDebtById(form, debtId);

            toast.success("Debt updated successfully");

            onSaved();
            onClose();

        } catch (e: any) {
            toast.error(e.message || "Update failed");
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
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            {/* HEADER */}
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight="bold" variant="h6">
                    Edit Debt
                </Typography>

                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>

                            {/* PERSON */}
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    label="Person"
                                    value={form.person}
                                    onChange={(e) =>
                                        setForm({ ...form, person: e.target.value })
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* AMOUNT */}
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Amount"
                                    value={form.amount || ""}
                                    onChange={(e) =>
                                        setForm({ ...form, amount: Number(e.target.value) })
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                €
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* TYPE */}
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Type"
                                    value={form.type}
                                    onChange={(e) =>
                                        setForm({ ...form, type: e.target.value as any })
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Category />
                                            </InputAdornment>
                                        )
                                    }}
                                >
                                    <MenuItem value="LENT">Lent</MenuItem>
                                    <MenuItem value="BORROWED">Borrowed</MenuItem>
                                </TextField>
                            </Grid>

                            {/* STATUS */}
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({ ...form, status: e.target.value as any })
                                    }
                                >
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="PAID">Paid</MenuItem>
                                </TextField>
                            </Grid>

                            {/* DATE */}
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={form.date}
                                    onChange={(e) =>
                                        setForm({ ...form, date: e.target.value })
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Event />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" >
                                                <Description />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            alignItems: "flex-start"
                                        }
                                    }}
                                />
                            </Grid>

                        </Grid>
                    </Box>
                )}
            </DialogContent>

            {/* ACTIONS */}
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ px: 3, borderRadius: 2, fontWeight: "bold" }}
                >
                    {saving ? "Saving..." : "Update Debt"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}