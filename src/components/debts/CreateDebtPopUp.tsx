import {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Button, Paper, MenuItem} from "@mui/material";
import {toast} from "react-toastify";
import {debtsService, type CreateDebtPayload} from "../../services/debtsService";

interface CreateDebtPopUpProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateDebtPopUp({open, onClose, onCreated}: CreateDebtPopUpProps) {

    const [form, setForm] = useState<CreateDebtPayload>({
        amount: 0,
        person: "",
        description: "",
        type: "LENT",
        status: "PENDING",
        date: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validate = () => {
        if (!form.amount || form.amount <= 0) return "Amount must be greater than 0";
        if (!form.person) return "Person is required";
        if (!form.type) return "Type is required";
        if (!form.description) return "Description is required";
        if (!form.status) return "Status is required";
        if (!form.date) return "Date is required";
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
            await debtsService.createDebt(form);
            if (onCreated) onCreated();
            onClose();
            toast.success("Debt created successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to create debt");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Debt</DialogTitle>

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
                            <Typography variant="overline">Person</Typography>
                            <TextField
                                fullWidth
                                value={form.person}
                                onChange={(e) =>
                                    setForm({...form, person: e.target.value})
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
                                    setForm({...form, type: e.target.value})
                                }
                            >
                                <MenuItem value="LENT">LENT</MenuItem>
                                <MenuItem value="BORROWED">BORROWED</MenuItem>
                            </TextField>
                        </Paper>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="overline">Status</Typography>
                            <TextField
                                select
                                fullWidth
                                value={form.status}
                                onChange={(e) =>
                                    setForm({...form, status: e.target.value})
                                }
                            >
                                <MenuItem value="PENDING">PENDING</MenuItem>
                                <MenuItem value="PAID">PAID</MenuItem>
                            </TextField>
                        </Paper>
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="overline">Description</Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                value={form.description}
                                onChange={(e) =>
                                    setForm({...form, description: e.target.value})
                                }
                            />
                        </Paper>
                    </Grid>

                    {/* Date */}
                    <Grid size={{xs: 12, sm: 6}}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="overline">Date</Typography>
                            <TextField
                                fullWidth
                                type="date"
                                InputLabelProps={{shrink: true}}
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
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
