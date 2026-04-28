import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

export type StatCardProps = {
    title: string;
    value: string;
    interval: string;
    trend: 'up' | 'down' | 'neutral';
    data: number[];
};

function AreaGradient({ color, id }: { color: string; id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

export default function StatCard({ title, value, interval, trend, data }: StatCardProps) {
    const theme = useTheme();
    const daysLabels = data.map((_, index) => `Day ${index + 1}`);

    const isDebt = title.toLowerCase().includes('debt');

    const trendColors = {
        up: theme.palette.success.main,
        down: isDebt ? theme.palette.warning.main : theme.palette.error.main,
        neutral: theme.palette.info.main,
    };

    const labelColors = {
        up: 'success' as const,
        down: isDebt ? 'warning' as const : 'error' as const,
        neutral: 'info' as const,
    };

    const getChange = () => {
        if (data.length < 2) return 0;
        const first = data[0];
        const last = data[data.length - 1];
        if (first === 0) return last !== 0 ? 100 : 0;
        return ((last - first) / Math.abs(first)) * 100;
    };

    const percent = getChange();
    const chartColor = trendColors[trend];
    const gradientId = `area-gradient-${title.replace(/\s+/g, '-')}`;

    return (
        <Card variant="outlined" sx={{  flexGrow: 1, borderRadius: 3 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Stack spacing={1}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            {value}
                        </Typography>
                        <Chip
                            size="small"
                            color={labelColors[trend]}
                            label={`${percent >= 0 ? '+' : ''}${percent.toFixed(0)}%`}
                        />
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                        {interval}
                    </Typography>

                    <Box sx={{ width: '100%', height: { xs: 50, md: 60 }, mt: 1 }}>
                        <SparkLineChart
                            data={data.length > 0 ? data : [0, 0, 0]}
                            colors={[chartColor]}
                            area
                            showHighlight
                            showTooltip
                            xAxis={{
                                scaleType: 'band',
                                data: daysLabels
                            }}
                            sx={{
                                [`& .${areaElementClasses.root}`]: {
                                    fill: `url(#${gradientId})`,
                                },
                            }}
                        >
                            <AreaGradient color={chartColor} id={gradientId} />
                        </SparkLineChart>

                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}