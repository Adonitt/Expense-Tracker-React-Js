import {Outlet} from 'react-router-dom';
import {alpha} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import AppTheme from '../theme/AppTheme';
import SideMenu from './dashboard/SideMenu';
import AppNavbar from './dashboard/AppNavbar';
import {chartsCustomizations} from "../theme/customizations/charts.ts";
import {datePickersCustomizations} from '../theme/customizations/datePicker.ts';
import {treeViewCustomizations} from "../theme/customizations/treeView.ts";

const xThemeComponents = {
    ...chartsCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme/>
            <Box sx={{display: 'flex'}}>
                <SideMenu/>
                <AppNavbar/>

                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                        p: 3,
                    })}
                >

                    <Outlet/>
                </Box>
            </Box>
        </AppTheme>
    );
}
