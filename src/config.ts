/**
 * URL base da API. Antes vinha hardcoded dentro da função de giro
 * (`https://api-play.abraaodaldon.com.br...`), o que obrigava editar o
 * código-fonte pra rodar contra um backend local em desenvolvimento.
 * Agora vem de uma variável de ambiente do Vite, com o domínio de
 * produção como fallback (veja .env.example).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api-play.abraaodaldon.com.br';

export const BET_AMOUNT = 2.0;
export const MIN_BET_AMOUNT = 0.5;
export const MAX_BET_AMOUNT = 50;
export const BONUS_BUY_COST_MULTIPLIER = 100;

export const GAME_PROFILE_LABELS: Record<string, string> = {
    normal: 'Normal (realista)',
    demonstracao: 'Demonstração (didático)',
};

export const GAME_PROFILE_DESCRIPTIONS: Record<string, string> = {
    normal:
        'Pesos calibrados para se aproximar de uma slot real: vitórias e o bônus são propositalmente raros, e o valor esperado por giro é negativo para o jogador — o CSPRNG garante que o sorteio é verificável, não que as chances sejam boas.',
    demonstracao:
        'Pesos bem mais generosos, só para fins didáticos: mostra cascatas, multiplicadores e a rodada bônus em poucos giros. Não representa a economia de um jogo real.',
};

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

/**
 * Duração mínima do "giro" visual (puramente cosmético) antes de revelar
 * o resultado real — tanto no giro base quanto em cada giro do bônus.
 * O resultado já foi decidido pelo servidor (CSPRNG) no instante em que a
 * resposta chega; este atraso só existe para dar a sensação de "rolar os
 * rolos" em vez de o grid simplesmente trocar de figura instantaneamente.
 */
export const SPIN_FRAME_MS = 90;
export const MIN_SPIN_DURATION_MS = 700;
export const BONUS_GIRO_SPIN_MS = 450;

/**
 * Símbolos usados só para o efeito visual do giro (embaralhamento rápido
 * de emojis antes do resultado aparecer). Não têm nenhum papel no
 * resultado do jogo — por isso é seguro sortear com Math.random() aqui,
 * ao contrário do nonce em api.ts, que usa a Web Crypto API porque
 * participa do cálculo do resultado real.
 */
export const SPIN_PLACEHOLDER_SYMBOLS = Object.keys(SYMBOL_EMOJI).filter(
    (name) => name !== SCATTER_SYMBOL_NAME && name !== MULTIPLIER_SYMBOL_NAME,
);
