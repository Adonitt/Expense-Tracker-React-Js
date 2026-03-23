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
import LockResetRounded from '@mui/icons-material/LockResetRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import {useLocation, useNavigate} from "react-router-dom";
import {hasRole, getLoggedInUser} from "../../utils/auth.ts";
import {ChangePasswordDialog} from "../profile/ChangePasswordDialog.tsx";
import {UserDetailsPopUp} from "../users/UserDetailsPopUp.tsx";
import {useState} from "react";

const mainListItems = [
    {text: 'Home', icon: <HomeRoundedIcon/>, path: '/'},
    {text: 'Users', icon: <PeopleRoundedIcon/>, path: '/users', adminOnly: true},
    {text: 'Transactions', icon: <AnalyticsRoundedIcon/>, path: '/transactions'},
    {text: 'Debts', icon: <AssignmentRoundedIcon/>, path: '/debts'},
];

const secondaryListItems = [
    {text: 'My Profile', icon: <AccountCircleRoundedIcon/>, action: 'openProfile'},
    {text: 'Change Password', icon: <LockResetRounded/>, action: 'changePassword'},
];

export default function MenuContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const user = getLoggedInUser();

    const handleItemClick = (item: any) => {
        if (item.action === 'changePassword') {
            setChangePasswordOpen(true);
        } else if (item.action === 'openProfile') {
            setProfileOpen(true);
        } else {
            navigate(item.path);
        }
    };

    return (
        <>
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
                                onClick={() => handleItemClick(item)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Stack>

            <ChangePasswordDialog
                open={changePasswordOpen}
                onClose={() => setChangePasswordOpen(false)}
            />

            <UserDetailsPopUp
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                userId={user?.id ?? null}
            />
        </>
    );
}