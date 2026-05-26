import {Box, Typography} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

type Props = {
    income: number;
    expense: number;
};

export function BalanceCard({income, expense}: Props) {
    const difference = income - expense;

    return (
        <Box
            sx={{
                mt: 3,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#e8f5e9",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <TrendingUpIcon sx={{color: "green", fontSize: 40}}/>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Totali i të ardhurave
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="green">
                        €{income}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#ffebee",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <TrendingDownIcon sx={{color: "red", fontSize: 40}}/>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Totali i shpenzimeve
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="red">
                        €{expense}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: difference >= 0 ? "#e3f2fd" : "#fff3e0",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <AccountBalanceWalletIcon
                    sx={{
                        color: difference >= 0 ? "#1976d2" : "#ef6c00",
                        fontSize: 40,
                    }}
                />

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Diferenca
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={difference >= 0 ? "#1976d2" : "#ef6c00"}
                    >
                        €{difference}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}