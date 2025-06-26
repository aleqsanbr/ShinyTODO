import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from '@mui/material';
import { useTasks } from '../../contexts/TaskContext';

const PRESET_COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#8b5a2b', // Brown
    '#6b7280', // Gray
    '#84cc16', // Lime
];

const CategoryForm = ({ open, onClose, editCategory = null }) => {
    const { createCategory, updateCategory } = useTasks();
    const [formData, setFormData] = useState({
        name: '',
        color: PRESET_COLORS[0],
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editCategory) {
            setFormData({
                name: editCategory.name || '',
                color: editCategory.color || PRESET_COLORS[0],
                description: editCategory.description || ''
            });
        } else {
            setFormData({
                name: '',
                color: PRESET_COLORS[0],
                description: ''
            });
        }
    }, [editCategory, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = editCategory ? await updateCategory(editCategory.id, formData) : await createCategory(formData);

        setLoading(false);
        if (result.success) {
            onClose();
            setFormData({ name: '', color: PRESET_COLORS[0], description: '' });
        }
    };

    const handleColorSelect = (color) => {
        setFormData({ ...formData, color });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="category-dialog">
            <DialogTitle>
                {editCategory ? 'Редактировать категорию' : 'Новая категория'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent className="category-form-content">
                    <TextField fullWidth label="Название категории" value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required className="form-field" autoFocus
                    />

                    <TextField fullWidth multiline rows={2} label="Описание (необязательно)" value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-field"
                    />

                    <Box className="category-color-section">
                        <Typography variant="subtitle2" className="section-title">Выберите цвет</Typography>
                        <Box className="color-grid">
                            {PRESET_COLORS.map((color) => (
                                <Box key={color} onClick={() => handleColorSelect(color)}
                                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </Box>

                        <Box className="color-preview">
                            <Box className="preview-circle" style={{ backgroundColor: formData.color }}/>
                            <Typography variant="body2" className="preview-text">{formData.color}</Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions className="form-actions">
                    <Button onClick={onClose}>Отмена</Button>
                    <Button type="submit" variant="contained" disabled={loading || !formData.name.trim()}>
                        {loading ? 'Сохранение...' : editCategory ? 'Обновить' : 'Создать'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CategoryForm;