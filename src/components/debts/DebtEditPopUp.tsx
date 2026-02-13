import { useEffect, useState } from "react";
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
import { debtsService } from "../../services/debtsService.ts";
import { toast } from "react-toastify";
import type { DebtDetailsPayload } from "../../services/debtsService.ts";

interface DebtEditPopUpProps {
    open: boolean;
    onClose: () => void;
    debtId: number;
    onSaved?: () => void;
}

export function DebtEditPopUp({ open, onClose, debtId, onSaved }: DebtEditPopUpProps) {

    const [debt, setDebt] = useState<DebtDetailsPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [amount, setAmount] = useState(0);
    const [person, setPerson] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        if (!debtId || !open) return;

        setLoading(true);

        debtsService.getDebtById(debtId)
            .then(res => {
                setDebt(res);
                setAmount(res.amount);
                setPerson(res.person);
                setDescription(res.description);
                setType(res.type);
                setStatus(res.status);
                setDate(res.date);
            })
            .finally(() => setLoading(false));

    }, [debtId, open]);

    const handleSave = async () => {

        if (amount <= 0) return toast.error("Amount must be greater than 0");
        if (!person.trim()) return toast.error("Person is required");
        if (!description.trim()) return toast.error("Description is required");
        if (!type) return toast.error("Type is required");
        if (!status) return toast.error("Status is required");

        setSaving(true);

        try {
            await debtsService.updateDebtById(
                { amount, person, description, type, status, date },
                debtId
            );

            toast.success(`Debt ${debtId} updated successfully`);

            if (onSaved) onSaved();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to update debt");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Debt - ID: {debtId}</DialogTitle>
            <DialogContent dividers>
                {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}

                {debt && (
                    <Grid container spacing={2}>

                        <Grid xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="overline">Person</Typography>
                                <TextField fullWidth value={person} onChange={(e) => setPerson(e.target.value)} />
                            </Paper>
                        </Grid>

                        <Grid xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="overline">Amount</Typography>
                                <TextField fullWidth type="number" value={amount}
                                           onChange={(e) => setAmount(Number(e.target.value))} />
                            </Paper>
                        </Grid>

                        <Grid xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="overline">Description</Typography>
                                <TextField fullWidth value={description}
                                           onChange={(e) => setDescription(e.target.value)} />
                            </Paper>
                        </Grid>

                        <Grid xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="overline">Type</Typography>
                                <TextField select fullWidth value={type}
                                           onChange={(e) => setType(e.target.value)}
                                           SelectProps={{ native: true }}>
                                    <option value="LENT">LENT</option>
                                    <option value="BORROWED">BORROWED</option>
                                </TextField>
                            </Paper>
                        </Grid>

                        <Grid xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="overline">Status</Typography>
                                <TextField select fullWidth value={status}
                                           onChange={(e) => setStatus(e.target.value)}
                                           SelectProps={{ native: true }}>
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                </TextField>
                            </Paper>
                        </Grid>

                        <Grid xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="overline">Date</Typography>
                                <TextField fullWidth type="date" value={date}
                                           onChange={(e) => setDate(e.target.value)} />
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
