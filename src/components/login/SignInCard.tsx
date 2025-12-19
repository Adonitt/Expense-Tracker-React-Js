import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ForgotPassword from './ForgotPassword.tsx';
import {ExpenseIcon} from '../../theme/CustomIcons.tsx';
import {useNavigate} from "react-router-dom";
import CardComponent from "../shared/CardComponent.tsx";
import {authService} from '../../services/authService.ts';
import {toast} from "react-toastify";


export default function SignInCard() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [apiError, setApiError] = React.useState('');
    const navigate = useNavigate()

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const validateInputs = () => {
        let isValid = true;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }
        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        if (!isValid) toast.warning("Please check your inputs!");
        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateInputs()) return;

        setLoading(true);
        setApiError('');

        try {
            const data = await authService.login({email, password});
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err: any) {
            setApiError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CardComponent variant="outlined">
            <Box sx={{display: {xs: 'flex', md: 'none'}, justifyContent: 'center', mb: 2}}>
                <ExpenseIcon fontSize="large"/>
            </Box>

            <Typography
                component="h1"
                variant="h4"
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: 'clamp(1.8rem, 6vw, 2.2rem)',
                }}
            >
                Sign in
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 2}}
            >
                <FormControl fullWidth>
                    <FormLabel htmlFor="email" sx={{mb: 1, fontWeight: 500}}>Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                        <FormLabel htmlFor="password" sx={{fontWeight: 500}}>Password</FormLabel>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                        >
                            Forgot password?
                        </Link>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="••••••"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </FormControl>

                <FormControlLabel
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Remember me"
                />

                <ForgotPassword open={open} handleClose={handleClose}/>

                {apiError && (
                    <Typography color="error" sx={{textAlign: 'center'}}>
                        {apiError}
                    </Typography>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{mt: 1, py: 1.5, borderRadius: 3}}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Typography sx={{textAlign: 'center', mt: 2, fontSize: '0.9rem', color: 'text.secondary'}}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" variant="body2">
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </CardComponent>
    );
}
