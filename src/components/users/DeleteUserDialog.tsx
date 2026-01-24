import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { userService } from "../../services/userService";

export function DeleteUserDialog({ userId, open, onClose, onDeleted }: {
    userId: number | null,
    open: boolean,
    onClose: () => void,
    onDeleted: () => void
}) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await userService.deleteUserById(userId);
            toast.success(`User ${userId} deleted successfully`);
            onDeleted();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent dividers>
                <Typography>Are you sure you want to delete user {userId}?</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
