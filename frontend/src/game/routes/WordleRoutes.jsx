import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/HomePage.jsx';
import Classic from '../pages/gamemodes/ClassicModePage.jsx';


const WordleRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classic" element={<Classic />} />
    </Routes>
  );
};

export default WordleRoutes;