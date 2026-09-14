import { Route, Routes } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { ProvablyFairPage } from './pages/ProvablyFairPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/provably-fair" element={<ProvablyFairPage />} />
            <Route path="/como-funciona" element={<HowItWorksPage />} />
        </Routes>
    );
}

export default App;
