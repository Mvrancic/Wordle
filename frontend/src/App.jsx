import React from 'react';
import WordleRoutes from './game/routes/WordleRoutes';
import TopAppBar from './game/components/common/TopAppBar';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <Router>
                <TopAppBar />
                <WordleRoutes />
            </Router>
        </div>
    );
};

export default App;
