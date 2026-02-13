import {useEffect, useState} from "react";
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
import {type DebtDetailsPayload, debtsService} from "../../services/debtsService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { DebtEditPopUp } from "./DebtEditPopUp";
import { DebtDeleteDialog } from "./DebtDeleteDialog";

interface DebtDetailsPopUpProps {
    open: boolean;
    onClose: () => void;
    debtId: number;
    onDetails: () => void;
}

export function DebtDetailsPopUp({
                                     open,
                                     onClose,
                                     debtId,
                                     onDetails
                                 }: DebtDetailsPopUpProps) {

    const [debt, setDebt] = useState<DebtDetailsPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editPopUpOpen, setEditPopUpOpen] = useState(false);
    const [deletePopUpOpen, setDeletePopUpOpen] = useState(false);

    useEffect(() => {
        if (!debtId || !open) return;

        setLoading(true);
        setDebt(null);
        setError(null);

        debtsService.getDebtById(debtId)
            .then(res => setDebt(res))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));

    }, [debtId, open]);

    const handleEditClick = () => {
        setEditPopUpOpen(true);
    };

    const handleDeleteClick = () => {
        setDeletePopUpOpen(true);
    };

    return (
        <>
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
                    sx: {backgroundColor: 'rgba(0,0,0,0.9)'}
                }}
            >
                <DialogTitle>Debt Details - ID: {debtId}</DialogTitle>

                <DialogContent dividers>

                    {loading && (
                        <CircularProgress sx={{display: 'block', mx: 'auto', my: 3}}/>
                    )}

                    {error && <Typography color="error">{error}</Typography>}

                    {debt && (
                        <Grid container spacing={2}>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Amount</Typography>
                                    <Typography>
                                        {debt.type === "LENT" ? `+${debt.amount}` : `-${debt.amount}`}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Person</Typography>
                                    <Typography>{debt.person}</Typography>
                                </Paper>
                            </Grid>

                            {debt.transactionId && (
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Paper sx={{p: 2}}>
                                        <Typography variant="overline">Transaction ID</Typography>
                                        <Typography>{debt.transactionId}</Typography>
                                    </Paper>
                                </Grid>
                            )}

                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Type</Typography>
                                    <Typography>{debt.type}</Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Status</Typography>
                                    <Typography>{debt.status}</Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Description</Typography>
                                    <Typography>{debt.description || "-"}</Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Date</Typography>
                                    <Typography>{debt.date}</Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Created At</Typography>
                                    <Typography>
                                        {new Date(debt.createdAt).toLocaleString()}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <Paper sx={{p: 2}}>
                                    <Typography variant="overline">Last Updated At</Typography>
                                    <Typography>
                                        {debt.updatedAt
                                            ? new Date(debt.updatedAt).toLocaleString()
                                            : "-"}
                                    </Typography>
                                </Paper>
                            </Grid>

                        </Grid>
                    )}

                </DialogContent>

                <DialogActions>

                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CloseIcon/>}
                        onClick={onClose}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon/>}
                        onClick={handleEditClick}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon/>}
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>

                </DialogActions>
            </Dialog>

            {editPopUpOpen && (
                <DebtEditPopUp
                    open={editPopUpOpen}
                    debtId={debtId}
                    onClose={() => setEditPopUpOpen(false)}
                    onSaved={() => {
                        setEditPopUpOpen(false);
                        onDetails();
                        setLoading(true);
                        debtsService.getDebtById(debtId)
                            .then(res => setDebt(res))
                            .finally(() => setLoading(false));
                    }}
                />
            )}

            {/* DELETE DIALOG */}
            {deletePopUpOpen && (
                <DebtDeleteDialog
                    open={deletePopUpOpen}
                    debtId={debtId}
                    onClose={() => setDeletePopUpOpen(false)}
                    onDelete={() => {
                        setDeletePopUpOpen(false);
                        onDetails();
                        onClose();
                    }}
                />
            )}
        </>
    );
}
