import {
    Box,
    Paper,
    Typography,
    Stack,
    Chip
} from "@mui/material";

export default function RecentTransactions({ transactions }: any) {
    return (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 4 }}>

            <Typography fontWeight="800" variant="h6">
                Recent Transactions
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>

                {transactions?.map((t: any) => (
                    <Box
                        key={t.id}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 2,
                            borderRadius: 3,
                            bgcolor: "action.hover"
                        }}
                    >
                        <Box>
                            <Typography fontWeight="700">{t.category}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {t.date}
                            </Typography>
                        </Box>

                        <Chip
                            label={t.type}
                            color={t.type === "INCOME" ? "success" : "error"}
                        />

                        <Typography fontWeight="800">
                            {t.type === "INCOME" ? "+" : "-"}€{t.amount}
                        </Typography>
                    </Box>
                ))}

            </Stack>

        </Paper>
    );
}