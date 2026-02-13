import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { debtsService } from "../../services/debtsService.ts";
import { toast } from "react-toastify";

interface DebtDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    debtId: number;
    onDelete: () => void;
}

export function DebtDeleteDialog({ open, onClose, debtId, onDelete }: DebtDeleteDialogProps) {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!debtId) return;

        setLoading(true);
        try {
            await debtsService.deleteDebtById(debtId);
            toast.success(`Debt ${debtId} deleted successfully`);
            onDelete();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete debt");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Are you sure you want to delete debt {debtId}?
                </Typography>
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
