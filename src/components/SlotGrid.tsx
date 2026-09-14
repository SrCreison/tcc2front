import { getSymbolEmoji } from '../config';
import type { Grid } from '../types';

interface SlotGridProps {
    grid: Grid;
}

export function SlotGrid({ grid }: SlotGridProps) {
    return (
        <div className="slot-grid" role="grid" aria-label="Tabuleiro do slot">
            {grid.map((simbolo, i) => (
                <div key={i} className={`slot-cell${simbolo?.venceu ? ' slot-cell--win' : ''}`} role="gridcell">
                    {simbolo ? getSymbolEmoji(simbolo.name) : ''}
                </div>
            ))}
        </div>
    );
}
