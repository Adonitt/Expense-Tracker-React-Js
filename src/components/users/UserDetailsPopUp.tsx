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
    Typography
} from "@mui/material";
import {type UserDetailsPayload, userService} from "../../services/userService";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

interface UserDetailsProps {
    open: boolean;
    onClose: () => void;
    userId: number | null;
    onEdit?: (id: number) => void;
}

export function UserDetailsPopUp({open, onClose, userId, onEdit}: UserDetailsProps) {
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
            <DialogTitle>User Details Id: {userId}</DialogTitle>
            <DialogContent dividers>
                {loading && <CircularProgress sx={{display: 'block', mx: 'auto', my: 3}}/>}
                {error && <Typography color="error">{error}</Typography>}
                {user && (
                    <Grid container spacing={2}>

                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Name</Typography>
                                <Typography>{user.firstName} {user.lastName}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Email</Typography>
                                <Typography>{user.email}</Typography>
                            </Paper>
                        </Grid>


                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Phone</Typography>
                                <Typography>{user.phoneNumber ? user.phoneNumber : '-'}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Role</Typography>
                                <Typography>{user.role}</Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Registered At</Typography>
                                <Typography>{dayjs(user.registeredAt).format("MMMM D, YYYY")}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Paper sx={{p: 2}}>
                                <Typography variant="overline">Active</Typography>
                                <Typography>{user.isActive ? "Yes" : "No"}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" startIcon={<CloseIcon/>} onClick={onClose}>Close</Button>

                <Button
                    variant="outlined"
                    color="contained" startIcon={<EditIcon/>}
                    onClick={() => {
                        if (userId && onEdit) {
                            onEdit(userId);
                        }
                    }}
                >
                    Edit User
                </Button>
            </DialogActions>
        </Dialog>

    );
}
