import { Box, LinearProgress, Paper, Typography } from "@mui/material";

export default function DebtWidget({ debt }: any) {

    const progress = (debt.paidAmount / debt.amount) * 100;

    return (
        <Paper sx={{ p: 3, borderRadius: 4 }}>

            <Typography fontWeight="800">
                Debt Progress
            </Typography>

            <Typography variant="body2" color="text.secondary">
                {debt.person}
            </Typography>

            <Box sx={{ mt: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 10, borderRadius: 5 }}
                />
            </Box>

            <Typography sx={{ mt: 1 }} fontWeight="700">
                {Math.round(progress)}%
            </Typography>

        </Paper>
    );
}