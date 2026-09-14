import { GAME_PROFILE_DESCRIPTIONS, GAME_PROFILE_LABELS, MAX_BET_AMOUNT, MIN_BET_AMOUNT } from '../config';
import type { GameProfile } from '../types';

interface GameControlsProps {
    betAmount: number;
    onBetAmountChange: (value: number) => void;
    profile: GameProfile;
    onProfileChange: (profile: GameProfile) => void;
    disabled: boolean;
}

export function GameControls({ betAmount, onBetAmountChange, profile, onProfileChange, disabled }: GameControlsProps) {
    return (
        <div className="game-controls">
            <label className="game-controls__field">
                <span>Valor da aposta (R$)</span>
                <input
                    type="number"
                    min={MIN_BET_AMOUNT}
                    max={MAX_BET_AMOUNT}
                    step={0.5}
                    value={betAmount}
                    disabled={disabled}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (Number.isFinite(value)) onBetAmountChange(value);
                    }}
                />
            </label>

            <label className="game-controls__field">
                <span>Perfil de pesos</span>
                <select
                    value={profile}
                    disabled={disabled}
                    onChange={(e) => onProfileChange(e.target.value as GameProfile)}
                >
                    {Object.keys(GAME_PROFILE_LABELS).map((id) => (
                        <option key={id} value={id}>
                            {GAME_PROFILE_LABELS[id]}
                        </option>
                    ))}
                </select>
            </label>

            <p className="game-controls__hint">{GAME_PROFILE_DESCRIPTIONS[profile]}</p>
        </div>
    );
}
