import * as React from "react";
import {useState} from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CardComponent from "../shared/CardComponent.tsx";
import {SitemarkIcon} from "../../theme/CustomIcons.tsx";
import Button from "@mui/material/Button";
import {authService} from "../../services/authService.ts";
import {useNavigate} from "react-router-dom";
import Link from "@mui/material/Link";
import {toast} from "react-toastify";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

function RegisterCard() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [apiError, setApiError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const validateForm = () => {
        let isValid = true
        const newErrors = {...errors}

        if (password !== confirmPassword)
            newErrors.confirmPassword = 'Fjalëkalimet nuk përputhen'

        if (!firstName) {
            newErrors.firstName = 'Emri është i detyrueshëm'
            isValid = false
        } else {
            newErrors.firstName = ''
        }

        if (!lastName) {
            newErrors.lastName = 'Mbiemri është i detyrueshëm'
            isValid = false
        } else {
            newErrors.lastName = ''
        }

        if (!phoneNumber) {
            newErrors.phoneNumber = 'Numri i telefonit është i detyrueshëm'
            isValid = false
        } else {
            newErrors.phoneNumber = ''
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Ju lutemi shkruani një email valid'
            isValid = false
        } else {
            newErrors.email = ''
        }

        if (!password || password.length < 6) {
            newErrors.password = 'Fjalëkalimi duhet të ketë të paktën 6 karaktere'
            isValid = false
        } else {
            newErrors.password = ''
        }

        if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Fjalëkalimet nuk përputhen'
            isValid = false
        } else {
            newErrors.confirmPassword = ''
        }

        if (!isValid) toast.warning("Ju lutemi kontrolloni të dhënat!")

        setErrors(newErrors)
        return isValid
    }

    const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        const payload = {firstName, lastName, email, phoneNumber, password, confirmPassword};

        try {
            await authService.register(payload);
            toast.success("Llogaria u krijua me sukses!");
            navigate('/login');
        } catch (err: any) {
            setApiError(err.message || 'Regjistrimi dështoi!');
            toast.error(err.message || 'Regjistrimi dështoi!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CardComponent>
            <Box sx={{display: {xs: 'flex', md: 'none'}, justifyContent: 'center', mb: 2}}>
                <SitemarkIcon fontSize="large"/>
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
                Regjistrohu
            </Typography>

            {apiError && (
                <Typography color="error" sx={{textAlign: 'center'}}>
                    {apiError}
                </Typography>
            )}

            <Box component="form" onSubmit={onHandleSubmit} sx={{maxWidth: 400, mx: 'auto', mt: 4}}>
                <TextField
                    label="Emri"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value);
                        setErrors(prev => ({...prev, firstName: ''}));
                    }}
                    sx={{mb: 2}}
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />

                <TextField
                    label="Mbiemri"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value);
                        setErrors(prev => ({...prev, lastName: ''}));
                    }}
                    sx={{mb: 2}}
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />

                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({...prev, email: ''}));
                    }}
                    sx={{mb: 2}}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <TextField
                    label="Numri i telefonit"
                    value={phoneNumber}
                    onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setErrors(prev => ({...prev, phoneNumber: ''}));
                    }}
                    sx={{mb: 2}}
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                />

                <TextField
                    label="Fjalëkalimi"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors(prev => ({...prev, password: ''}));
                    }}
                    sx={{mb: 2}}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Konfirmo fjalëkalimin"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors(prev => ({...prev, confirmPassword: ''}));
                    }}
                    sx={{mb: 2}}
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(prev => !prev)} edge="end">
                                    {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{mt: 1, py: 1.5, borderRadius: 3}}
                >
                    {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
                </Button>

                <Typography sx={{textAlign: 'center', mt: 2, fontSize: '0.9rem', color: 'text.secondary'}}>
                    Ke llogari?{' '}
                    <Link href="/login" variant="body2">
                        Hyr
                    </Link>
                </Typography>
            </Box>
        </CardComponent>
    );
}

export default RegisterCard;