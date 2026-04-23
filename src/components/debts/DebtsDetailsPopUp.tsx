import {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Stack,
    Typography,
    Chip,
    LinearProgress,
    TextField,
    Divider,
    Paper
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

import {debtsService, type DebtDetailsPayload} from "../../services/debtsService";

import {DebtEditPopUp} from "./DebtEditPopUp";
import {DebtDeleteDialog} from "./DebtDeleteDialog";

export function DebtDetailsPopUp({open, onClose, debtId, onDetails}: any) {

    const [debt, setDebt] = useState<DebtDetailsPayload | null>(null);
    const [loading, setLoading] = useState(false);

    const [payAmount, setPayAmount] = useState(0);
    const [paying, setPaying] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        debtsService.getDebtById(debtId)
            .then(res => setDebt(res))
            .finally(() => setLoading(false));

    }, [open, debtId]);

    const progress = debt ? (debt.paidAmount / debt.amount) * 100 : 0;

    const handlePay = async () => {
        if (!debt) return;

        if (payAmount <= 0) return;

        setPaying(true);

        try {
            await debtsService.payDebt(debtId, {amount: payAmount});

            const updated = await debtsService.getDebtById(debtId);
            setDebt(updated);

            setPayAmount(0);
            onDetails();

        } finally {
            setPaying(false);
        }
    };

    const fetchDebt = async () => {
        const res = await debtsService.getDebtById(debtId);
        setDebt(res);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">

                {/* HEADER (HERO STYLE) */}
                <DialogTitle sx={{bgcolor: "#0f172a", color: "white"}}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">

                        <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon/>
                            <Typography fontWeight="bold">
                                {debt?.person}
                            </Typography>
                        </Stack>

                        <Chip
                            label={debt?.status}
                            sx={{
                                bgcolor:
                                    debt?.status === "PAID"
                                        ? "#16a34a"
                                        : debt?.status === "PARTIAL"
                                            ? "#f59e0b"
                                            : "#ef4444",
                                color: "white"
                            }}
                        />

                    </Stack>
                </DialogTitle>

                <DialogContent>
                    {loading && (
                        <Box sx={{textAlign: "center", py: 4}}>
                            <CircularProgress/>
                        </Box>
                    )}

                    {debt && (
                        <>

                            <Stack direction="row" spacing={2} sx={{mt: 2}}>

                                <Paper sx={{flex: 1, p: 2, borderRadius: 3}}>
                                    <Typography variant="caption">Total</Typography>
                                    <Typography fontWeight="bold" fontSize={20}>
                                        €{debt.amount}
                                    </Typography>
                                </Paper>

                                <Paper sx={{flex: 1, p: 2, borderRadius: 3}}>
                                    <Typography variant="caption">Paid</Typography>
                                    <Typography fontWeight="bold" color="green">
                                        €{debt.paidAmount}
                                    </Typography>
                                </Paper>

                                <Paper sx={{flex: 1, p: 2, borderRadius: 3}}>
                                    <Typography variant="caption">Remaining</Typography>
                                    <Typography fontWeight="bold" color="red">
                                        €{debt.remainingAmount}
                                    </Typography>
                                </Paper>

                            </Stack>

                            {/* PROGRESS */}
                            <Box sx={{mt: 3}}>
                                <Typography variant="caption">Progress</Typography>

                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        mt: 1
                                    }}
                                />

                                <Typography sx={{mt: 1}} variant="caption">
                                    {Math.round(progress)}% completed
                                </Typography>
                            </Box>

                            <Divider sx={{my: 3}}/>
                            {/* PAYMENT SECTION */}
                            <Paper sx={{p: 2, borderRadius: 3}}>

                                <Typography fontWeight="bold" sx={{mb: 1}}>
                                    Quick Payment
                                </Typography>

                                {debt.status === "PAID" ? (

                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            py: 3,
                                            bgcolor: "#ecfdf5",
                                            borderRadius: 2,
                                            border: "1px solid #86efac"
                                        }}
                                    >
                                        <Typography fontSize={18} fontWeight="bold" color="success.main">
                                            🎉 Debt Fully Paid
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            No remaining balance
                                        </Typography>
                                    </Box>

                                ) : (
                                    <>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={payAmount}
                                            onChange={(e) => setPayAmount(Number(e.target.value))}
                                            placeholder="Enter amount"
                                        />

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<PaymentIcon/>}
                                            sx={{mt: 2}}
                                            disabled={paying || debt.remainingAmount === 0}
                                            onClick={handlePay}
                                        >
                                            Pay Now
                                        </Button>
                                    </>
                                )}

                            </Paper>
                        </>
                    )}

                </DialogContent>

                <DialogActions>

                    <Button startIcon={<CloseIcon/>} onClick={onClose}>
                        Close
                    </Button>

                    <Button startIcon={<EditIcon/>} onClick={() => setEditOpen(true)}>
                        Edit
                    </Button>

                    <Button color="error" startIcon={<DeleteIcon/>} onClick={() => setDeleteOpen(true)}>
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>

            {editOpen && (
                <DebtEditPopUp
                    open={editOpen}
                    debtId={debtId}
                    onClose={() => setEditOpen(false)}
                    onSaved={() => {
                        setEditOpen(false);
                        fetchDebt();
                    }}
                />
            )}

            {deleteOpen && (
                <DebtDeleteDialog
                    open={deleteOpen}
                    debtId={debtId}
                    onClose={() => setDeleteOpen(false)}
                    onDelete={() => {
                        setDeleteOpen(false);
                        onDetails();
                        onClose();
                    }}
                />
            )}
        </>
    );
}