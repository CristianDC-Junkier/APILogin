import React from 'react';
import './styles/Global.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import AppRouter from './router/AppRouter';

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppRouter />
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
