import {Box} from '@mui/material';
import {Outlet} from 'react-router-dom';
import SideMenu from '../layouts/SideMenu.tsx';
import AppNavbar from '../layouts/AppNavbar.tsx';
import ColorModeIconDropdown from "../../theme/ColorModeIconDropdown.tsx";
import * as React from "react";

export default function Dashboard() {
    return (
        <Box sx={{display: "flex", height: "100vh", bgcolor: "background.default"}}>

            <SideMenu/>
            <Box sx={{flex: 1, display: "flex", flexDirection: "column"}}>

                <AppNavbar/>

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflow: "auto",
                        p: 3
                    }}
                >
                    <ColorModeIconDropdown
                        sx={{
                            position: "fixed",
                            top: 22,
                            right: 50,
                        }}
                    />
                    <br/>
                    <br/>
                    <Outlet/>
                </Box>

            </Box>
        </Box>
    );
}