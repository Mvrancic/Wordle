import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/Keyboard.css';

const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
];

const ClassicKeyboardComponent = ({ onKeyPress }) => {
    return (
        <div className="keyboard">
            {keys.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map((key) => (
                        <button
                            key={key}
                            className="keyboard-key"
                            onClick={() => onKeyPress(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

ClassicKeyboardComponent.propTypes = {
    onKeyPress: PropTypes.func.isRequired
};

export default ClassicKeyboardComponent;