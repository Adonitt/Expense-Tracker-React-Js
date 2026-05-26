import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from "@mui/material/Box";

interface FinancialBarChartProps {
    transactions: any[];
}

export default function FinancialBarChart({ transactions }: FinancialBarChartProps) {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getLast6Months = () => {
        const months = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push({
                name: monthNames[d.getMonth()],
                index: d.getMonth(),
                year: d.getFullYear()
            });
        }
        return months;
    };

    const last6Months = getLast6Months();

    const chartData = last6Months.map(month => {
        const monthlyTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === month.index && date.getFullYear() === month.year;
        });

        return {
            income: monthlyTransactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0),
            expense: monthlyTransactions.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0),
        };
    });

    const incomeSeries = chartData.map(d => d.income);
    const expenseSeries = chartData.map(d => d.expense);

    const totalIncome = incomeSeries.reduce((a, b) => a + b, 0);

    return (
        <Card variant="outlined" sx={{ width: '100%', borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    6 Muajt e fundit
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    sx={{ justifyContent: 'space-between', mb: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}
                >
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: '800' }}>
                            €{totalIncome.toLocaleString()}
                        </Typography>
                        <Chip size="small" color="primary" label="Totali i të ardhurave" />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Të hyrat kundër shpenzimeve
                    </Typography>
                </Stack>

                <Box sx={{ width: '100%', height: isMobile ? 250 : 300 }}>
                    <BarChart
                        borderRadius={6}
                        colors={[theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main]}
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: last6Months.map(m => m.name),
                                tickLabelStyle: {
                                    fontSize: isMobile ? 10 : 12,
                                },
                            },
                        ]}
                        yAxis={[
                            {
                                valueFormatter: (value) =>
                                    isMobile && value >= 1000
                                        ? `${(value / 1000).toFixed(0)}k`
                                        : value.toLocaleString(),
                                tickLabelStyle: {
                                    fontSize: isMobile ? 10 : 12,
                                },
                            }
                        ]}
                        series={[
                            { label: 'Inc', data: incomeSeries },
                            { label: 'Exp', data: expenseSeries },
                        ]}
                        margin={{
                            left: isMobile ? 35 : 50,
                            right: 10,
                            top: 20,
                            bottom: isMobile ? 30 : 40
                        }}
                        grid={{ horizontal: true }}
                        slotProps={{
                            legend: {
                                hidden: isMobile,
                            },
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}