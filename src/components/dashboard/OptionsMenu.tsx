import * as React from 'react';
import {styled} from '@mui/material/styles';
import Divider, {dividerClasses} from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import {paperClasses} from '@mui/material/Paper';
import {listClasses} from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton';
import {useNavigate} from "react-router-dom";
import {ChangePasswordDialog} from "../profile/ChangePasswordDialog.tsx";
import {UserDetailsPopUp} from "../users/UserDetailsPopUp.tsx";
import {UserEditPopUp} from "../users/UserEditPopUp.tsx";
import {getLoggedInUser} from "../../utils/auth.ts";

const MenuItem = styled(MuiMenuItem)({
    margin: '2px 0',
});

export default function OptionsMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openChangePassword, setOpenChangePassword] = React.useState(false);
    const [openProfile, setOpenProfile] = React.useState(false);
    const [editPopUpOpen, setEditPopUpOpen] = React.useState(false);

    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const user = getLoggedInUser();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (!user) return null;

    return (
        <>
            <MenuButton aria-label="Open menu" onClick={handleClick} sx={{borderColor: 'transparent'}}>
                <MoreVertRoundedIcon/>
            </MenuButton>

            <Menu
                anchorEl={anchorEl}
                id="menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                sx={{
                    [`& .${listClasses.root}`]: {padding: '4px'},
                    [`& .${paperClasses.root}`]: {padding: 0},
                    [`& .${dividerClasses.root}`]: {margin: '4px -4px'},
                }}
            >
                <MenuItem onClick={() => { handleClose(); setOpenProfile(true); }}>
                    My Profile
                </MenuItem>

                <MenuItem onClick={() => { handleClose(); setOpenChangePassword(true); }}>
                    Change Password
                </MenuItem>

                <Divider/>

                <MenuItem onClick={logout}>
                    <ListItemText>Logout</ListItemText>
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small"/>
                    </ListItemIcon>
                </MenuItem>
            </Menu>

            {/* Popups */}
            <ChangePasswordDialog
                open={openChangePassword}
                onClose={() => setOpenChangePassword(false)}
            />

            <UserDetailsPopUp
                open={openProfile}
                onClose={() => setOpenProfile(false)}
                userId={user.id}
                onEdit={() => {
                    setOpenProfile(false);
                    setEditPopUpOpen(true);
                }}
            />

            <UserEditPopUp
                open={editPopUpOpen}
                onClose={() => setEditPopUpOpen(false)}
                userId={user.id}
                onSaved={() => console.log("User updated")}
            />
        </>
    );
}