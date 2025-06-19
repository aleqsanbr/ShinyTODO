import { TextField, InputAdornment } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { useTasks } from '../../contexts/TaskContext';

const Search = () => {
    const { searchQuery, searchTasks } = useTasks();

    return (
        <TextField
            fullWidth placeholder="Поиск задач..." value={searchQuery}
            onChange={(e) => searchTasks(e.target.value)} className="search-input"
            InputProps={{startAdornment: (<InputAdornment position="start"><SearchOutlined /></InputAdornment>)}}
        />
    );
};

export default Search;