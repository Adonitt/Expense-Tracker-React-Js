
import { Box, Grid, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Paper } from "@mui/material";

const Card = ({ title, value, icon, color }: any) => (
    <Paper sx={{
        p: 3,
        borderRadius: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "background.paper"
    }}>
        <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" fontWeight="800">{value}</Typography>
        </Box>
        <Box sx={{
            width: 50,
            height: 50,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: color
        }}>
            {icon}
        </Box>
    </Paper>
);

export default function DashboardHome() {
    return (
        <Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800">
                    Paneli i financave
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Overview of your income, expenses and debt

                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Card
                        title="Balance"
                        value="€12,450"
                        icon={<AccountBalanceWalletIcon sx={{ color: "#fff" }} />}
                        color="primary.main"
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card
                        title="Income"
                        value="€5,200"
                        icon={<TrendingUpIcon sx={{ color: "#fff" }} />}
                        color="success.main"
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card
                        title="Expenses"
                        value="€2,900"
                        icon={<TrendingDownIcon sx={{ color: "#fff" }} />}
                        color="error.main"
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card
                        title="Active Debts"
                        value="€1,200"
                        icon={<CreditCardIcon sx={{ color: "#fff" }} />}
                        color="warning.main"
                    />
                </Grid>
            </Grid>

        </Box>
    );
}