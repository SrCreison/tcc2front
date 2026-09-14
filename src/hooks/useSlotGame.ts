import { useCallback, useState } from 'react';
import { playRound } from '../api';
import {
    BET_AMOUNT,
    BONUS_GIRO_SPIN_MS,
    BONUS_INTRO_PAUSE_MS,
    CASCADE_NEUTRAL_PAUSE_MS,
    CASCADE_WIN_PAUSE_MS,
    GRID_SIZE,
    MIN_SPIN_DURATION_MS,
    SPIN_FRAME_MS,
    SPIN_PLACEHOLDER_SYMBOLS,
    getSymbolEmoji,
} from '../config';
import type { BonusRound, CascadeStep, GameProfile, Grid, SpinResponse, TumbleWin } from '../types';

function createEmptyGrid(): Grid {
    return new Array(GRID_SIZE).fill(null) as unknown as Grid;
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Grid "de mentira", só para o efeito visual do giro (ver config.ts). */
function randomPlaceholderGrid(): Grid {
    return Array.from({ length: GRID_SIZE }, (_, i) => {
        const name = SPIN_PLACEHOLDER_SYMBOLS[Math.floor(Math.random() * SPIN_PLACEHOLDER_SYMBOLS.length)];
        return { id: i, name, weight: 0 };
    });
}

/**
 * Toda a lógica de estado e animação do jogo vivia dentro do componente
 * App.tsx. Extrair para um hook separa "como o jogo funciona" de "como a
 * tela é desenhada" — a página do jogo agora só compõe componentes
 * visuais, e essa lógica pode ser testada ou reaproveitada sem precisar
 * renderizar nada.
 */
export function useSlotGame() {
    const [loading, setLoading] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [grid, setGrid] = useState<Grid>(createEmptyGrid());
    const [info, setInfo] = useState<SpinResponse | null>(null);
    const [status, setStatus] = useState('Aguardando jogada...');
    const [tumbleWins, setTumbleWins] = useState<TumbleWin[]>([]);
    const [bonusSpinLabel, setBonusSpinLabel] = useState<string | null>(null);
    const [betAmount, setBetAmount] = useState(BET_AMOUNT);
    const [profile, setProfile] = useState<GameProfile>('normal');

    /**
     * Roda o efeito cosmético de "rolos girando" por pelo menos
     * `minDurationMs`, mas continua além disso se `waitFor` (normalmente a
     * chamada de rede) ainda não tiver terminado — assim a animação nunca
     * "acaba" antes de o resultado real estar disponível, mesmo numa
     * conexão lenta.
     */
    const spinWhile = useCallback(async <T,>(waitFor: Promise<T>, minDurationMs: number): Promise<T> => {
        let done = false;
        const guardedWait = waitFor.finally(() => {
            done = true;
        });

        const visualLoop = (async () => {
            const start = Date.now();
            while (!done || Date.now() - start < minDurationMs) {
                setGrid(randomPlaceholderGrid());
                await wait(SPIN_FRAME_MS);
            }
        })();

        const [result] = await Promise.all([guardedWait, visualLoop]);
        return result;
    }, []);

    const animarCascatas = useCallback(async (historico: CascadeStep[], statusPrefix: string = '') => {
        let vitoriasAcumuladas: TumbleWin[] = [];

        for (const etapa of historico) {
            setGrid(etapa.grid);

            if (etapa.resultado.teveVitoria) {
                const novasVitorias: TumbleWin[] = etapa.resultado.combinacoesVencedoras.map((v) => ({
                    name: v.simbolo,
                    emoji: getSymbolEmoji(v.simbolo),
                    quantidade: v.quantidade,
                    valor: v.premio,
                }));

                vitoriasAcumuladas = [...novasVitorias, ...vitoriasAcumuladas];
                setTumbleWins(vitoriasAcumuladas);
                setStatus(`${statusPrefix}💥 Vitória! +R$ ${etapa.resultado.premioCascata.toFixed(2)}`);
                await wait(CASCADE_WIN_PAUSE_MS);
            } else {
                await wait(CASCADE_NEUTRAL_PAUSE_MS);
            }
        }
    }, []);

    const animarBonus = useCallback(
        async (dadosBonus: BonusRound) => {
            setBonusSpinLabel('Modo bônus ativado!');
            setStatus('🔥 Modo bônus ativado!');
            await wait(BONUS_INTRO_PAUSE_MS);

            for (const giro of dadosBonus.giros) {
                const label = `Bônus: giro ${giro.giro}/${dadosBonus.quantidadeGiros}`;
                setBonusSpinLabel(label);
                setStatus(`🎰 ${label}...`);

                // Giro cosmético entre um giro do bônus e o outro — sem
                // isso, os 10 giros do bônus só trocavam de figura de
                // uma vez, sem nenhuma sensação de "rodar".
                setSpinning(true);
                await spinWhile(wait(0), BONUS_GIRO_SPIN_MS);
                setSpinning(false);

                // Reaproveita a MESMA animação de cascata do jogo base:
                // o backend agora manda o histórico completo de cada giro
                // do bônus, não só o grid final, então dá pra animar a
                // vitória igual à rodada base.
                await animarCascatas(giro.historico, `${label} · `);

                setStatus(`${label} · Ganho: R$ ${giro.premio.toFixed(2)}`);
                await wait(300);
            }

            setBonusSpinLabel(null);
        },
        [animarCascatas, spinWhile],
    );

    const girar = useCallback(
        async (comprarBonus: boolean = false) => {
            if (loading) return;

            setLoading(true);
            setSpinning(true);
            setInfo(null);
            setTumbleWins([]);
            setBonusSpinLabel(null);
            setStatus(comprarBonus ? 'Comprando bônus...' : 'Girando...');

            try {
                const dados = await spinWhile(playRound('User', comprarBonus, betAmount, profile), MIN_SPIN_DURATION_MS);
                setSpinning(false);

                const historicoRodada = dados.roteiroDoJogo?.jogoBase?.historicoRodada;
                if (historicoRodada) {
                    await animarCascatas(historicoRodada);
                }

                const jogoBonus = dados.roteiroDoJogo?.jogoBonus;
                if (jogoBonus) {
                    await animarBonus(jogoBonus);
                }

                setInfo(dados);
                setStatus(dados.mensagem);
            } catch (erro) {
                console.error('Erro no giro:', erro);
                setSpinning(false);
                setStatus(erro instanceof Error ? erro.message : 'Erro na API.');
            } finally {
                setLoading(false);
            }
        },
        [loading, betAmount, profile, animarCascatas, animarBonus, spinWhile],
    );

    return {
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
    };
}
