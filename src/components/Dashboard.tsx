import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SideMenu from './dashboard/SideMenu';
import AppNavbar from './dashboard/AppNavbar';

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'background.default' }}>
            <SideMenu />
            <AppNavbar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: 'background.default',
                    overflow: 'auto',
                    p: 3,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
