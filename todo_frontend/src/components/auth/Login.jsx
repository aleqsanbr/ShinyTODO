import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(formData.email, formData.password);
        if (!result.success) {
            setError(result.error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box className="auth-container">
            <Card className="auth-card">
                <CardContent>
                    <Typography variant="h4" className="auth-title">Добро пожаловать</Typography>
                    <Typography variant="body2" className="auth-subtitle">Войдите в свой аккаунт</Typography>

                    {error && <Alert severity="error" className="auth-error">{error}</Alert>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required className="auth-input"/>
                        <TextField fullWidth label="Пароль" name="password" type="password" value={formData.password} onChange={handleChange} required className="auth-input"/>
                        <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} className="auth-button">{loading ? 'Вход...' : 'Войти'}</Button>
                    </form>

                    <Typography className="auth-switch">
                        Нет аккаунта?{' '}
                        <Link onClick={onSwitchToRegister} className="auth-link">
                            Зарегистрироваться
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;