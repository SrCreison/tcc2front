import { getSymbolEmoji } from '../config';
import type { Grid } from '../types';

interface SlotGridProps {
    grid: Grid;
    spinning?: boolean;
}

export function SlotGrid({ grid, spinning = false }: SlotGridProps) {
    return (
        <div className={`slot-grid${spinning ? ' slot-grid--spinning' : ''}`} role="grid" aria-label="Tabuleiro do slot">
            {grid.map((simbolo, i) => (
                <div key={i} className={`slot-cell${simbolo?.venceu ? ' slot-cell--win' : ''}`} role="gridcell">
                    {simbolo ? getSymbolEmoji(simbolo.name) : ''}
                </div>
            ))}
        </div>
    );
}
