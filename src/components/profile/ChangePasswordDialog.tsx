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
    Paper,
    TextField
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {authService} from "../../services/authService";
import {toast} from "react-toastify";

interface Props {
    open: boolean;
    onClose: () => void;
}

export const ChangePasswordDialog = ({open, onClose}: Props) => {
        const [oldPassword, setOldPassword] = React.useState("");
        const [newPassword, setNewPassword] = React.useState("");
        const [confirmPassword, setConfirmPassword] = React.useState("");
        const [showOld, setShowOld] = React.useState(false);
        const [showNew, setShowNew] = React.useState(false);
        const [showConfirm, setShowConfirm] = React.useState(false);
        const [saving, setSaving] = React.useState(false);

        const handleSave = async () => {
            if (!oldPassword || !newPassword || !confirmPassword) {
                toast.warning("Please fill in all fields");
                return;
            }

            if (newPassword.length < 6) toast.warning(
                "New password must be at least 6 characters long"
            )
            if (confirmPassword.length < 6) toast.warning(
                "Confirm password must be at least 6 characters long")

            if (newPassword !== confirmPassword) {
                toast.warning("New password and confirm password do not match");
                return;
            }
            setSaving(true);

            try {
                await authService.changePassword({
                    oldPassword,
                    newPassword,
                    confirmPassword,
                });
                toast.success("Password changed successfully");
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
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} mt={1}>
                        <Grid size={{xs: 12, sm: 12}}>
                            <Paper sx={{p: 1}}>
                                <TextField
                                    fullWidth
                                    label="Old Password"
                                    type={showOld ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowOld(!showOld)}
                                                    edge="end"
                                                >
                                                    {showOld ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 12}}>
                            <Paper sx={{p: 1}}>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowNew(!showNew)}
                                                    edge="end"
                                                >
                                                    {showNew ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 12}}>
                            <Paper sx={{p: 1}}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirm(!showConfirm)}
                                                    edge="end"
                                                >
                                                    {showConfirm ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Change Password"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
;