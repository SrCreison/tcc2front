import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GAME_PROFILE_LABELS } from '../config';
import type { SpinResponse } from '../types';

interface AuditPanelProps {
    info: SpinResponse;
}

function HashRow({ cascata, hash }: { cascata: number; hash: string }) {
    return (
        <div className="hash-row">
            <span className="hash-row__label">Cascata {cascata}</span>
            <code className="hash-row__value">{hash}</code>
        </div>
    );
}

export function AuditPanel({ info }: AuditPanelProps) {
    const [bonusExpandido, setBonusExpandido] = useState<number | null>(null);
    const { serverSeed, clientSeed, nonceInicial, valorAposta, perfil, isBonusBuy } = info.auditoria;
    const historicoBase = info.roteiroDoJogo.jogoBase.historicoRodada;
    const jogoBonus = info.roteiroDoJogo.jogoBonus;

    const verifyParams = new URLSearchParams({
        serverSeed,
        clientSeed,
        nonceInicial: String(nonceInicial),
        valorAposta: String(valorAposta),
        perfil,
        isBonusBuy: String(isBonusBuy),
    });

    return (
        <details className="audit-panel">
            <summary>🔎 Auditoria desta rodada ({historicoBase.length} hash{historicoBase.length > 1 ? 'es' : ''} no jogo base)</summary>

            <div className="audit-panel__body">
                <div className="audit-panel__seeds">
                    <div>
                        <span className="audit-panel__field-label">serverSeed</span>
                        <code>{serverSeed}</code>
                    </div>
                    <div>
                        <span className="audit-panel__field-label">clientSeed</span>
                        <code>{clientSeed}</code>
                    </div>
                    <div>
                        <span className="audit-panel__field-label">nonce inicial</span>
                        <code>{nonceInicial}</code>
                    </div>
                    <div>
                        <span className="audit-panel__field-label">perfil</span>
                        <code>{GAME_PROFILE_LABELS[perfil] ?? perfil}</code>
                    </div>
                </div>

                <h5>Hashes do jogo base</h5>
                <div className="hash-list">
                    {historicoBase.map((etapa) => (
                        <HashRow key={etapa.cascata} cascata={etapa.cascata} hash={etapa.hashUtilizado} />
                    ))}
                </div>

                {jogoBonus && (
                    <>
                        <h5>Hashes da rodada bônus</h5>
                        <div className="bonus-hash-list">
                            {jogoBonus.giros.map((giro) => (
                                <details
                                    key={giro.giro}
                                    open={bonusExpandido === giro.giro}
                                    onToggle={(e) => setBonusExpandido(e.currentTarget.open ? giro.giro : null)}
                                >
                                    <summary>
                                        Giro {giro.giro}/{jogoBonus.quantidadeGiros} · {giro.historico.length} hash
                                        {giro.historico.length > 1 ? 'es' : ''} · R$ {giro.premio.toFixed(2)}
                                    </summary>
                                    <div className="hash-list">
                                        {giro.historico.map((etapa) => (
                                            <HashRow key={etapa.cascata} cascata={etapa.cascata} hash={etapa.hashUtilizado} />
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </>
                )}

                <Link className="btn btn--verify" to={`/provably-fair?${verifyParams.toString()}`}>
                    ✅ Verificar esta rodada no Provably Fair
                </Link>
            </div>
        </details>
    );
}
