import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from "./App";
import './index.css'
import { ThemeProvider } from './ctx/ThemeCtx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ThemeProvider >
            <App />
        </ThemeProvider>
    </BrowserRouter>
);
