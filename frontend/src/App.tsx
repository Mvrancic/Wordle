import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Welcome } from './pages/Welcome';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { ClassicGamePage } from './pages/game-modes/classic/ClassicGamePage';
import { NotFound } from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game/classic" element={<ClassicGamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
