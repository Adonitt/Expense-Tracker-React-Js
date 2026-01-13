import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import {useLocation, useNavigate} from "react-router-dom";
import {hasRole} from "../../utils/auth.ts";

const mainListItems = [
    {text: 'Home', icon: <HomeRoundedIcon/>, path: '/'},
    {text: 'Users', icon: <PeopleRoundedIcon/>, path: '/users', adminOnly: true},
    {text: 'Income', icon: <AnalyticsRoundedIcon/>, path: '/income'},
    {text: 'Expense', icon: <AnalyticsRoundedIcon/>, path: '/expense'},
    {text: 'Debts', icon: <AssignmentRoundedIcon/>, path: '/debts'},
];

const secondaryListItems = [
    {text: 'Settings', icon: <SettingsRoundedIcon/>, path: '/settings'},
    {text: 'About', icon: <InfoRoundedIcon/>, path: '/about'},
    {text: 'Feedback', icon: <HelpRoundedIcon/>, path: '/feedback'},
];
export default function MenuContent() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {mainListItems.map((item, index) => {
                    if (item.adminOnly && !hasRole("ADMIN")) return null;

                    return (
                        <ListItem key={index} disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text}/>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
