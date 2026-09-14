import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SiteNav } from '../components/SiteNav';
import { SlotGrid } from '../components/SlotGrid';
import { verifyRound } from '../api';
import { GAME_PROFILE_LABELS } from '../config';
import type { GameProfile, VerifyResponse } from '../types';

export function ProvablyFairPage() {
    const [searchParams] = useSearchParams();

    const [serverSeed, setServerSeed] = useState(searchParams.get('serverSeed') ?? '');
    const [clientSeed, setClientSeed] = useState(searchParams.get('clientSeed') ?? 'User');
    const [nonceInicial, setNonceInicial] = useState(searchParams.get('nonceInicial') ?? '0');
    const [valorAposta, setValorAposta] = useState(searchParams.get('valorAposta') ?? '2');
    const [perfil, setPerfil] = useState<GameProfile>((searchParams.get('perfil') as GameProfile) ?? 'normal');
    const [isBonusBuy, setIsBonusBuy] = useState(searchParams.get('isBonusBuy') === 'true');

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [resultado, setResultado] = useState<VerifyResponse | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErro(null);
        setResultado(null);

        try {
            const dados = await verifyRound({
                serverSeed: serverSeed.trim(),
                clientSeed: clientSeed.trim(),
                nonceInicial: Number(nonceInicial),
                valorAposta: Number(valorAposta),
                perfil,
                isBonusBuy,
            });
            setResultado(dados);
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Erro ao verificar a rodada.');
        } finally {
            setLoading(false);
        }
    }

    const gridFinal = resultado?.jogoBase.historico[resultado.jogoBase.historico.length - 1]?.grid ?? [];

    return (
        <div className="game-container page-container">
            <h1 className="title">🔍 Provably Fair</h1>
            <SiteNav />

            <p className="page-intro">
                Toda rodada revela o <code>serverSeed</code> usado (na resposta de <code>/api/play</code>, campo{' '}
                <code>auditoria</code>). Cole os dados de uma rodada aqui e o servidor recalcula o resultado do zero, a partir
                do mesmo hash HMAC-SHA256 — se bater com o que apareceu na tela, a rodada está provada: o resultado não foi
                escolhido depois de ver a aposta, ele já estava determinado pelo seed no instante em que o giro aconteceu.
            </p>

            <form className="verify-form" onSubmit={handleSubmit}>
                <label>
                    <span>serverSeed</span>
                    <input value={serverSeed} onChange={(e) => setServerSeed(e.target.value)} required />
                </label>
                <label>
                    <span>clientSeed</span>
                    <input value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} required />
                </label>
                <div className="verify-form__row">
                    <label>
                        <span>Nonce inicial</span>
                        <input
                            type="number"
                            value={nonceInicial}
                            onChange={(e) => setNonceInicial(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <span>Valor da aposta (R$)</span>
                        <input
                            type="number"
                            step={0.5}
                            value={valorAposta}
                            onChange={(e) => setValorAposta(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="verify-form__row">
                    <label>
                        <span>Perfil</span>
                        <select value={perfil} onChange={(e) => setPerfil(e.target.value as GameProfile)}>
                            {Object.keys(GAME_PROFILE_LABELS).map((id) => (
                                <option key={id} value={id}>
                                    {GAME_PROFILE_LABELS[id]}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="verify-form__checkbox">
                        <input type="checkbox" checked={isBonusBuy} onChange={(e) => setIsBonusBuy(e.target.checked)} />
                        <span>Foi compra de bônus</span>
                    </label>
                </div>

                <button className="btn btn--normal" type="submit" disabled={loading}>
                    {loading ? 'Verificando...' : 'Verificar rodada'}
                </button>
            </form>

            {erro && <p className="verify-error">{erro}</p>}

            {resultado && (
                <div className="verify-result">
                    <p className="verify-result__badge">✅ Rodada recalculada com sucesso — resultado determinístico confirmado</p>
                    <ul>
                        <li>Prêmio recalculado: R$ {resultado.jogoBase.premioRodada.toFixed(2)}</li>
                        <li>Scatters na tela: {resultado.jogoBase.scattersNaTela}</li>
                        <li>Multiplicador aplicado: {resultado.jogoBase.multiplicadorAplicado || '—'}</li>
                        <li>Hashes gerados (cascatas): {resultado.jogoBase.hashesGerados}</li>
                        <li>Perfil usado no recálculo: {GAME_PROFILE_LABELS[resultado.perfilUtilizado]}</li>
                    </ul>
                    <p className="page-hint">
                        Compare o prêmio acima com o que a tela do jogo mostrou naquela rodada — se forem iguais, está provado.
                    </p>
                    <SlotGrid grid={gridFinal} />
                </div>
            )}
        </div>
    );
}
