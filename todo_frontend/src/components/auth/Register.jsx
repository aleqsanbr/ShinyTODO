import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({email: '', password: '', first_name: '', last_name: ''});
    const [error, setError] = useState('');
    const { register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await register(formData);
        if (!result.success) {
            setError(Array.isArray(result.error) ? result.error.join(', ') : result.error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box className="auth-container">
            <Card className="auth-card">
                <CardContent>
                    <Typography variant="h4" className="auth-title">Создать аккаунт</Typography>
                    <Typography variant="body2" className="auth-subtitle">Заполните данные для регистрации</Typography>

                    {error && <Alert severity="error" className="auth-error">{error}</Alert>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Box className="auth-name-fields">
                            <TextField label="Имя" name="first_name" value={formData.first_name} onChange={handleChange} required className="auth-input-half"/>
                            <TextField label="Фамилия" name="last_name" value={formData.last_name} onChange={handleChange} className="auth-input-half"/>
                        </Box>
                        <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required className="auth-input"/>
                        <TextField fullWidth label="Пароль" name="password" type="password" value={formData.password} onChange={handleChange} required helperText="Минимум 6 символов" className="auth-input"/>
                        <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} className="auth-button">{loading ? 'Регистрация...' : 'Зарегистрироваться'}</Button>
                    </form>

                    <Typography className="auth-switch">
                        Уже есть аккаунт?{' '}
                        <Link onClick={onSwitchToLogin} className="auth-link">Войти</Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;