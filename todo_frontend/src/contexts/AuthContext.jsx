import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload.user, token: action.payload.token, loading: false, initialized: true };
        case 'LOGOUT':
            return { ...state, user: null, token: null, loading: false, initialized: true };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'INIT_COMPLETE':
            return { ...state, initialized: true, loading: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        initialized: false
    });

    // Проверяем токен при загрузке приложения
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    dispatch({ type: 'SET_LOADING', payload: true });
                    const response = await authAPI.me();
                    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data, token } });
                } catch (error) {
                    console.log('Token invalid, removing...');
                    localStorage.removeItem('token');
                    dispatch({ type: 'INIT_COMPLETE' });
                }
            } else {
                dispatch({ type: 'INIT_COMPLETE' });
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await authAPI.login(email, password);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_LOADING', payload: false });
            return { success: false, error: error.response?.data?.errors || 'Login failed' };
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await authAPI.register(userData);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_LOADING', payload: false });
            return { success: false, error: error.response?.data?.errors || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};