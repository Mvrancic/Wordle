import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BarChartIcon from '@mui/icons-material/BarChart';

const TopAppBar = () => {
    return (
        <AppBar
            position="fixed"
            style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                padding: '10px',
                maxWidth: '800px',
                left: '50%',
                transform: 'translateX(-50%)',
                right: 'auto',
                borderBottom: '1px solid #767AFBFF',
            }}
        >
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="help">
                    <HelpOutlineIcon />
                </IconButton>
                <Typography variant="h3"
                            component="div"
                            style={{ textAlign: 'center', flexGrow: 1, textTransform: 'uppercase'}}
                >
                    Wordle Game
                </Typography>
                <IconButton edge="end" color="inherit" aria-label="stats">
                    <BarChartIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopAppBar;
