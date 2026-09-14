import { useSlotGame } from '../hooks/useSlotGame';
import { SlotGrid } from '../components/SlotGrid';
import { SidePanel } from '../components/SidePanel';
import { ResultSummary } from '../components/ResultSummary';
import { GameControls } from '../components/GameControls';
import { AuditPanel } from '../components/AuditPanel';
import { SiteNav } from '../components/SiteNav';
import { BONUS_BUY_COST_MULTIPLIER } from '../config';

export function GamePage() {
    const {
        loading,
        spinning,
        grid,
        info,
        status,
        tumbleWins,
        bonusSpinLabel,
        betAmount,
        setBetAmount,
        profile,
        setProfile,
        girar,
    } = useSlotGame();
    const bonusCost = betAmount * BONUS_BUY_COST_MULTIPLIER;

    return (
        <div className="game-container">
            <h1 className="title">🧪 Alquimia Slot</h1>
            <SiteNav />

            <GameControls
                betAmount={betAmount}
                onBetAmountChange={setBetAmount}
                profile={profile}
                onProfileChange={setProfile}
                disabled={loading}
            />

            <div className="game-board">
                <SidePanel wins={tumbleWins} />
                <div className="board-column">
                    {bonusSpinLabel && <div className="bonus-badge">{bonusSpinLabel}</div>}
                    <SlotGrid grid={grid} spinning={spinning} />
                </div>
            </div>

            <div className="ui-panel">
                <p className="status-line">{status}</p>

                <div className="button-row">
                    <button className="btn btn--normal" onClick={() => girar(false)} disabled={loading}>
                        {loading ? '...' : `Jogar R$ ${betAmount.toFixed(2)}`}
                    </button>
                    <button className="btn btn--bonus" onClick={() => girar(true)} disabled={loading}>
                        Bônus R$ {bonusCost.toFixed(2)}
                    </button>
                </div>
            </div>

            {info && <ResultSummary info={info} />}
            {info && <AuditPanel info={info} />}
        </div>
    );
}
