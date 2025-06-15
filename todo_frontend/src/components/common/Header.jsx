import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, useMediaQuery } from '@mui/material';
import { LogoutOutlined, PersonOutline, MenuOutlined } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <AppBar position="fixed" className="app-header" elevation={0}>
            <Toolbar className="header-toolbar">
                {isMobile && (<IconButton onClick={onMenuToggle} className="menu-toggle"><MenuOutlined /></IconButton>)}
                <Box className="header-logo">
                    <img src="/shinytodo_icon.svg" alt="ShinyTodo" className="header-icon"/>
                    <Typography variant="h6" className="header-title">ShinyTODO</Typography>
                </Box>
                <Box className="header-user">
                    <Avatar className="header-avatar"><PersonOutline /></Avatar>
                    {!isMobile && (<Typography variant="body2" className="header-username">{user?.first_name}</Typography>)}
                    <IconButton onClick={logout} className="header-logout"><LogoutOutlined /></IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;