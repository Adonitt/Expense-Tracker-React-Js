import {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {type DebtDetailsPayload, debtsService} from "../../services/debtsService";
import {DebtEditPopUp} from "./DebtEditPopUp";
import {DebtDeleteDialog} from "./DebtDeleteDialog";
import Grid from "@mui/material/Grid";
import {getLoggedInUser} from "../../utils/auth.ts";
import {toast} from "react-toastify";

export function DebtDetailsPopUp({open, onClose, debtId, onDetails}: any) {
    const [debt, setDebt] = useState<DebtDetailsPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [payAmount, setPayAmount] = useState<number | string>("");
    const [paying, setPaying] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const user = getLoggedInUser()
    const canModify =
        user?.isActive &&
        debt &&
        debt.status !== "PAID";

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        debtsService.getDebtById(debtId)
            .then(res => setDebt(res))
            .finally(() => setLoading(false));
    }, [open, debtId]);

    const progress = debt ? (debt.paidAmount / debt.amount) * 100 : 0;

    const handlePay = async () => {
        if (!debt || !payAmount || Number(payAmount) <= 0) return toast.warning("Please enter a valid amount to pay.");

        setPaying(true);
        try {
            await debtsService.payDebt(debtId, {amount: Number(payAmount)});
            const updated = await debtsService.getDebtById(debtId);
            setDebt(updated);
            setPayAmount("");
            onDetails();
        } catch (err) {
            toast.error(err.message || "Failed to update transaction");
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
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{sx: {borderRadius: 4, backgroundImage: 'none'}}}
            >
                <DialogTitle
                    sx={{display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800}}>
                    Debt Details
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{borderBottom: 'none'}}>
                    {loading ? (
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', my: 5}}>
                            <CircularProgress size={40}/>
                        </Box>
                    ) : debt && (
                        <>
                            {/* HEADER SECTION */}
                            <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 4, mt: 1}}>
                                <Avatar sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: 'primary.900',
                                    color: 'primary.main',
                                    border: '1px solid'
                                }}>
                                    <PersonIcon fontSize="large"/>
                                </Avatar>
                                <Box sx={{flexGrow: 1}}>
                                    <Typography variant="h5" fontWeight="900">
                                        {debt.person}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip
                                            label={debt.type}
                                            size="small"
                                            variant="outlined"
                                            color={debt.type === "LENT" ? "error" : "success"}
                                            sx={{fontWeight: 'bold', fontSize: '0.7rem'}}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {debt.status}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Chip
                                    label={`${Math.round(progress)}%`}
                                    color="primary"
                                    variant="soft"
                                    sx={{fontWeight: 800, borderRadius: 2}}
                                />
                            </Stack>

                            <Grid container spacing={2} sx={{
                                mb: 3, mt: 3,
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                gap: 2,
                            }}>
                                <Grid item xs={12}>
                                    <Paper variant="outlined"
                                           sx={{p: 1.5, textAlign: 'center', borderRadius: 3, bgcolor: 'action.hover'}}>
                                        <Typography variant="caption" fontWeight="bold"
                                                    color="text.secondary">TOTAL</Typography>
                                        <Typography fontWeight="900"
                                                    sx={{color: 'text.primary'}}>€{debt.amount}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper variant="outlined"
                                           sx={{p: 1.5, textAlign: 'center', borderRadius: 3, bgcolor: 'action.hover'}}>
                                        <Typography variant="caption" fontWeight="bold"
                                                    color="text.secondary">PAID</Typography>
                                        <Typography fontWeight="900"
                                                    color="success.main">€{debt.paidAmount}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper variant="outlined"
                                           sx={{p: 1.5, textAlign: 'center', borderRadius: 3, bgcolor: 'action.hover'}}>
                                        <Typography variant="caption" fontWeight="bold"
                                                    color="text.secondary">DUE</Typography>
                                        <Typography fontWeight="900"
                                                    color="error.main">€{debt.remainingAmount}</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* PROGRESS BAR */}
                            <Box sx={{mb: 4, px: 1}}>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: 8,
                                        borderRadius: 5,
                                        bgcolor: 'divider',
                                        '& .MuiLinearProgress-bar': {borderRadius: 5}
                                    }}
                                />
                            </Box>

                            <Paper sx={{
                                p: 2.5,
                                borderRadius: 4,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Typography variant="subtitle2" fontWeight="800"
                                            sx={{mb: 2, display: 'flex', alignItems: 'center', gap: 1}}>
                                    <PaymentIcon fontSize="small" color="primary"/> Quick Payment
                                </Typography>

                                {debt.status === "PAID" ? (
                                    <Box sx={{
                                        textAlign: "center",
                                        py: 2,
                                        bgcolor: 'success.900',
                                        borderRadius: 3,
                                        border: '1px dashed',
                                        borderColor: 'success.main'
                                    }}>
                                        <Typography fontWeight="bold" color="success.main" sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <CheckCircleOutlineIcon/> Fully Settled
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            placeholder="Amount to pay..."
                                            value={payAmount}
                                            onChange={(e) => setPayAmount(e.target.value)}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                                sx: {borderRadius: 3}
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handlePay}
                                            sx={{borderRadius: 3, px: 3, fontWeight: 'bold'}}
                                        >
                                            {paying ? <CircularProgress size={20}/> : "Pay"}
                                        </Button>
                                    </Stack>
                                )}
                            </Paper>

                            <Box sx={{mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 3}}>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary">REASON /
                                    DESCRIPTION</Typography>
                                <Typography variant="body2" sx={{
                                    mt: 0.5,
                                    color: 'text.primary',
                                    fontStyle: debt.description ? 'normal' : 'italic'
                                }}>
                                    {debt.description || "No description provided."}
                                </Typography>
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{p: 3}}>
                    {canModify && (
                        <Button
                            onClick={() => setDeleteOpen(true)}
                            color="error"
                            sx={{fontWeight: 'bold'}}
                        >
                            Delete
                        </Button>
                    )}
                    <Box sx={{flexGrow: 1}}/>
                    {canModify && (
                        <Button
                            onClick={() => setEditOpen(true)}
                            startIcon={<EditIcon/>}
                            sx={{borderRadius: 2, fontWeight: 'bold'}}
                        >
                            Edit
                        </Button>
                    )}
                    <Button variant="outlined" onClick={onClose} sx={{borderRadius: 2, fontWeight: 'bold'}}>
                        Close
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