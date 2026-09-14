import { useSlotGame } from './hooks/useSlotGame';
import { SlotGrid } from './components/SlotGrid';
import { SidePanel } from './components/SidePanel';
import { ResultSummary } from './components/ResultSummary';
import { BET_AMOUNT, BONUS_BUY_COST_MULTIPLIER } from './config';
import './App.css';

function App() {
    const { loading, grid, info, status, tumbleWins, girar } = useSlotGame();
    const bonusCost = BET_AMOUNT * BONUS_BUY_COST_MULTIPLIER;

    return (
        <div className="game-container">
            <h1 className="title">🧪 Alquimia Slot</h1>

            <div className="game-board">
                <SidePanel wins={tumbleWins} />
                <SlotGrid grid={grid} />
            </div>

            <div className="ui-panel">
                <p className="status-line">{status}</p>

                <div className="button-row">
                    <button className="btn btn--normal" onClick={() => girar(false)} disabled={loading}>
                        {loading ? '...' : `Jogar R$ ${BET_AMOUNT.toFixed(2)}`}
                    </button>
                    <button className="btn btn--bonus" onClick={() => girar(true)} disabled={loading}>
                        Bônus R$ {bonusCost.toFixed(2)}
                    </button>
                </div>
            </div>

            {info && <ResultSummary info={info} />}
        </div>
    );
}

export default App;
