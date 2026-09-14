import { Route, Routes } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { ProvablyFairPage } from './pages/ProvablyFairPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DisclaimerBadge } from './components/DisclaimerBadge';
import './App.css';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<GamePage />} />
                <Route path="/provably-fair" element={<ProvablyFairPage />} />
                <Route path="/como-funciona" element={<HowItWorksPage />} />
            </Routes>
            <DisclaimerBadge />
        </>
    );
}

export default App;
