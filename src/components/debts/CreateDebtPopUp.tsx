import {useState} from "react";
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
    Typography
} from "@mui/material";

import {
    AccountCircle,
    AttachMoney,
    Event,
    Description,
    Category,
    Close
} from "@mui/icons-material";

import {toast} from "react-toastify";
import {debtsService, type CreateDebtPayload} from "../../services/debtsService";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateDebtPopUp({open, onClose, onCreated}: Props) {

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
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1
                }
            }}
        >
            {/* HEADER */}
            <DialogTitle sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography fontWeight="bold" variant="h6">
                    Create New Debt
                </Typography>

                <IconButton onClick={handleClose}>
                    <Close/>
                </IconButton>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent>
                <Box sx={{mt: 1}}>
                    <Grid container spacing={2}>

                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Person"
                                placeholder="Person"
                                value={form.person}
                                onChange={(e) => setForm({...form, person: e.target.value})}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

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
                                    ),
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
                                    setForm({...form, type: e.target.value as any})
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Category/>
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value="LENT">Lent (I gave)</MenuItem>
                                <MenuItem value="BORROWED">Borrowed (I took)</MenuItem>
                            </TextField>
                        </Grid>

                        {/* DATE */}
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                InputLabelProps={{shrink: true}}
                                value={form.date}
                                onChange={(e) =>
                                    setForm({...form, date: e.target.value})
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Event/>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* DESCRIPTION */}
                        <Grid size={{xs: 12}}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    placeholder={"Write the reason..."}
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

                    </Grid>
                </Box>
            </DialogContent>

            {/* ACTIONS */}
            <DialogActions sx={{p: 2}}>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                        px: 3,
                        borderRadius: 2,
                        fontWeight: "bold"
                    }}
                >
                    {saving ? "Saving..." : "Create Debt"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}