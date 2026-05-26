import { useEffect, useState } from "react";
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

const initialForm: CreateDebtPayload = {
    amount: 0,
    person: "",
    description: "",
    type: "LENT",
    date: new Date().toISOString().split("T")[0],
};

export function CreateDebtPopUp({ open, onClose, onCreated }: Props) {
    const [form, setForm] = useState<CreateDebtPayload>(initialForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(initialForm);
        }
    }, [open]);

    const validate = () => {
        if (!form.amount || form.amount <= 0) return "Vlera duhet të jetë më e madhe se 0!";
        if (!form.person.trim()) return "Personi është i domosdoshëm";
        if (!form.description.trim()) return "Përshkrimi është i domosdoshëm";
        if (!form.date) return "Data është e domosdoshme";
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

            toast.success("Borxhi u shtua me sukses");

            onCreated();
            handleClose();
        } catch (e: any) {
            toast.error(e?.message || "Dështoi.");
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
            PaperProps={{ sx: { borderRadius: 4, backgroundImage: "none" } }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 800,
                    pb: 1
                }}
            >
                Krijo Borxhin
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderBottom: "none" }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, mt: 1 }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: form.type === "LENT" ? "error.main" : "success.main",
                        }}
                    >
                        {form.type === "LENT" ? (
                            <TrendingDown />
                        ) : (
                            <TrendingUp />
                        )}
                    </Avatar>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="900"
                            color={form.type === "LENT" ? "error.main" : "success.main"}
                        >
                            {form.type === "LENT" ? "Kam dhënë para" : "Kam marrë para"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Plotëso të gjitha fushat
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={3}>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline">Personi</Typography>
                        <TextField
                            fullWidth
                            value={form.person}
                            placeholder={"Shënoni Personin"}
                            onChange={(e) =>
                                setForm({ ...form, person: e.target.value })
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle color="primary" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline">Vlera (€)</Typography>
                        <TextField
                            fullWidth
                            type="number"
                            placeholder={"Shënoni Vlerën"}
                            value={form.amount || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    amount: Number(e.target.value),
                                })
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoney color="primary" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline">Lloji</Typography>
                        <TextField
                            select
                            fullWidth
                            value={form.type}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    type: e.target.value as any,
                                })
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Category color="primary" />
                                    </InputAdornment>
                                )
                            }}
                        >
                            <MenuItem value="LENT">Kam dhënë borxh</MenuItem>
                            <MenuItem value="BORROWED">Kam marrë borxh</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography variant="overline">Data</Typography>
                        <TextField
                            fullWidth
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Event color="primary" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: "action.hover",
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <Typography variant="overline">
                                Përshkrimi / Arsyeja
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                placeholder={"Shënoni Përshkrimin / Arsyen"}
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose}>Anulo</Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Duke ruajtur..." : "Ruaj borxhin"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}