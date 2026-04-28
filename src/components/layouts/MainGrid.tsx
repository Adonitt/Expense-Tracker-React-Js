import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Stack, Divider, Skeleton, useTheme } from '@mui/material';
import Copyright from '../../internals/components/Copyright';
import StatCard, { type StatCardProps } from "./StatCard.tsx";
import FinancialBarChart from "./PageViewBarChart.tsx";

// API Services
import { transactionsService } from "../../services/transactionsService.ts";
import { debtsService, type DebtsListPayload } from "../../services/debtsService.ts"; // Ensure this import is correct

export default function MainGrid() {
    const theme = useTheme();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [debts, setDebts] = useState<DebtsListPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [userRole] = useState("ADMIN"); // Keep ADMIN so we see Transactions

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch Transaction and Debt data in PARALLEL for speed
                const [transactionsRes, debtsRes] = await Promise.all([
                    transactionsService.getAllTransactions(),
                    debtsService.getAllDebts()
                ]);
                setTransactions(transactionsRes || []);
                setDebts(debtsRes || []);
            } catch (err) {
                console.error("API Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Helper for transaction sparklines (Income/Expenses)
    const getMonthlyTransactionData = (type: string) => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dailyStats = new Array(daysInMonth).fill(0);

        transactions
            .filter(t => t.type?.toUpperCase() === type.toUpperCase())
            .forEach(t => {
                const tDate = new Date(t.date);
                if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                    const day = tDate.getDate() - 1;
                    dailyStats[day] += t.amount; // Sparklines show positive trend
                }
            });
        return dailyStats;
    };

    // Helper for Debt sparklines (Lent/Borrowed activity this month)
    const getMonthlyDebtData = (type: "LENT" | "BORROWED") => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dailyStats = new Array(daysInMonth).fill(0);

        debts
            .filter(d => d.type === type && d.status === "PENDING")
            .forEach(d => {
                const dDate = new Date(d.date);
                if (dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear) {
                    const day = dDate.getDate() - 1;
                    dailyStats[day] += d.remainingAmount;
                }
            });
        return dailyStats;
    };

    // ========================================
    // 📊 REAL-TIME CALCULATIONS
    // ========================================

    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // INCOME: Only current month
    const incomeTotal = monthlyTransactions
        .filter(t => t.type?.toUpperCase() === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    // EXPENSES: Only current month
    const expenseTotal = monthlyTransactions
        .filter(t => t.type?.toUpperCase() === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    // LENT: Total remaining I must RECEIVE
    const lentTotal = debts
        .filter(d => d.type === "LENT" && d.status === "PENDING")
        .reduce((sum, d) => sum + d.remainingAmount, 0);

    // BORROWED: Total remaining I must PAY
    const borrowedTotal = debts
        .filter(d => d.type === "BORROWED" && d.status === "PENDING")
        .reduce((sum, d) => sum + d.remainingAmount, 0);

    // ========================================
    // 📦 STAT CARDS CONFIGURATION
    // ========================================

    const baseCards: StatCardProps[] = [
        {
            title: 'Income',
            value: `€${incomeTotal.toLocaleString()}`,
            interval: 'This month',
            trend: 'up',
            data: getMonthlyTransactionData("INCOME"),
        },
        {
            title: 'Expenses',
            value: `€${expenseTotal.toLocaleString()}`,
            interval: 'This month',
            trend: 'down',
            data: getMonthlyTransactionData("EXPENSE"),
        },
        {
            title: 'Lent (Receivables)',
            value: `€${lentTotal.toLocaleString()}`,
            interval: 'Active balance',
            trend: 'neutral', // Money to receive, not inherently bad
            data: getMonthlyDebtData("LENT"),
        },
        {
            title: 'Borrowed (Payables)',
            value: `€${borrowedTotal.toLocaleString()}`,
            interval: 'Active balance',
            trend: 'down', // Debt we owe, requires paying
            data: getMonthlyDebtData("BORROWED"),
        },
    ];

    // Transactions Card is added, kept userRole as ADMIN
    const statCards = userRole === "ADMIN"
        ? [...baseCards, {
            title: 'Transactions',
            value: `${monthlyTransactions.length}`,
            interval: 'This month',
            trend: 'neutral',
            data: [incomeTotal, expenseTotal], // Simplified comparison for transaction sparkline
        } as StatCardProps]
        : baseCards;

    // Loading State with Skeletons for a modern UI
    if (loading) return <DashboardSkeleton />;

    return (
        <Box sx={{ width: '100%', maxWidth: '1800px', p: { xs: 2, md: 4 } }}>

            {/* Elegant Header Area */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography component="h1" variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1.5px' }}>
                        Financial Overview
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Real-time flow for {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {statCards.map((card, index) => (
                    <Grid item key={index} size={{xs: 12, sm: 4}} lg={userRole === "ADMIN" ? 2.4 : 3}>
                        <StatCard {...card} />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 6 }} />

            <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 700, px: 1 }}>
                Historical Cash Flow vs Debt Accumulation
            </Typography>
            <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
                <FinancialBarChart transactions={transactions} debts={debts} />
            </Box>

            <Copyright sx={{ my: 6 }} />
        </Box>
    );
}

function DashboardSkeleton() {
    return (
        <Box sx={{ p: 4 }}>
            <Skeleton variant="text" width={400} height={60} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 5, borderRadius: 1 }} />
            <Grid container spacing={3}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <Grid item key={i} xs={12} sm={6} md={2.4}>
                        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}