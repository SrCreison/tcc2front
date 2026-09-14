/**
 * URL base da API. Antes vinha hardcoded dentro da função de giro
 * (`https://api-play.abraaodaldon.com.br...`), o que obrigava editar o
 * código-fonte pra rodar contra um backend local em desenvolvimento.
 * Agora vem de uma variável de ambiente do Vite, com o domínio de
 * produção como fallback (veja .env.example).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api-play.abraaodaldon.com.br';

export const BET_AMOUNT = 2.0;
export const BONUS_BUY_COST_MULTIPLIER = 100;

export const GRID_COLUMNS = 6;
export const GRID_ROWS = 5;
export const GRID_SIZE = GRID_COLUMNS * GRID_ROWS;

export const SCATTER_SYMBOL_NAME = 'scatter_grimorio';
export const MULTIPLIER_SYMBOL_NAME = 'pedra_filosofal';

/**
 * Emoji exibido para cada símbolo. Removidos `pocao_roxa` e `livro`, que
 * não existem em nenhuma tabela do backend (gameMath.ts) — eram entradas
 * mortas que nunca apareciam em tela.
 */
export const SYMBOL_EMOJI: Record<string, string> = {
    cristal_cinza: '🩶',
    cristal_verde: '💚',
    cristal_azul: '💙',
    cristal_rosa: '💗',
    cristal_amarelo: '💛',
    pocao_verde: '🟢',
    pocao_azul: '🔵',
    pocao_vermelha: '🔴',
    pocao_dourada: '🍾',
    [SCATTER_SYMBOL_NAME]: '📜',
    [MULTIPLIER_SYMBOL_NAME]: '☄️',
};

export function getSymbolEmoji(name: string | undefined): string {
    if (!name) return '';
    return SYMBOL_EMOJI[name] ?? '❓';
}

/** Tempo de exibição de cada cascata durante a animação (ms). */
export const CASCADE_WIN_PAUSE_MS = 900;
export const CASCADE_NEUTRAL_PAUSE_MS = 450;
export const BONUS_INTRO_PAUSE_MS = 1500;
export const BONUS_SPIN_PAUSE_MS = 1200;
