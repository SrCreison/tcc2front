import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface SiteNavProps {
    /**
     * Versão compacta: usada na tela do jogo, onde o espaço vertical é
     * disputado com o tabuleiro (ver .game-viewport em App.css). Mantém só
     * os 3 links principais visíveis e esconde os links crus da API dentro
     * de um "mais", em vez de ocupar uma segunda linha sempre.
     */
    compact?: boolean;
}

export function SiteNav({ compact = false }: SiteNavProps) {
    const externalLinks = (
        <>
            <a
                className="site-nav__link site-nav__link--external"
                href={`${API_BASE_URL}/api/history`}
                target="_blank"
                rel="noreferrer"
            >
                🗂 Histórico (JSON) ↗
            </a>
            <a
                className="site-nav__link site-nav__link--external"
                href={`${API_BASE_URL}/api/config`}
                target="_blank"
                rel="noreferrer"
            >
                ⚙️ Pesos e regras (JSON) ↗
            </a>
            <a
                className="site-nav__link site-nav__link--external"
                href={`${API_BASE_URL}/api/health`}
                target="_blank"
                rel="noreferrer"
            >
                💓 Status do servidor ↗
            </a>
        </>
    );

    return (
        <nav className={`site-nav${compact ? ' site-nav--compact' : ''}`}>
            <Link className="site-nav__link site-nav__link--internal" to="/">
                🎰 Jogar
            </Link>
            <Link className="site-nav__link site-nav__link--internal" to="/provably-fair">
                🔍 Provably Fair
            </Link>
            <Link className="site-nav__link site-nav__link--internal" to="/como-funciona">
                📖 Como funciona
            </Link>

            {compact ? (
                <details className="site-nav__more">
                    <summary>⋯ mais</summary>
                    <div className="site-nav__more-list">{externalLinks}</div>
                </details>
            ) : (
                externalLinks
            )}
        </nav>
    );
}
