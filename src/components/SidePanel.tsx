import type { TumbleWin } from '../types';

interface SidePanelProps {
    wins: TumbleWin[];
}

export function SidePanel({ wins }: SidePanelProps) {
    return (
        <div className="side-panel">
            <h4 className="side-panel__title">Pagamentos</h4>
            <div className="side-panel__list">
                {wins.length === 0 && <p className="side-panel__empty">Aguardando...</p>}
                {wins.map((win, idx) => (
                    <div key={idx} className="win-row">
                        <span className="win-row__emoji">{win.emoji}</span>
                        <div className="win-row__details">
                            <div className="win-row__count">{win.quantidade}x</div>
                            <div className="win-row__value">R$ {win.valor.toFixed(2)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
