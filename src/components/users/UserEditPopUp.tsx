import * as React from "react";
import {
    Button,
    CircularProgress,
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
    Box,
    MenuItem
} from "@mui/material";
import {
    Close,
    Person,
    Email,
    Phone,
    Badge,
    AdminPanelSettings,
    ToggleOn,
    Edit
} from "@mui/icons-material";
import { type UpdateUserPayload, type UserDetailsPayload, userService } from "../../services/userService";
import { toast } from "react-toastify";

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number | null;
    onSaved?: () => void;
}

export const UserEditPopUp = ({ open, onClose, userId, onSaved }: Props) => {
    const [user, setUser] = React.useState<UserDetailsPayload | null>(null);
    const [form, setForm] = React.useState<Partial<UpdateUserPayload>>({});
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open || !userId) return;
        setLoading(true);
        setError(null);

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
                toast.error('Failed to load user data');
            })
            .finally(() => setLoading(false));
    }, [open, userId]);

    const handleChange = (field: keyof UpdateUserPayload, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        try {
            await userService.updateUserById(userId, form);
            toast.success(`User updated successfully`);
            onSaved?.();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to update user");
            toast.error(err.message || "Update failed");
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
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800 }}>
                Edit User
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderBottom: 'none' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 5 }}>
                        <CircularProgress size={40} />
                        <Typography sx={{ mt: 2 }} color="text.secondary">Loading user info...</Typography>
                    </Box>
                ) : (
                    <>
                        {user && (
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, mt: 1 }}>
                                <Avatar sx={{
                                    width: 56, height: 56,
                                    bgcolor: 'primary.900', color: 'primary.main',
                                    border: '1px solid'
                                }}>
                                    <Edit />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="900">
                                        ID: #{userId}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Modify account credentials and permissions
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>First Name</Typography>
                                <TextField
                                    fullWidth
                                    value={form.firstName || ""}
                                    onChange={e => handleChange("firstName", e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Person color="primary" fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: 3 }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Last Name</Typography>
                                <TextField
                                    fullWidth
                                    value={form.lastName || ""}
                                    onChange={e => handleChange("lastName", e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Badge color="primary" fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: 3 }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Email Address</Typography>
                                <TextField
                                    fullWidth
                                    value={form.email || ""}
                                    onChange={e => handleChange("email", e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Email color="primary" fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: 3 }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Phone Number</Typography>
                                <TextField
                                    fullWidth
                                    value={form.phoneNumber || ""}
                                    onChange={e => handleChange("phoneNumber", e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Phone color="primary" fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: 3 }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Role</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={form.role || "USER"}
                                    onChange={e => handleChange("role", e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><AdminPanelSettings color="primary" fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: 3 }
                                    }}
                                >
                                    <MenuItem value="USER">User</MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ ml: 1 }}>Account Status</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={form.isActive ? "true" : "false"}
                                    onChange={e => handleChange("isActive", e.target.value === "true")}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><ToggleOn color="primary" fontSize="small" /></InputAdornment>,
                                        sx: { borderRadius: 3 }
                                    }}
                                >
                                    <MenuItem value="true">Active</MenuItem>
                                    <MenuItem value="false">Inactive</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} color="inherit" sx={{ borderRadius: 2, px: 3 }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || loading}
                    sx={{ borderRadius: 2, px: 4, fontWeight: "bold", boxShadow: 3 }}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};