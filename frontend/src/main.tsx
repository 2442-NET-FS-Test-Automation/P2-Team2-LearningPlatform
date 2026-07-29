import React from 'react';
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './ctx/ThemeCtx';
import { AuthProvider } from './ctx/AuthCtx';
import App from "./App";
import './index.css'

const router = createBrowserRouter([{ path: "*", element: <App /> }]);

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider >
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);
