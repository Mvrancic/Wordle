import React, { useState, useEffect } from 'react';
import ClassicKeyboardComponent from '../../components/common/ClassicKeyboardComponent';
import GridComponent from '../../components/common/GridComponent.jsx';

const ClassicModePage = () => {
    const [key, setKey] = useState('');

    const handleKeyPress = (key) => {
        setKey(key);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toUpperCase();
            if (/^[A-Z]$/.test(key) || key === 'ENTER' || key === 'BACKSPACE') {
                handleKeyPress(key === 'BACKSPACE' ? 'DELETE' : key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div>
            <GridComponent keyPressed={key} />
            <ClassicKeyboardComponent onKeyPress={handleKeyPress} />
        </div>
    );
};

export default ClassicModePage;