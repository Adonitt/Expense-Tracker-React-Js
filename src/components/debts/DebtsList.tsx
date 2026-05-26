import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Pagination,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import PageContainer from "../users/PageContainer.tsx";
import {debtsService} from "../../services/debtsService.ts";
import {CreateDebtPopUp} from "./CreateDebtPopUp.tsx";
import {DebtDetailsPopUp} from "./DebtsDetailsPopUp.tsx";
import {DebtEditPopUp} from "./DebtEditPopUp.tsx";
import {DebtDeleteDialog} from "./DebtDeleteDialog.tsx";

import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export function DebtsList() {

    const [debts, setDebts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 3;

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [openCreate, setOpenCreate] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedDebtId, setSelectedDebtId] = useState<number | null>(null);

    const [personFilter, setPersonFilter] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<"ALL" | "PAID" | "IN_PROGRESS">("ALL");

    const [typeFilter, setTypeFilter] =
        useState<"ALL" | "LENT" | "BORROWED">("ALL");

    const fetchDebts = () => {
        setLoading(true);
        debtsService.getAllDebts()
            .then(res => setDebts(res || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDebts();
    }, []);

    const clearFilters = () => {
        setPersonFilter("");
        setFromDate("");
        setToDate("");
        setStatusFilter("ALL");
        setTypeFilter("ALL");
        setPage(1);
    };

    const baseFiltered = debts
        .filter(d =>
            d.person?.toLowerCase().includes(personFilter.toLowerCase())
        )
        .filter(d => {
            if (statusFilter === "PAID") return d.status === "PAID";
            if (statusFilter === "IN_PROGRESS") return d.status !== "PAID";
            return true;
        })
        .filter(d => {
            if (typeFilter === "ALL") return true;
            return d.type === typeFilter;
        })
        .filter(d => {
            if (!fromDate && !toDate) return true;

            const date = new Date(d.date).getTime();
            const from = fromDate ? new Date(fromDate).getTime() : 0;
            const to = toDate ? new Date(toDate).getTime() : Infinity;

            return date >= from && date <= to;
        });

    const paginatedDebts = baseFiltered.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(baseFiltered.length / pageSize);

    const totalDebt = baseFiltered.reduce((s, d) => s + (d.amount || 0), 0);
    const totalPaid = baseFiltered.reduce((s, d) => s + (d.paidAmount || 0), 0);
    const totalRemaining = baseFiltered.reduce((s, d) => s + (d.remainingAmount || 0), 0);

    const pieData = [
        {name: "Paid", value: totalPaid},
        {name: "Remaining", value: totalRemaining}
    ];

    const barData = [
        {name: "Totali", total: totalDebt},
        {name: "Paguar", total: totalPaid},
        {name: "Mbetja", total: totalRemaining}
    ];

    const COLORS = ["#2e7d32", "#d32f2f"];

    const TYPE_LABELS: Record<string, string> = {
        LENT: "Kam dhënë borxh ",
        BORROWED: "Kam marrë borxh ",
    };

    const STATUS_LABELS: Record<string, string> = {
        PAID: "E paguar",
        PARTIAL: "Pjesërisht",
        PENDING: "Në proces",
    };


    const StatusChip = ({ status }: any) => {
        const label = STATUS_LABELS[status] || status;

        const color =
            status === "PAID"
                ? "success"
                : status === "PARTIAL"
                    ? "warning"
                    : "error";

        return <Chip label={label} size="small" color={color} />;
    };

    const TypeChip = ({ type }: any) => {
        const label = TYPE_LABELS[type] || type;

        const color =
            type === "LENT"
                ? "error"
                : "primary";

        return <Chip label={label} size="small" color={color} />;
    };

    const getProgress = (debt: any) => {
        if (!debt.amount) return 0;
        return Math.min((debt.paidAmount / debt.amount) * 100, 100);
    };

    const DebtCard = ({debt}: any) => {
        const isLent = debt.type === "LENT";

        return (
            <Card
                onClick={() => {
                    setSelectedDebtId(debt.id);
                    setDetailsOpen(true);
                }}
                sx={{
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": {transform: "scale(1.02)"},
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 1
                }}
            >
                <CardContent>

                    <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon fontSize="small"/>
                            <Typography fontWeight="bold">
                                {debt.person}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <TypeChip type={debt.type}/>
                            <StatusChip status={debt.status}/>
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{mt: 1}}>
                        {isLent ? (
                            <TrendingDownIcon color="error"/>
                        ) : (
                            <TrendingUpIcon color="success"/>
                        )}

                        <Typography fontWeight="bold"
                                    color={isLent ? "error.main" : "success.main"}>
                            €{debt.amount}
                        </Typography>
                    </Stack>

                    <Typography variant="body2" sx={{mt: 1}} color="text.secondary">
                        {debt.description}
                    </Typography>

                    <Box sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "rgba(0,0,0,0.03)"
                    }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Paid</Typography>
                            <Typography fontWeight="bold" color="success.main">
                                €{debt.paidAmount}
                            </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Remaining</Typography>
                            <Typography fontWeight="bold" color="error.main">
                                €{debt.remainingAmount}
                            </Typography>
                        </Stack>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={getProgress(debt)}
                        sx={{mt: 2, height: 8, borderRadius: 5}}
                    />

                    <Stack direction="row" justifyContent="space-between" sx={{mt: 1}}>
                        <Typography variant="caption">{debt.date}</Typography>
                        <Typography variant="caption">
                            {Math.round(getProgress(debt))}%
                        </Typography>
                    </Stack>

                </CardContent>
            </Card>
        );
    };

    return (
        <PageContainer
            title="Borxhet"
            sx={{
                minHeight: "100dvh",
                overflowX: "hidden",
                px: {xs: 1, md: 3}
            }}
        >

            <Stack direction="row" justifyContent="space-between" sx={{mb: 2}}>
                <Typography variant="h6">Paneli i Borxheve</Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => setOpenCreate(true)}
                >
                    Krijo
                </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{mb: 2, flexWrap: "wrap"}}>
                <Chip label="Të gjitha statuset"
                      clickable
                      color={statusFilter === "ALL" ? "primary" : "default"}
                      onClick={() => setStatusFilter("ALL")}/>

                <Chip label="Të paguara"
                      clickable
                      color={statusFilter === "PAID" ? "success" : "default"}
                      onClick={() => setStatusFilter("PAID")}/>

                <Chip label="Në proces"
                      clickable
                      color={statusFilter === "IN_PROGRESS" ? "warning" : "default"}
                      onClick={() => setStatusFilter("IN_PROGRESS")}/>

                <Chip label="Të gjitha llojet"
                      clickable
                      color={typeFilter === "ALL" ? "primary" : "default"}
                      onClick={() => setTypeFilter("ALL")}/>

                <Chip label="Të dhëna (Lent)"
                      clickable
                      color={typeFilter === "LENT" ? "error" : "default"}
                      onClick={() => setTypeFilter("LENT")}/>

                <Chip label="Të marra (Borrowed)"
                      clickable
                      color={typeFilter === "BORROWED" ? "info" : "default"}
                      onClick={() => {
                          setTypeFilter("BORROWED");
                      }}/>
            </Stack>

            <TextField
                label="Kërko personin"
                size="small"
                value={personFilter}
                onChange={(e) => setPersonFilter(e.target.value)}
                sx={{mb: 3, width: {xs: "100%", md: 250}}}
            />

            <Stack direction={{xs: "column", md: "row"}} spacing={2} sx={{mb: 2}}>
                <TextField type="date" size="small"
                           InputLabelProps={{shrink: true}}
                           value={fromDate}
                           onChange={(e) => setFromDate(e.target.value)}/>

                <TextField type="date" size="small"
                           InputLabelProps={{shrink: true}}
                           value={toDate}
                           onChange={(e) => setToDate(e.target.value)}/>

                <Button variant="outlined" onClick={clearFilters}>
                    Pastro
                </Button>
            </Stack>

            {/* SUMMARY */}
            <Stack direction={{xs: "column", md: "row"}} spacing={2} sx={{mb: 3}}>
                <Card sx={{flex: 1}}>
                    <CardContent>
                        <Typography>Total</Typography>
                        <Typography>€{totalDebt}</Typography>
                    </CardContent>
                </Card>

                <Card sx={{flex: 1}}>
                    <CardContent>
                        <Typography>Të paguara</Typography>
                        <Typography color="success.main">€{totalPaid}</Typography>
                    </CardContent>
                </Card>

                <Card sx={{flex: 1}}>
                    <CardContent>
                        <Typography>Mbetur</Typography>
                        <Typography color="error.main">€{totalRemaining}</Typography>
                    </CardContent>
                </Card>
            </Stack>

            {/* GRID */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)"
                },
                gap: 3
            }}>
                {paginatedDebts.map(debt => (
                    <DebtCard key={debt.id} debt={debt}/>
                ))}
            </Box>

            {/* PAGINATION */}
            <Stack alignItems="center" sx={{mt: 3}}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                />
            </Stack>

            {/* CHARTS */}
            <Stack direction={{xs: "column", md: "row"}} spacing={3} sx={{mt: 4}}>

                <Card sx={{flex: 1, width: "100%"}}>
                    <CardContent>
                        <Typography fontWeight="bold">Të Paguara vs Në proces</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" outerRadius={90}>
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card sx={{flex: 1, width: "100%"}}>
                    <CardContent>
                        <Typography fontWeight="bold">Overview</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barData}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="total" fill="#1976d2"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </Stack>

            {selectedDebtId && (
                <DebtDetailsPopUp
                    open={detailsOpen}
                    debtId={selectedDebtId}
                    onClose={() => setDetailsOpen(false)}
                    onDetails={fetchDebts}
                />
            )}

            <CreateDebtPopUp
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={fetchDebts}
            />

        </PageContainer>
    );
}