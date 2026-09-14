import { API_BASE_URL } from './config';
import type { ApiErrorResponse, SpinResponse } from './types';

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

export async function playRound(clientSeed: string, comprarBonus: boolean): Promise<SpinResponse> {
    const params = new URLSearchParams({
        cSeed: clientSeed,
        aposta: String(generateNonce()),
    });
    if (comprarBonus) {
        params.set('buyBonus', 'true');
    }

    const resposta = await fetch(`${API_BASE_URL}/api/play?${params.toString()}`);
    const dados = await resposta.json();

    if (!resposta.ok) {
        const erro = dados as ApiErrorResponse;
        throw new Error(erro?.erro ?? `Erro na API (HTTP ${resposta.status}).`);
    }

    return dados as SpinResponse;
}
