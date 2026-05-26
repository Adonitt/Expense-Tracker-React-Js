import {useEffect, useState} from "react";
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
    Box,
    CircularProgress
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
import {toast} from "react-toastify";
import {debtsService} from "../../services/debtsService";

interface DebtEditPopUpProps {
    open: boolean;
    onClose: () => void;
    debtId: number;
    onSaved: () => void;
}

export function DebtEditPopUp({open, onClose, debtId, onSaved}: DebtEditPopUpProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        amount: 0,
        person: "",
        description: "",
        type: "LENT" as "LENT" | "BORROWED",
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
                    date: res.date
                });
            })
            .catch(err => toast.error(err.message || "Dështoi ngarkimi i borxhit"))
            .finally(() => setLoading(false));

    }, [open, debtId]);

    const handleSave = async () => {
        if (form.amount <= 0) return toast.error("Shuma duhet të jetë më e madhe se 0");
        if (!form.person.trim()) return toast.error("Personi është i detyrueshëm");
        if (!form.description.trim()) return toast.error("Përshkrimi është i detyrueshëm");

        try {
            setSaving(true);
            await debtsService.updateDebtById(form, debtId);
            toast.success("Borxhi u përditësua me sukses");
            onSaved();
            onClose();
        } catch (e: any) {
            toast.error(e.message || "Përditësimi dështoi");
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
            PaperProps={{sx: {borderRadius: 4, backgroundImage: 'none'}}}
        >
            <DialogTitle
                sx={{display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, pb: 1}}>
                Përditëso Borxhin
                <IconButton onClick={onClose} size="small">
                    <Close/>
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{borderBottom: 'none'}}>
                {loading ? (
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', my: 5}}>
                        <CircularProgress size={40}/>
                        <Typography sx={{mt: 2}} color="text.secondary">
                            Duke ngarkuar të dhënat...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 4, mt: 1}}>
                            <Avatar sx={{
                                width: 56,
                                height: 56,
                                bgcolor: form.type === "LENT" ? 'error.900' : 'success.900',
                                color: form.type === "LENT" ? '#f44336' : '#4caf50',
                                border: '1px solid'
                            }}>
                                {form.type === "LENT" ? <TrendingDown fontSize="large"/> :
                                    <TrendingUp fontSize="large"/>}
                            </Avatar>

                            <Box>
                                <Typography variant="h5" fontWeight="900">
                                    ID: #{debtId}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Po përditëson borxhin për {form.person}
                                </Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary">
                                    Personi
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={form.person}
                                    onChange={(e) => setForm({...form, person: e.target.value})}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle color="primary"/>
                                            </InputAdornment>
                                        ),
                                        sx: {borderRadius: 3}
                                    }}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary">
                                    Shuma (€)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm({...form, amount: Number(e.target.value)})}
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
                                <Typography variant="overline" fontWeight="700" color="text.secondary">
                                    Lloji
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={form.type}
                                    onChange={(e) => setForm({...form, type: e.target.value as any})}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Category color="primary"/>
                                            </InputAdornment>
                                        ),
                                        sx: {borderRadius: 3}
                                    }}
                                >
                                    <MenuItem value="LENT">Dhënë (unë kam dhënë)</MenuItem>
                                    <MenuItem value="BORROWED">Marrë (unë kam marrë)</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary">
                                    Data
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({...form, date: e.target.value})}
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
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'action.hover',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="overline" fontWeight="700" color="text.secondary">
                                        Përshkrimi / Arsyeja
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        variant="standard"
                                        value={form.description}
                                        onChange={(e) => setForm({...form, description: e.target.value})}
                                        InputProps={{
                                            disableUnderline: true,
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
                <Button onClick={onClose} color="inherit">
                    Anulo
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || loading}
                >
                    {saving ? "Duke ruajtur..." : "Përditëso Borxhin"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}