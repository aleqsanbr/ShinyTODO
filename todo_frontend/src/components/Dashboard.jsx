import { useState } from 'react';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { TaskProvider } from '../contexts/TaskContext';
import Header from './common/Header';
import CategorySidebar from './categories/CategorySidebar';
import TaskList from './tasks/TaskList';
import Search from './tasks/Search';

const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:768px)');
    const drawerWidth = 280;

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
        <TaskProvider>
            <Box className="dashboard">
                <Header onMenuToggle={handleDrawerToggle} />

                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{keepMounted: true, sx: {zIndex: 1250}}}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            mt: isMobile ? '64px' : '64px',
                            height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 64px)',
                            borderRight: '1px solid #e5e7eb',
                            zIndex: 1250
                        }
                    }}
                >
                    <CategorySidebar />
                </Drawer>

                <Box component="main" className="main-content">
                    <Box className="content-wrapper">
                        <Box className="content-header">
                            <Search />
                        </Box>
                        <TaskList />
                    </Box>
                </Box>
            </Box>
        </TaskProvider>
    );
};

export default Dashboard;