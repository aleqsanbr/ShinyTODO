import { useState } from 'react';
import { Box, Typography, Fab, useMediaQuery } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useTasks } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
    const { tasks, filter, categories } = useTasks();
    const [formOpen, setFormOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const isMobile = useMediaQuery('(max-width:768px)');

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.status === 'completed';
        if (filter === 'pending') return task.status !== 'completed';
        return task.category?.id === filter;
    });

    const getFilterTitle = () => {
        if (filter === 'all') return 'Все задачи';
        if (filter === 'completed') return 'Выполненные';
        if (filter === 'pending') return 'Активные';
        const category = categories.find(c => c.id === filter);
        return category ? category.name : 'Задачи';
    };

    const handleEdit = (task) => {
        setEditTask(task);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditTask(null);
    };

    return (
        <Box className="task-list-container">
            <Box className="task-list-header">
                <Typography variant="h5" className="list-title">
                    {getFilterTitle()}
                </Typography>
                <Typography variant="body2" className="list-count">
                    {filteredTasks.length} шт.
                </Typography>
            </Box>

            <Box className="task-list">
                {filteredTasks.length === 0 ? (
                    <Box className="empty-state">
                        <Typography variant="h6" color="textSecondary">
                            Задач пока нет
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Создайте первую задачу
                        </Typography>
                    </Box>
                ) : (
                    filteredTasks.map(task => (
                        <TaskItem key={task.id} task={task} onEdit={handleEdit} />
                    ))
                )}
            </Box>

            <Fab color="primary" className="add-task-fab" onClick={() => setFormOpen(true)}>
                <AddOutlined />
            </Fab>

            <TaskForm open={formOpen} onClose={handleCloseForm} editTask={editTask} />
        </Box>
    );
};

export default TaskList;