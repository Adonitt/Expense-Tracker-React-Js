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
            toast.success(`Borxhi me ID ${debtId} u fshi me sukses!`);
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
            <DialogTitle>Konfirmo Fshirjen</DialogTitle>
            <DialogContent dividers>
                <Typography>
                    A jeni i sigurtë që doni ta fshini borxhin me ID: {debtId}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose} disabled={loading}>Jo, Anulo</Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                    {loading ? "Duke fshirë..." : " Po, Fshij"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

