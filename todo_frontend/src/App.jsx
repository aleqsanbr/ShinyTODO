import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import './styles/Auth.scss';
import './styles/Dashboard.scss';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#6366f1' },
        secondary: { main: '#8b5cf6' },
        background: { default: '#fafafa', paper: '#ffffff' },
        text: { primary: '#1f2937', secondary: '#6b7280' }
    },
    typography: { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', h4: { fontWeight: 600 } },
    shape: { borderRadius: 12 }
});

const AuthWrapper = () => {
    const { user, initialized, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    if (!initialized || loading) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography>Загрузка...</Typography>
            </Box>
        );
    }

    if (user) return <Dashboard />;

    return isLogin ?
        <Login onSwitchToRegister={() => setIsLogin(false)} /> :
        <Register onSwitchToLogin={() => setIsLogin(true)} />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <AuthWrapper />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;