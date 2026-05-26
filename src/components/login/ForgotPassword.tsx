import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import {toast} from "react-toastify";
import {authService} from "../../services/authService.ts";

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export default function ForgotPassword({open, handleClose}: any) {
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async () => {
        if (!email) {
            toast.error("Email është e domosdoshme!");
            return;
        }

        try {
            setLoading(true);

            toast.info("Duke dërguar lidhjen...");

            await authService.forgotPassword(email);


            handleClose();
        } catch (err: any) {
            toast.error(err.message || "Diçka shkoi gabim!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{sx: {borderRadius: 4, backgroundImage: 'none'}}}
        >
            <DialogTitle>Kam harruar passwordin</DialogTitle>

            <DialogContent>
                <OutlinedInput
                    fullWidth
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Anulo</Button>

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    variant="contained"
                >
                    {loading ? "Duke dërguar..." : "Dërgo"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}