import {useEffect, useState} from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Divider, Skeleton, useTheme} from '@mui/material';
import Copyright from '../../internals/components/Copyright';
import StatCard, {type StatCardProps} from "./StatCard.tsx";
import FinancialBarChart from "./PageViewBarChart.tsx";

// API Services
import {transactionsService} from "../../services/transactionsService.ts";
import {debtsService, type DebtsListPayload} from "../../services/debtsService.ts";

export default function MainGrid() {
    const theme = useTheme();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [debts, setDebts] = useState<DebtsListPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [userRole] = useState("ADMIN");

    const L = {
        title: "Një përmbledhje e shkurtër e financave",
        subtitle: "Fluksi në kohë reale për",
        income: "Të ardhura",
        expenses: "Shpenzime",
        lent: "Borxhe që më detyrohen",
        borrowed: "Borxhe që duhet t’i paguaj",
        transactions: "Transaksione",
        thisMonth: "Ky muaj",
        history: "Fluksi historik i parave dhe borxheve",
        loading: "Duke u ngarkuar..."
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
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

    const getMonthlyTransactionData = (type: string) => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dailyStats = new Array(daysInMonth).fill(0);

        transactions
            .filter(t => t.type?.toUpperCase() === type.toUpperCase())
            .forEach(t => {
                const tDate = new Date(t.date);
                if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                    const day = tDate.getDate() - 1;
                    dailyStats[day] += t.amount;
                }
            });

        return dailyStats;
    };

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

    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const incomeTotal = monthlyTransactions
        .filter(t => t.type?.toUpperCase() === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenseTotal = monthlyTransactions
        .filter(t => t.type?.toUpperCase() === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const lentTotal = debts
        .filter(d => d.type === "LENT" && d.status === "PENDING")
        .reduce((sum, d) => sum + d.remainingAmount, 0);

    const borrowedTotal = debts
        .filter(d => d.type === "BORROWED" && d.status === "PENDING")
        .reduce((sum, d) => sum + d.remainingAmount, 0);

    const baseCards: StatCardProps[] = [
        {
            title: L.income,
            value: `€${incomeTotal.toLocaleString()}`,
            interval: L.thisMonth,
            trend: 'up',
            data: getMonthlyTransactionData("INCOME"),
        },
        {
            title: L.expenses,
            value: `€${expenseTotal.toLocaleString()}`,
            interval: L.thisMonth,
            trend: 'down',
            data: getMonthlyTransactionData("EXPENSE"),
        },
        {
            title: L.lent,
            value: `€${lentTotal.toLocaleString()}`,
            interval: "Gjendja aktive",
            trend: 'neutral',
            data: getMonthlyDebtData("LENT"),
        },
        {
            title: L.borrowed,
            value: `€${borrowedTotal.toLocaleString()}`,
            interval: "Gjendja aktive",
            trend: 'down',
            data: getMonthlyDebtData("BORROWED"),
        },
    ];

    const statCards = userRole === "ADMIN"
        ? [...baseCards, {
            title: L.transactions,
            value: `${monthlyTransactions.length}`,
            interval: L.thisMonth,
            trend: 'neutral',
            data: [incomeTotal, expenseTotal],
        } as StatCardProps]
        : baseCards;

    if (loading) return <DashboardSkeleton />;

    return (
        <Box sx={{ width: '100%', maxWidth: '1800px' }}>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography component="h1" variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1.5px', mt: 4 }}>
                        {L.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {L.subtitle} {now.toLocaleString('default', {month: 'long', year: 'numeric'})}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {statCards.map((card, index) => (
                    <Grid item key={index} xs={12} sm={4} lg={userRole === "ADMIN" ? 2.4 : 3}>
                        <StatCard {...card} />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 6 }} />

            <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 700, px: 1 }}>
                {L.history}
            </Typography>

            <Box sx={{
                p: {xs: 2, md: 3},
                bgcolor: 'background.paper',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                border: '1px solid',
                borderColor: 'divider'
            }}>
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