import { createContext, useContext, useReducer, useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../services/api';

const TaskContext = createContext();

const taskReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS': return { ...state, tasks: action.payload };
        case 'SET_CATEGORIES': return { ...state, categories: action.payload };
        case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
        case 'UPDATE_TASK': return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
        case 'DELETE_TASK': return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
        case 'ADD_CATEGORY': return { ...state, categories: [...state.categories, action.payload] };
        case 'UPDATE_CATEGORY': return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
        case 'DELETE_CATEGORY': return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
        case 'SET_FILTER': return { ...state, filter: action.payload };
        case 'SET_SEARCH': return { ...state, searchQuery: action.payload };
        case 'SET_LOADING': return { ...state, loading: action.payload };
        default: return state;
    }
};

export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, {
        tasks: [],
        categories: [],
        filter: 'all',
        searchQuery: '',
        loading: false
    });

    const fetchTasks = async () => {
        try {
            const response = await tasksAPI.getAll();
            dispatch({ type: 'SET_TASKS', payload: response.data });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            dispatch({ type: 'SET_CATEGORIES', payload: response.data });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // ===============================
    // ФУНКЦИИ ДЛЯ ЗАДАЧ
    // ===============================
    const createTask = async (taskData) => {
        try {
            const response = await tasksAPI.create(taskData);
            dispatch({ type: 'ADD_TASK', payload: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.errors };
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const response = await tasksAPI.update(id, taskData);
            dispatch({ type: 'UPDATE_TASK', payload: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.errors };
        }
    };

    const deleteTask = async (id) => {
        try {
            await tasksAPI.delete(id);
            dispatch({ type: 'DELETE_TASK', payload: id });
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const toggleTask = async (id) => {
        try {
            const response = await tasksAPI.toggleComplete(id);
            dispatch({ type: 'UPDATE_TASK', payload: response.data });
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const searchTasks = async (query) => {
        try {
            dispatch({ type: 'SET_SEARCH', payload: query });
            if (query.trim()) {
                const response = await tasksAPI.search(query);
                dispatch({ type: 'SET_TASKS', payload: response.data });
            } else {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error searching tasks:', error);
        }
    };

    // ===============================
    // ФУНКЦИИ ДЛЯ КАТЕГОРИЙ
    // ===============================
    const createCategory = async (categoryData) => {
        try {
            const response = await categoriesAPI.create(categoryData);
            dispatch({ type: 'ADD_CATEGORY', payload: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.errors };
        }
    };

    const updateCategory = async (id, categoryData) => {
        try {
            const response = await categoriesAPI.update(id, categoryData);
            dispatch({ type: 'UPDATE_CATEGORY', payload: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.errors };
        }
    };

    const deleteCategory = async (id) => {
        try {
            await categoriesAPI.delete(id);
            dispatch({ type: 'DELETE_CATEGORY', payload: id });

            // Обновляем задачи, убирая связь с удаленной категорией
            fetchTasks();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchCategories();
    }, []);

    return (
        <TaskContext.Provider value={{
            ...state,
            // Функции для задач
            createTask,
            updateTask,
            deleteTask,
            toggleTask,
            searchTasks,
            fetchTasks,
            // Функции для категорий
            createCategory,
            updateCategory,
            deleteCategory,
            fetchCategories,
            // Общие функции
            dispatch
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within TaskProvider');
    return context;
};