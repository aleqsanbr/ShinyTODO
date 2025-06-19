import { Box, Card, Typography, Checkbox, IconButton, Chip } from '@mui/material';
import { EditOutlined, DeleteOutlined, CalendarTodayOutlined } from '@mui/icons-material';
import { useTasks } from '../../contexts/TaskContext';

const TaskItem = ({ task, onEdit }) => {
    const { toggleTask, deleteTask } = useTasks();

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

    return (
        <Card className={`task-item ${task.status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
            <Box className="task-content">
                <Checkbox checked={task.status === 'completed'} onChange={() => toggleTask(task.id)} className="task-checkbox"/>
                <Box className="task-info">
                    <Typography variant="h6" className={`task-title ${task.status === 'completed' ? 'strikethrough' : ''}`}>
                        {task.title}
                    </Typography>
                    {task.description && (
                        <Typography variant="body2" className="task-description">{task.description}</Typography>
                    )}
                    <Box className="task-meta">
                        {task.category && (
                            <Chip label={task.category.name} size="small" style={{backgroundColor: task.category.color + '20', color: task.category.color}}
                            />
                        )}
                        {task.due_date && (
                            <Box className="task-date">
                                <CalendarTodayOutlined fontSize="small" />
                                <Typography variant="caption">
                                    {formatDate(task.due_date)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box className="task-actions">
                    <IconButton onClick={() => onEdit(task)} size="small">
                        <EditOutlined />
                    </IconButton>
                    <IconButton onClick={() => deleteTask(task.id)} size="small" color="error">
                        <DeleteOutlined />
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
};

export default TaskItem;