import { useState, useEffect } from 'react';
import './App.css'; // Vamos criar esse arquivo abaixo

const SYMBOLS: Record<string, string> = {
  'pocao_azul': '🧪', 'pocao_verde': '🧪', 'pocao_roxa': '🧪',
  'cristal': '💎', 'livro': '📖', 'scatter_grimorio': '📜', 'pedra_filosofal': '☄️'
};

function App() {
  const [grid, setGrid] = useState<any[]>(Array(20).fill(null));
  const [status, setStatus] = useState('Aguardando aposta...');
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<any[]>([]);

  // Função para "Rodar" a animação de cascata
  const playSequence = async (steps: any[]) => {
    for (const step of steps) {
      setGrid(step.grid); // Atualiza o grid visual
      if (step.resultado.teveVitoria) {
        setStatus(`Vitória na Cascata! +R$ ${step.resultado.premioCascata}`);
        await new Promise(r => setTimeout(r, 800)); // Espera a "explosão"
      }
    }
  };

  const girar = async (buyBonus = false) => {
    setLoading(true);
    setStatus('Misturando poções...');
    
    try {
      const resp = await fetch(`https://api-play.abraaodaldon.com.br/api/play?buyBonus=${buyBonus}`);
      const data = await resp.json();
      
      // Toca a animação baseada no histórico de cascatas que o backend mandou
      await playSequence(data.jogo.historico);
      
      setStatus(`Fim da rodada. Prêmio: R$ ${data.jogo.premioRodada}`);
      fetchHistory(); // Atualiza a lista lateral
    } catch (e) {
      setStatus('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = () => {
    fetch('https://api-play.abraaodaldon.com.br/api/history')
      .then(r => r.json()).then(setHistorico);
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="game-container">
      <div className="sidebar">
        <h3>📜 Histórico</h3>
        {historico.map(h => (
          <div key={h.id} className="history-item">
            R$ {h.payout.toFixed(2)} {h.payout > 0 ? '✅' : '💀'}
          </div>
        ))}
      </div>

      <main className="main-game">
        <h1 className="title">ALQUIMIA SLOT</h1>
        <div className="grid-5x4">
          {grid.map((s, i) => (
            <div key={i} className={`slot-cell ${s?.venceu ? 'win-anim' : ''}`}>
              {s ? SYMBOLS[s.name] || '❓' : ''}
            </div>
          ))}
        </div>

        <div className="controls">
          <p className="status-text">{status}</p>
          <button onClick={() => girar(false)} disabled={loading} className="btn-play">
            GIRAR (R$ 2.00)
          </button>
          <button onClick={() => girar(true)} disabled={loading} className="btn-bonus">
            COMPRAR BÔNUS (R$ 200)
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
