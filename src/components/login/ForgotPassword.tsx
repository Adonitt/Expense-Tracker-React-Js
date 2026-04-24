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
            toast.error("Email is required");
            return;
        }

        try {
            setLoading(true);

            toast.info("Sending reset link...");

            await authService.forgotPassword(email);


            handleClose();
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
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
            <DialogTitle>Reset Password</DialogTitle>

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
                <Button onClick={handleClose}>Cancel</Button>

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    variant="contained"
                >
                    {loading ? "Sending..." : "Send"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}