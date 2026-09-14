import { useState } from 'react';

export function DisclaimerBadge() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className="disclaimer-badge" onClick={() => setOpen(true)} aria-label="Ver aviso legal e educacional">
                ℹ️ Aviso
            </button>

            {open && (
                <div className="disclaimer-overlay" onClick={() => setOpen(false)}>
                    <div className="disclaimer-panel" onClick={(e) => e.stopPropagation()}>
                        <button className="disclaimer-panel__close" onClick={() => setOpen(false)} aria-label="Fechar">
                            ✕
                        </button>
                        <h2>Aviso legal e educacional</h2>
                        <p>
                            Este site é um estudo de caso acadêmico (Trabalho de Conclusão de Curso) sobre o
                            funcionamento de geradores de números pseudoaleatórios criptograficamente seguros
                            (CSPRNG) aplicados a um jogo de "slot".
                        </p>
                        <ul>
                            <li>
                                <strong>Não envolve dinheiro real.</strong> Os valores em R$ exibidos são inteiramente
                                simulados — não há depósito, saque, pagamento ou qualquer transação financeira real
                                associada a este jogo.
                            </li>
                            <li>
                                <strong>Não é uma casa de apostas.</strong> Não há valor real colocado em risco nem
                                prêmio real (conforme a definição de "aposta" da Lei 14.790/2023). Este projeto não
                                opera nem pretende operar como agente de apostas de quota fixa e não requer
                                licenciamento junto à SPA/Ministério da Fazenda.
                            </li>
                            <li>
                                <strong>Uso exclusivamente educacional.</strong> Existe para fins de estudo e defesa
                                acadêmica, demonstrando conceitos de criptografia, verificabilidade ("provably fair")
                                e ponderação estatística — não para uso comercial ou incentivo ao jogo de azar real.
                            </li>
                            <li>
                                <strong>Sem garantias.</strong> Fornecido "como está", sem garantia de disponibilidade
                                contínua.
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
