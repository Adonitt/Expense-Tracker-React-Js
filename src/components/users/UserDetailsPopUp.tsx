import * as React from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    Avatar,
    Stack,
    Box,
    Chip,
    IconButton,
    Paper
} from "@mui/material";
import { type UserDetailsPayload, userService } from "../../services/userService";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface UserDetailsProps {
    open: boolean;
    onClose: () => void;
    userId: number | null;
    onEdit?: (id: number) => void;
}

export function UserDetailsPopUp({ open, onClose, userId, onEdit }: UserDetailsProps) {
    const [user, setUser] = React.useState<UserDetailsPayload | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open || userId === null) return;

        setLoading(true);
        setError(null);

        userService.getUserById(userId)
            .then((res) => setUser(res))
            .catch((err: any) => setError(err.message))
            .finally(() => setLoading(false));
    }, [open, userId]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800 }}>
                User Profile
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderBottom: 'none' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 5 }}>
                        <CircularProgress size={40} />
                        <Typography sx={{ mt: 2 }} color="text.secondary">Fetching user data...</Typography>
                    </Box>
                ) : error ? (
                    <Typography color="error" textAlign="center" sx={{ my: 3 }}>{error}</Typography>
                ) : user && (
                    <>
                        {/* PROFILE HEADER */}
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, mt: 1 }}>
                            <Avatar sx={{
                                width: 70,
                                height: 70,
                                bgcolor: 'primary.900',
                                color: 'primary.main',
                                border: '2px solid',
                                borderColor: 'primary.main'
                            }}>
                                <PersonIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" fontWeight="900">
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                                    />
                                    <Chip
                                        icon={user.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                                        label={user.isActive ? "Active" : "Inactive"}
                                        size="small"
                                        color={user.isActive ? "success" : "error"}
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Stack>
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            {/* EMAIL */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                        <EmailIcon fontSize="small" color="primary" />
                                        <Typography variant="overline" fontWeight="700" color="text.secondary">Email Address</Typography>
                                    </Stack>
                                    <Typography variant="body1" fontWeight="600" sx={{ wordBreak: 'break-all' }}>{user.email}</Typography>
                                </Paper>
                            </Grid>

                            {/* PHONE */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                        <PhoneIcon fontSize="small" color="primary" />
                                        <Typography variant="overline" fontWeight="700" color="text.secondary">Phone Number</Typography>
                                    </Stack>
                                    <Typography variant="body1" fontWeight="600">{user.phoneNumber || 'Not provided'}</Typography>
                                </Paper>
                            </Grid>

                            {/* REGISTRATION DATE */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                        <EventIcon fontSize="small" color="primary" />
                                        <Typography variant="overline" fontWeight="700" color="text.secondary">Member Since</Typography>
                                    </Stack>
                                    <Typography variant="body1" fontWeight="600">
                                        {dayjs(user.registeredAt).format("MMMM D, YYYY")}
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* USER ID */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                        <BadgeIcon fontSize="small" color="primary" />
                                        <Typography variant="overline" fontWeight="700" color="text.secondary">Account ID</Typography>
                                    </Stack>
                                    <Typography variant="body1" fontWeight="600">#{userId}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
                >
                    Close
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => {
                        if (userId && onEdit) {
                            onEdit(userId);
                        }
                    }}
                    sx={{ borderRadius: 2, px: 4, fontWeight: "bold", boxShadow: 3 }}
                >
                    Edit Profile
                </Button>
            </DialogActions>
        </Dialog>
    );
}