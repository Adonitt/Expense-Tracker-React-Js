import {Box} from '@mui/material';
import {Outlet} from 'react-router-dom';
import SideMenu from '../layouts/SideMenu.tsx';
import AppNavbar from '../layouts/AppNavbar.tsx';
import ColorModeSelect from "../../theme/ColorModeSelect.tsx";

export default function Dashboard() {
    return (
        <Box sx={{display: "flex", height: "100vh", bgcolor: "background.default"}}>

            <ColorModeSelect sx={{position: "fixed", top: 16, right: 24, zIndex: 2000}}/>

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
                    <Outlet/>
                </Box>

            </Box>
        </Box>
    );
}