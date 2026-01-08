import * as React from 'react';
import type {ThemeOptions} from '@mui/material/styles';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {colorSchemes, shadows, shape, typography} from "./customizations/themePrimitive.ts";
import {inputsCustomizations} from './customizations/inputs.tsx';
import {feedbackCustomizations} from './customizations/feedback.tsx';
import {navigationCustomizations} from './customizations/navigation.tsx';
import {dataDisplayCustomizations} from "./customizations/dataDisplay.tsx";
import {surfacesCustomizations} from "./customizations/surfaces.ts";


interface AppThemeProps {
    children: React.ReactNode;

    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
    const {children, disableCustomTheme, themeComponents} = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                cssVariables: {
                    colorSchemeSelector: 'data-mui-color-scheme',
                    cssVarPrefix: 'template',
                },
                colorSchemes,
                typography,
                shadows,
                shape,
                components: {
                    ...inputsCustomizations,
                    ...dataDisplayCustomizations,
                    ...feedbackCustomizations,
                    ...navigationCustomizations,
                    ...surfacesCustomizations,
                    ...themeComponents,
                },
            });
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );

}
