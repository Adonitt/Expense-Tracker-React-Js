import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import {ExpenseIcon} from '../../theme/CustomIcons.tsx';

const items = [
    {
        icon: <SettingsSuggestRoundedIcon sx={{color: 'text.secondary'}}/>,
        title: 'Ndjek lehtësisht shpenzimet',
        description:
            'Regjistro shpejt të gjitha të ardhurat dhe shpenzimet për të ditur gjithmonë ku shkojnë paratë e tua.',
    },
    {
        icon: <ConstructionRoundedIcon sx={{color: 'text.secondary'}}/>,
        title: 'Gjenero raporte',
        description:
            'Merr raporte të detajuara mujore ose vjetore për të analizuar zakonet e shpenzimeve të tua.',
    },
    {
        icon: <ThumbUpAltRoundedIcon sx={{color: 'text.secondary'}}/>,
        title: 'Ndërfaqe e lehtë për përdorim',
        description:
            'Lëviz lehtësisht në aplikacion me një dizajn të pastër dhe intuitiv.',
    },
    {
        icon: <AutoFixHighRoundedIcon sx={{color: 'text.secondary'}}/>,
        title: 'Buxhet & Njoftime',
        description:
            'Vendos buxhete për kategori të ndryshme dhe merr njoftime kur i afrohesh limitit.',
    },
];

export default function Content() {
    return (
        <Stack
            sx={{flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450}}
        >
            <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                <ExpenseIcon/>
            </Box>
            {items.map((item, index) => (
                <Stack key={index} direction="row" sx={{gap: 2}}>
                    {item.icon}
                    <div>
                        <Typography gutterBottom sx={{fontWeight: 'medium'}}>
                            {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            {item.description}
                        </Typography>
                    </div>
                </Stack>
            ))}
        </Stack>
    );
}
