import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {StyledEngineProvider} from '@mui/material/styles';
import AppTheme from './AppTheme.tsx';
import App from './App.tsx';
import ErrorBoundary from "./helpers/ErrorBoundary.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <StyledEngineProvider injectFirst>
                    <AppTheme>
                        <App/>
                    </AppTheme>
                </StyledEngineProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
