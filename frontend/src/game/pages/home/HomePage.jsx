import React from 'react';
import GameModeCard from '../../components/cards/GameModeCard.jsx';
import '../../../styles/HomePage.css';
import {Typography} from "@mui/material";

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="subtitle">
                <Typography variant="h4" style={{textTransform: 'uppercase'}}>Select a game mode</Typography>
            </div>
            <div className="game-modes">
                <GameModeCard name="Classic Mode" path="/classic" />
                <GameModeCard name="Hard Mode" path="/hard" />
                <GameModeCard name="Languages" path="/languages" />
                <GameModeCard name="Time Race" path="/time-race" />
                <GameModeCard name="Accent Mark" path="/accent-mark" />
            </div>
        </div>
    );
};

export default HomePage;
