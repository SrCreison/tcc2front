/**
 * Tipos do front-end.
 *
 * Antes, App.tsx usava `any` em praticamente todo lugar (grid, info,
 * histórico, vitórias...). Isso funciona, mas esconde erros bobos --
 * por exemplo, o código lia `v.premio || v.valor`, um "ajuste" para
 * cobrir uma incerteza sobre qual nome de campo o back mandava. Com os
 * tipos abaixo (que espelham exatamente o que server.ts devolve), esse
 * tipo de ambiguidade fica visível em tempo de compilação, não em produção.
 */

export interface GridSymbol {
    id: number;
    name: string;
    weight: number;
    valorMultiplicador?: number;
    /** true quando este símbolo fez parte de uma combinação vencedora nesta cascata. */
    venceu?: boolean;
}

export type Grid = GridSymbol[];

export interface WinningCombination {
    simbolo: string;
    quantidade: number;
    premio: number;
    posicoes: number[];
}

export interface CascadeResult {
    teveVitoria: boolean;
    combinacoesVencedoras: WinningCombination[];
    posicoesParaExplodir: number[];
    premioCascata: number;
}

export interface CascadeStep {
    cascata: number;
    hashUtilizado: string;
    grid: Grid;
    resultado: CascadeResult;
}

export interface BonusSpin {
    giro: number;
    nonceUtilizado: number;
    scattersNaTela: number;
    multiplicadorFinal: number;
    premio: number;
    grid: Grid;
}

export interface BonusRound {
    quantidadeGiros: number;
    premioTotalBonus: number;
    giros: BonusSpin[];
}

export interface SpinResponse {
    id: string;
    mensagem: string;
    auditoria: {
        serverSeed: string;
        clientSeed: string;
        nonceInicial: number;
    };
    resumoFinanceiro: {
        valorApostado: number;
        premioTotalDaSessao: number;
        lucroSessao: number;
    };
    roteiroDoJogo: {
        jogoBase: {
            scattersEncontrados: number;
            ativouGirosGratis: boolean;
            premioRodada: number;
            historicoRodada: CascadeStep[];
        };
        jogoBonus: BonusRound | null;
    };
}

export interface ApiErrorResponse {
    erro: string;
}

/** Uma linha exibida no painel lateral de prêmios ganhos na rodada. */
export interface TumbleWin {
    name: string;
    emoji: string;
    quantidade: number;
    valor: number;
}
