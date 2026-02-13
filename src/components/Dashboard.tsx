import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SideMenu from './dashboard/SideMenu';
import AppNavbar from './dashboard/AppNavbar';
import ColorModeSelect from "../theme/ColorModeSelect.tsx";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'background.default' }}>
            <ColorModeSelect sx={{position: 'fixed', top: '1.5rem', right: '3rem'}}/>
            <SideMenu />
            <AppNavbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: 'background.default',
                    overflow: 'auto',
                    p: 3,
                    mt:5
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
