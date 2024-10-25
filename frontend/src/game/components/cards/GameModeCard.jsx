import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/GameModeCard.css';

const GameModeCard = ({ path, name }) => {
    return (
        <Link to={path} className="game-mode-card">
            <h3>{name}</h3>
        </Link>
    );
};

export default GameModeCard;
