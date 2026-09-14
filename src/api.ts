import { API_BASE_URL } from './config';
import type { ApiErrorResponse, ConfigResponse, GameProfile, SpinResponse, VerifyResponse } from './types';

/**
 * Gera o nonce da jogada usando a Web Crypto API (CSPRNG do navegador)
 * em vez de Math.random(). Não é o que garante a imprevisibilidade do
 * resultado — isso é papel do serverSeed, gerado no backend — mas mantém
 * o projeto coerente com o próprio tema do estudo de caso: em nenhum
 * lugar (nem cliente, nem servidor) se usa uma fonte de aleatoriedade
 * não-criptográfica quando uma alternativa segura está disponível.
 */
function generateNonce(): number {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % 999_999;
}

async function parseJsonResponse<T>(resposta: Response): Promise<T> {
    const dados = await resposta.json();
    if (!resposta.ok) {
        const erro = dados as ApiErrorResponse;
        throw new Error(erro?.erro ?? `Erro na API (HTTP ${resposta.status}).`);
    }
    return dados as T;
}

export async function playRound(
    clientSeed: string,
    comprarBonus: boolean,
    betAmount: number,
    profile: GameProfile,
): Promise<SpinResponse> {
    const params = new URLSearchParams({
        cSeed: clientSeed,
        aposta: String(generateNonce()),
        valorAposta: String(betAmount),
        modo: profile,
    });
    if (comprarBonus) {
        params.set('buyBonus', 'true');
    }

    const resposta = await fetch(`${API_BASE_URL}/api/play?${params.toString()}`);
    return parseJsonResponse<SpinResponse>(resposta);
}

export interface VerifyRoundInput {
    serverSeed: string;
    clientSeed: string;
    nonceInicial: number;
    isBonusBuy?: boolean;
    valorAposta?: number;
    perfil?: GameProfile;
}

/** Recalcula uma rodada já jogada a partir dos dados públicos revelados — o núcleo da auditoria "provably fair". */
export async function verifyRound(input: VerifyRoundInput): Promise<VerifyResponse> {
    const resposta = await fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    return parseJsonResponse<VerifyResponse>(resposta);
}

/** Busca as regras, pesos e estatísticas de referência atuais do motor do jogo, para a tela "Como funciona". */
export async function fetchConfig(): Promise<ConfigResponse> {
    const resposta = await fetch(`${API_BASE_URL}/api/config`);
    return parseJsonResponse<ConfigResponse>(resposta);
}
