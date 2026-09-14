import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export function SiteNav() {
    return (
        <nav className="site-nav">
            <Link className="site-nav__link site-nav__link--internal" to="/">
                🎰 Jogar
            </Link>
            <Link className="site-nav__link site-nav__link--internal" to="/provably-fair">
                🔍 Provably Fair
            </Link>
            <Link className="site-nav__link site-nav__link--internal" to="/como-funciona">
                📖 Como funciona
            </Link>
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
        </nav>
    );
}
