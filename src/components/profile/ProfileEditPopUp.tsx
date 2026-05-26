import * as React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Avatar,
    Stack,
    Box, CircularProgress
} from "@mui/material";
import {Close, Person, Email, Phone, Badge, ManageAccounts} from "@mui/icons-material";
import {userService} from "../../services/userService";
import {toast} from "react-toastify";

interface Props {
    open: boolean;
    onClose: () => void;
    user: any;
    onSaved?: () => void;
}
export const ProfileEditPopUp = ({open, onClose, user: loggedInUser, onSaved}: Props) => {
    const [form, setForm] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (open && loggedInUser?.id) {
            setLoading(true);
            userService.getUserById(loggedInUser.id)
                .then(res => {
                    setForm({
                        firstName: res.firstName || "",
                        lastName: res.lastName || "",
                        email: res.email || "",
                        phoneNumber: res.phoneNumber || ""
                    });
                })
                .catch(err => {
                    toast.error("Could not fetch profile details");
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    }, [open, loggedInUser?.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await userService.updateSelf(form);
            toast.success("Profili u përdit♪7sua me sukses!");
            onSaved?.();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
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
            PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
        >
            <DialogTitle sx={{display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800}}>
                Përditëso Profilin
                <IconButton onClick={onClose} size="small"><Close/></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{borderBottom: 'none'}}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 3, mt: 1}}>
                            <Avatar sx={{bgcolor: 'primary.900', color: 'primary.main', border: '1px solid'}}>
                                <ManageAccounts/>
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Të dhëna personale</Typography>
                                <Typography variant="caption" color="text.secondary">Përditëso të dhënat tua publike</Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Emri"
                                    value={form.firstName}
                                    onChange={(e) => setForm({...form, firstName: e.target.value})}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Person color="primary"/></InputAdornment>,
                                        sx: {borderRadius: 3}
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Mbiemri"
                                    value={form.lastName}
                                    onChange={(e) => setForm({...form, lastName: e.target.value})}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Badge color="primary"/></InputAdornment>,
                                        sx: {borderRadius: 3}
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Email color="primary"/></InputAdornment>,
                                        sx: {borderRadius: 3}
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Numri i telefonit"
                                    value={form.phoneNumber}
                                    onChange={(e) => setForm({...form, phoneNumber: e.target.value})}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Phone color="primary"/></InputAdornment>,
                                        sx: {borderRadius: 3}
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{p: 3}}>
                <Button onClick={onClose} color="inherit">Mbyll</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || loading}
                    sx={{borderRadius: 2, px: 4, fontWeight: 'bold'}}
                >
                    {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};