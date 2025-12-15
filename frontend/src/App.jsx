import React from 'react';
import './styles/Global.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import AppRouter from './router/AppRouter';

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
