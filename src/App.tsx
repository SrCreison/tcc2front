import { useState, useEffect } from 'react';
import './App.css';

// Mapeamento exato dos nomes que saem do seu backend (GameMath/Engine)
const SYMBOLS: Record<string, string> = {
  'pocao_azul': '🧪',
  'pocao_verde': '🧪',
  'pocao_roxa': '🧪',
  'cristal': '💎',
  'livro': '📖',
  'scatter_grimorio': '📜',
  'pedra_filosofal': '☄️'
};

function App() {
  // Inicializa o grid com 20 espaços vazios (5x4)
  const [grid, setGrid] = useState<any[]>(Array(20).fill(null));
  const [status, setStatus] = useState('Pronto para a Alquimia?');
  const [loading, setLoading] = useState(false);
  const [resumo, setResumo] = useState<any>(null);

  // Função para processar a animação das cascatas
  const animarCascatas = async (historico: any[]) => {
    for (const etapa of historico) {
      setGrid(etapa.grid); // Atualiza o visual com o grid daquela cascata
      
      if (etapa.resultado.teveVitoria) {
        setStatus(`💥 Explosão! +R$ ${etapa.resultado.premioCascata.toFixed(2)}`);
        await new Promise(r => setTimeout(r, 1000)); // Espera 1s para o jogador ver a vitória
      }
    }
  };

  const girar = async (comprarBonus = false) => {
    setLoading(true);
    setResumo(null);
    setStatus('Misturando ingredientes...');
    
    try {
      const url = `https://api-play.abraaodaldon.com.br/api/play${comprarBonus ? '?buyBonus=true' : ''}`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.id) {
        // 1. Roda a animação das cascatas do Jogo Base
        await animarCascatas(data.jogo.historico);
        
        // 2. Se teve bônus, avisa o jogador
        if (data.jogo.scattersNaTela >= 4) {
          setStatus('🔥 BÔNUS ATIVADO! Veja o console para detalhes por enquanto.');
        } else {
          setStatus('Rodada finalizada.');
        }

        setResumo(data.resumoFinanceiro);
      }
    } catch (e) {
      console.error(e);
      setStatus('Erro ao conectar com a torre do mago (API).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-container">
      <h1 className="title">🧪 Alquimia Slot</h1>
      
      <div className="grid-5x4">
        {grid.map((simbolo, i) => (
          <div key={i} className={`slot-cell ${simbolo?.venceu ? 'win-anim' : ''}`}>
            {simbolo ? SYMBOLS[simbolo.name] || '❓' : ''}
          </div>
        ))}
      </div>

      <div className="ui-panel">
        <p className="status-msg">{status}</p>
        
        <div className="buttons">
          <button onClick={() => girar(false)} disabled={loading} className="btn normal">
            {loading ? 'Girando...' : 'JOGAR (R$ 2.00)'}
          </button>
          <button onClick={() => girar(true)} disabled={loading} className="btn bonus">
            COMPRAR BÔNUS (R$ 200)
          </button>
        </div>

        {resumo && (
          <div className="resumo-box">
            <p>💰 Ganho: R$ {resumo.premioTotalDaSessao.toFixed(2)}</p>
            <p style={{ color: resumo.lucroSessao >= 0 ? '#4ade80' : '#f87171' }}>
              {resumo.lucroSessao >= 0 ? 'LUCRO' : 'PREJUÍZO'}: R$ {resumo.lucroSessao.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
