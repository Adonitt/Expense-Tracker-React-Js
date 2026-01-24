import * as React from "react";
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
import {type UpdateUserPayload, type UserDetailsPayload, userService} from "../../services/userService";
import {toast} from "react-toastify";

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number | null;
    onSaved?: () => void;
}

export const UserEditPopUp = ({open, onClose, userId, onSaved}: Props) => {
    const [user, setUser] = React.useState<UserDetailsPayload | null>(null);
    const [form, setForm] = React.useState<Partial<UpdateUserPayload>>({});
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open || !userId) return;
        setLoading(true);
        setError(null);
        toast.warning('Updating user with ID: ' + userId + ' ...')
        userService.getUserById(userId)
            .then(res => {
                setUser(res);
                setForm({
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                    phoneNumber: res.phoneNumber,
                    role: res.role,
                    isActive: res.isActive
                });
            })

            .catch(err => {
                    setError(err.message);
                    toast.error('Failed to update user with ID: ' + userId + ' ...')
                }
            )
            .finally(() => setLoading(false));
    }, [open, userId]);

    const handleChange = (field: keyof UpdateUserPayload, value: any) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        setError(null);
        try {
            await userService.updateUserById(userId, form);
            onSaved?.();
            onClose();
            toast.success(`User with ID ${userId} updated successfully `);
        } catch (err: any) {
            setError(err.message || "Failed to update user");
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
                sx: {
                    backgroundColor: 'background.default',
                    color: 'text.primary',
                }
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0,0,0,0.9)',
                }
            }}
        >
            <DialogTitle>Edit User Id: {userId}</DialogTitle>
            <DialogContent dividers>
                {loading && <CircularProgress sx={{display: 'block', mx: 'auto', my: 3}}/>}
                {error && <Typography color="error">{error}</Typography>}
                {user && (
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">First Name</Typography>
                                <TextField fullWidth value={form.firstName || "-"}
                                           onChange={e => handleChange("firstName", e.target.value)}/>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Last Name</Typography>
                                <TextField fullWidth value={form.lastName || "-"}
                                           onChange={e => handleChange("lastName", e.target.value)}/>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Email</Typography>
                                <TextField fullWidth value={form.email || "-"}
                                           onChange={e => handleChange("email", e.target.value)}/>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Phone</Typography>
                                <TextField fullWidth value={form.phoneNumber || "-"}
                                           onChange={e => handleChange("phoneNumber", e.target.value)}/>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Role</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={form.role || "User"}
                                    onChange={e => handleChange("role", e.target.value)}
                                    SelectProps={{native: true}}
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </TextField>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Active</Typography>
                                <TextField select fullWidth SelectProps={{native: true}}
                                           value={form.isActive ? "true" : "false"}
                                           onChange={e => handleChange("isActive", e.target.value === "true")}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </TextField>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}
                        disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </DialogActions>
        </Dialog>
    );
};
