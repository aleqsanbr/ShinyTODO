import { useState } from 'react';
import { Box, List, ListItem, ListItemText, Chip, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { AddOutlined, FolderOutlined, MoreVertOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import { useTasks } from '../../contexts/TaskContext';
import CategoryForm from './CategoryForm';

const CategorySidebar = () => {
    const { categories, filter, dispatch, tasks, deleteCategory } = useTasks();
    const [formOpen, setFormOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const getTaskCount = (categoryId) => {
        return tasks.filter(task => task.category?.id === categoryId).length;
    };

    const setFilter = (newFilter) => dispatch({ type: 'SET_FILTER', payload: newFilter });

    const handleCreateCategory = () => {
        setEditCategory(null);
        setFormOpen(true);
    };

    const handleEditCategory = (category) => {
        setEditCategory(category);
        setFormOpen(true);
        setAnchorEl(null);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Удалить категорию? Задачи останутся, но будут без категории.')) {
            await deleteCategory(categoryId);
        }
        setAnchorEl(null);
    };

    const handleMenuOpen = (event, category) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedCategory(category);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCategory(null);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setEditCategory(null);
    };

    return (
        <Box className="category-sidebar">
            <Box className="sidebar-header">
                <Typography variant="h6">Категории</Typography>
                <IconButton size="small" onClick={handleCreateCategory} title="Создать категорию">
                    <AddOutlined />
                </IconButton>
            </Box>

            <List className="category-list">
                <ListItem button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
                    <FolderOutlined className="category-icon" />
                    <ListItemText primary="Все задачи" />
                    <Chip label={tasks.length} size="small" />
                </ListItem>

                {categories.map(category => (
                    <ListItem key={category.id} button onClick={() => setFilter(category.id)} className={filter === category.id ? 'active' : ''}>
                        <Box className="category-item-content">
                            <Box className="category-color" style={{ backgroundColor: category.color }} />
                            <ListItemText primary={category.name} secondary={category.description}/>
                            <Chip label={getTaskCount(category.id)} size="small" />
                        </Box>

                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, category)} className="category-item-actions">
                            <MoreVertOutlined fontSize="small" />
                        </IconButton>
                    </ListItem>
                ))}

                {categories.length === 0 && (
                    <Box className="category-empty-state">
                        <Typography variant="body2">Нет категорий</Typography>
                        <Typography variant="caption">Создайте первую категорию</Typography>
                    </Box>
                )}
            </List>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} className="category-menu">
                <MenuItem onClick={() => handleEditCategory(selectedCategory)}>
                    <EditOutlined fontSize="small" />
                    Редактировать
                </MenuItem>
                <MenuItem onClick={() => handleDeleteCategory(selectedCategory?.id)} className="menu-item-delete">
                    <DeleteOutlined fontSize="small" />
                    Удалить
                </MenuItem>
            </Menu>

            <CategoryForm open={formOpen} onClose={handleFormClose} editCategory={editCategory}/>
        </Box>
    );
};

export default CategorySidebar;