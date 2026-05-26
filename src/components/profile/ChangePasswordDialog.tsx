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
    Box,
    Stack,
    Avatar
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Lock,
    VpnKey,
    Close,
    Security
} from "@mui/icons-material";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";

interface Props {
    open: boolean;
    onClose: () => void;
}

export const ChangePasswordDialog = ({ open, onClose }: Props) => {
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showOld, setShowOld] = React.useState(false);
    const [showNew, setShowNew] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    const handleSave = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.warning("Ju lutem mbushni të gjitha fushat!");
            return;
        }

        if (newPassword.length < 6) {
            toast.warning("Fjalëkalimi i ri duhet të ketë më shumë se 6 karaktere");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warning("Fjalëkalimet nuk përputhen");
            return;
        }

        setSaving(true);
        try {
            await authService.changePassword({
                oldPassword,
                newPassword,
                confirmPassword,
            });
            toast.success("Fjalëkalimi u përditësua me sukses!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Network error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800 }}>
                Cilësimet e sigurisë
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderBottom: 'none' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, mt: 1 }}>
                    <Avatar sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.900',
                        color: 'primary.main',
                        border: '1px solid'
                    }}>
                        <Security fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="900">
                            Përditëso Fjalëkalimin
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sigurohu që llogaria jote të jetë e sigurtë
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Fjalëkalimi i tanishëm</Typography>
                        <TextField
                            fullWidth
                            type={showOld ? "text" : "password"}
                            placeholder={'Fut fjalëkalimin e tanishëm'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><VpnKey color="primary" fontSize="small" /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowOld(!showOld)} edge="end">
                                            {showOld ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Fjalëkalimi i ri</Typography>
                        <TextField
                            fullWidth
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            placeholder={'Fut fjalëkalimin e ri'}
                            onChange={(e) => setNewPassword(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Lock color="primary" fontSize="small" /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                                            {showNew ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Konfirmo Fjalëkalimin e ri</Typography>
                        <TextField
                            fullWidth
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            placeholder={'Konfirmo Fjalëkalimin e ri'}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Lock color="primary" fontSize="small" /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3 }
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} color="inherit" sx={{ borderRadius: 2, px: 3 }}>
                    Mbyll
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: 2, px: 4, fontWeight: "bold", boxShadow: 3 }}
                >
                    {saving ? "Duke përditësuar..." : "Përditëso"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};