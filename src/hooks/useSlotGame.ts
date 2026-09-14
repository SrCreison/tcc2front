import { useCallback, useState } from 'react';
import { playRound } from '../api';
import {
    BONUS_INTRO_PAUSE_MS,
    BONUS_SPIN_PAUSE_MS,
    CASCADE_NEUTRAL_PAUSE_MS,
    CASCADE_WIN_PAUSE_MS,
    GRID_SIZE,
    getSymbolEmoji,
} from '../config';
import type { BonusRound, CascadeStep, Grid, SpinResponse, TumbleWin } from '../types';

function createEmptyGrid(): Grid {
    return new Array(GRID_SIZE).fill(null) as unknown as Grid;
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Toda a lógica de estado e animação do jogo vivia dentro do componente
 * App.tsx. Extrair para um hook separa "como o jogo funciona" de "como a
 * tela é desenhada" — App.tsx agora só compõe componentes visuais, e essa
 * lógica pode ser testada ou reaproveitada sem precisar renderizar nada.
 */
export function useSlotGame() {
    const [loading, setLoading] = useState(false);
    const [grid, setGrid] = useState<Grid>(createEmptyGrid());
    const [info, setInfo] = useState<SpinResponse | null>(null);
    const [status, setStatus] = useState('Aguardando jogada...');
    const [tumbleWins, setTumbleWins] = useState<TumbleWin[]>([]);
    const [bonusSpinLabel, setBonusSpinLabel] = useState<string | null>(null);

    const animarCascatas = useCallback(async (historico: CascadeStep[]) => {
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
                setStatus(`💥 Vitória! +R$ ${etapa.resultado.premioCascata.toFixed(2)}`);
                await wait(CASCADE_WIN_PAUSE_MS);
            } else {
                await wait(CASCADE_NEUTRAL_PAUSE_MS);
            }
        }
    }, []);

    const animarBonus = useCallback(async (dadosBonus: BonusRound) => {
        setBonusSpinLabel('Modo bônus ativado!');
        setStatus('🔥 Modo bônus ativado!');
        await wait(BONUS_INTRO_PAUSE_MS);

        for (const giro of dadosBonus.giros) {
            setGrid(giro.grid);
            const label = `Bônus: giro ${giro.giro}/${dadosBonus.quantidadeGiros}`;
            setBonusSpinLabel(label);
            setStatus(`🎁 ${label} · Ganho: R$ ${giro.premio.toFixed(2)}`);
            await wait(BONUS_SPIN_PAUSE_MS);
        }

        setBonusSpinLabel(null);
    }, []);

    const girar = useCallback(
        async (comprarBonus: boolean = false) => {
            if (loading) return;

            setLoading(true);
            setInfo(null);
            setTumbleWins([]);
            setStatus(comprarBonus ? 'Comprando bônus...' : 'Misturando poções...');

            try {
                const dados = await playRound('User', comprarBonus);

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
                setStatus(erro instanceof Error ? erro.message : 'Erro na API.');
            } finally {
                setLoading(false);
            }
        },
        [loading, animarCascatas, animarBonus],
    );

    return { loading, grid, info, status, tumbleWins, bonusSpinLabel, girar };
}
