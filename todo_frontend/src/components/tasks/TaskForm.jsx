import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTasks } from '../../contexts/TaskContext';

const TaskForm = ({ open, onClose, editTask = null }) => {
    const { createTask, updateTask, categories } = useTasks();
    const [formData, setFormData] = useState({title: '', description: '', category_id: '', due_date: ''});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editTask) {
            setFormData({
                title: editTask.title || '',
                description: editTask.description || '',
                category_id: editTask.category?.id || '',
                due_date: editTask.due_date ? editTask.due_date.split('T')[0] : ''
            });
        } else {
            setFormData({ title: '', description: '', category_id: '', due_date: '' });
        }
    }, [editTask, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = editTask ? await updateTask(editTask.id, formData) : await createTask(formData);

        setLoading(false);
        if (result.success) {
            onClose();
            setFormData({ title: '', description: '', category_id: '', due_date: '' });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="task-dialog">
            <DialogTitle>{editTask ? 'Редактировать задачу' : 'Новая задача'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent className="task-form-content">
                    <TextField fullWidth label="Название" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="form-field"/>
                    <TextField fullWidth multiline rows={3} label="Описание" value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-field"
                    />
                    <FormControl fullWidth className="form-field">
                        <InputLabel>Категория</InputLabel>
                        <Select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                            <MenuItem value="">Без категории</MenuItem>
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField fullWidth type="date" label="Срок выполнения" value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        InputLabelProps={{ shrink: true }} className="form-field"
                    />
                </DialogContent>
                <DialogActions className="form-actions">
                    <Button onClick={onClose}>Отмена</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Сохранение...' : editTask ? 'Обновить' : 'Создать'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskForm;