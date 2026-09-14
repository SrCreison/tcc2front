import { useEffect, useState } from 'react';
import { SiteNav } from '../components/SiteNav';
import { fetchConfig } from '../api';
import { GAME_PROFILE_LABELS, getSymbolEmoji } from '../config';
import type { ConfigResponse, ProfileWeightsSnapshot } from '../types';

function totalWeight(pesos: ProfileWeightsSnapshot): number {
    return pesos.common.reduce((acc, s) => acc + s.weight, 0) + pesos.scatterBase;
}

function WeightsTable({ pesos }: { pesos: ProfileWeightsSnapshot }) {
    const total = totalWeight(pesos);
    const linhas = [...pesos.common, { id: 10, name: 'scatter_grimorio', weight: pesos.scatterBase }];

    return (
        <table className="weights-table">
            <thead>
                <tr>
                    <th>Símbolo</th>
                    <th>Peso</th>
                    <th>Chance por casa</th>
                </tr>
            </thead>
            <tbody>
                {linhas.map((s) => (
                    <tr key={s.id}>
                        <td>
                            {getSymbolEmoji(s.name)} {s.name}
                        </td>
                        <td>{s.weight}</td>
                        <td>{((s.weight / total) * 100).toFixed(2)}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function HowItWorksPage() {
    const [config, setConfig] = useState<ConfigResponse | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig()
            .then(setConfig)
            .catch((err) => setErro(err instanceof Error ? err.message : 'Erro ao carregar configuração.'));
    }, []);

    return (
        <div className="game-container page-container">
            <h1 className="title">📖 Como funciona o Alquimia Slot</h1>
            <SiteNav />

            <section className="explainer-section">
                <h2>1. De onde vem cada resultado</h2>
                <p>
                    A cada giro, o servidor gera um <code>serverSeed</code> novo com um CSPRNG (
                    <code>crypto.randomBytes</code> do Node — um gerador de números aleatórios seguro
                    criptograficamente, diferente de <code>Math.random()</code>, que não tem essa garantia). Esse seed,
                    junto com o <code>clientSeed</code> e um <code>nonce</code>, vira um hash HMAC-SHA256. É esse hash —
                    e só ele — que decide quais símbolos caem no tabuleiro.
                </p>
                <p>
                    Cada cascata (cada "queda" de símbolos depois de uma vitória) usa um hash diferente, gerado com um
                    contador que avança a cada cascata. Isso significa que uma rodada inteira, por mais cascatas que
                    tenha, é 100% determinada no instante em que o <code>serverSeed</code> é criado — nada é decidido
                    "no meio do caminho".
                </p>
            </section>

            <section className="explainer-section">
                <h2>2. Do hash ao símbolo: pesos</h2>
                <p>
                    Cada símbolo tem um <strong>peso</strong>. A chance dele cair numa casa é{' '}
                    <code>peso ÷ soma de todos os pesos</code>. Pense numa roleta dividida em fatias proporcionais ao
                    peso de cada símbolo — um byte do hash (um número de 0 a 255) sorteia um ponto dentro dela.
                </p>
                <p>
                    <strong>Isso é importante:</strong> a criptografia (HMAC-SHA256) garante que ninguém, nem o próprio
                    servidor, consegue escolher o resultado depois de saber a aposta — o processo é verificável (veja a
                    página <a href="/provably-fair">Provably Fair</a>). Mas os PESOS são uma escolha totalmente separada
                    de design. É aí que mora a "vantagem da casa": você pode ter um sorteio perfeitamente auditável e
                    ainda assim configurado para que o jogador perca dinheiro no longo prazo — é exatamente assim que
                    cassinos (físicos ou online) reais funcionam. A tabela abaixo mostra os pesos realmente usados pelo
                    servidor agora, em cada perfil:
                </p>

                {erro && <p className="verify-error">{erro}</p>}
                {config && (
                    <div className="profile-comparison">
                        {config.perfis.map((perfil) => (
                            <div key={perfil.id} className="profile-comparison__card">
                                <h3>{GAME_PROFILE_LABELS[perfil.id] ?? perfil.id}</h3>
                                <WeightsTable pesos={perfil.pesos} />
                                <ul className="profile-comparison__stats">
                                    <li>
                                        RTP simulado: <strong>{perfil.estatisticasDeReferencia.rtpPercent}%</strong>
                                    </li>
                                    <li>Frequência de vitória: {perfil.estatisticasDeReferencia.hitRatePercent}%</li>
                                    <li>Bônus ativado: {perfil.estatisticasDeReferencia.bonusFrequency}</li>
                                    <li>
                                        Amostra: {perfil.estatisticasDeReferencia.amostraGiros.toLocaleString('pt-BR')}{' '}
                                        giros simulados
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                <p className="page-hint">
                    RTP (return to player) é o quanto volta pro jogador, em média, pra cada real apostado. RTP abaixo de
                    100% significa que, no agregado de muitos giros, a casa lucra — mesmo que aquele jogador específico
                    tenha tido sorte numa sessão curta. O perfil "normal" foi calibrado para isso; o "demonstração" foi
                    calibrado para o oposto, de propósito, só para fins didáticos.
                </p>
            </section>

            <section className="explainer-section">
                <h2>3. Cascatas (o "tumble")</h2>
                <p>
                    Quando {config?.regras.minimoParaPagar ?? 8}+ símbolos iguais caem na tela, eles pagam e depois
                    somem; os símbolos acima descem para preencher o espaço, e um hash novo (da próxima cascata) sorteia
                    o que entra por cima. Isso se repete até uma cascata sem vitória. Cada cascata é uma chance
                    adicional de ganhar mais — mas sempre a partir de um hash novo e independente.
                </p>
            </section>

            <section className="explainer-section">
                <h2>4. A rodada bônus</h2>
                <p>
                    Símbolos de scatter não são destruídos nas cascatas — eles se acumulam. Ao atingir{' '}
                    {config?.regras.scattersParaBonus ?? 4} scatters na tela (somando todas as cascatas da rodada), o
                    jogo concede {config?.regras.girosGratisNoBonus ?? 10} giros grátis, onde um símbolo especial (a
                    Pedra Filosofal) pode multiplicar o prêmio. Também é possível comprar a entrada direta no bônus por{' '}
                    {config?.regras.multiplicadorCompraDeBonus ?? 100}x o valor da aposta — isso só força 4 scatters no
                    primeiro grid; o resto do giro (e todos os giros do bônus) continua vindo do hash normalmente.
                </p>
            </section>

            <section className="explainer-section">
                <h2>5. Como conferir você mesmo</h2>
                <p>
                    Toda resposta de um giro inclui o <code>serverSeed</code> usado. Pegue esse valor, o{' '}
                    <code>clientSeed</code> e o nonce, e cole na página <a href="/provably-fair">Provably Fair</a> — o
                    servidor recalcula a rodada do zero, e o resultado tem que ser idêntico ao que apareceu na tela.
                </p>
            </section>
        </div>
    );
}
