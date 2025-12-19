import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import {ExpenseIcon, SitemarkIcon} from '../../theme/CustomIcons.tsx';


const items = [
    {
        icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'Track Expenses Easily',
        description:
            'Quickly log all your income and expenses to always know where your money goes.',
    },
    {
        icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'Generate Reports',
        description:
            'Get detailed monthly or yearly reports to analyze your spending habits effectively.',
    },
    {
        icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'User-Friendly Interface',
        description:
            'Navigate effortlessly through the app with a clean and intuitive dashboard.',
    },
    {
        icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
        title: 'Budget & Alerts',
        description:
            'Set budgets for different categories and receive notifications when you approach limits.',
    },
];

export default function Content() {
    return (
        <Stack
            sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
        >
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <ExpenseIcon />
            </Box>
            {items.map((item, index) => (
                <Stack key={index} direction="row" sx={{ gap: 2 }}>
                    {item.icon}
                    <div>
                        <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                            {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.description}
                        </Typography>
                    </div>
                </Stack>
            ))}
        </Stack>
    );
}
