import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useState} from "react";
import {transactionsService} from "../../services/transactionsService.ts";
import {toast} from "react-toastify";

interface TransactionDeleteDialogProps {
    open: boolean
    onClose: () => void
    transactionId: number
    onDelete: () => void
}

export function TransactionDeleteDialog({open, onClose, transactionId, onDelete}: TransactionDeleteDialogProps) {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!transactionId) return

        setLoading(true);
        try {
            await transactionsService.deleteTransactionById(transactionId)
            toast.success(`Transaction ${transactionId} deleted successfully`)
            onDelete()
            onClose()
        } catch (err) {
            toast.error(err.message || "Failed to delete transaction")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}
                PaperProps={{sx: {borderRadius: 4, backgroundImage: 'none'}}}
        >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent dividers>
                <Typography>Are you sure you want to delete transaction with ID:{transactionId}?</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}