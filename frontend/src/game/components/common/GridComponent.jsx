import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../styles/GridComponent.css';

const GridComponent = ({ keyPressed }) => {
    const [grid, setGrid] = useState(Array(6).fill('').map(() => Array(5).fill('')));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (keyPressed) {
            handleKeyPress(keyPressed);
        }
    }, [keyPressed]);

    const handleKeyPress = (key) => {
        setError('');
        if (key === 'DELETE') {
            if (currentCol > 0) {
                const newGrid = [...grid];
                newGrid[currentRow][currentCol - 1] = '';
                setGrid(newGrid);
                setCurrentCol(currentCol - 1);
            }
        } else if (key === 'ENTER') {
            if (currentCol === 5) {
                setCurrentRow(currentRow + 1);
                setCurrentCol(0);
            } else {
                setError('Only 5 letter words are allowed');
                setTimeout(() => setError(''), 2000);
            }
        } else if (/^[A-Z]$/.test(key)) {
            if (currentCol < 5) {
                const newGrid = [...grid];
                newGrid[currentRow][currentCol] = key;
                setGrid(newGrid);
                setCurrentCol(currentCol + 1);
            }
        }
    };

    return (
        <div>
            {error && <div className="error">{error}</div>}
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                        {row.map((cell, colIndex) => (
                            <div key={colIndex} className="grid-cell">
                                {cell}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

GridComponent.propTypes = {
    keyPressed: PropTypes.string.isRequired
};

export default GridComponent;