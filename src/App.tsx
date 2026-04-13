import { useState } from 'react';
import './App.css';

// Mapeamento dos símbolos para emojis (ou imagens)
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
  const [loading, setLoading] = useState(false);
  const [grid, setGrid] = useState<any[]>(Array(20).fill(null)); // Começa vazio
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState('Pronto para começar?');

  // Função para rodar a animação de cascata
  const animarJogo = async (historico: any[]) => {
    for (const etapa of historico) {
      setGrid(etapa.grid); // Atualiza o grid na tela
      if (etapa.resultado.teveVitoria) {
        setStatus(`💥 VITÓRIA! +R$ ${etapa.resultado.premioCascata.toFixed(2)}`);
        await new Promise(r => setTimeout(r, 800)); // Espera a explosão
      }
    }
  };

  const girarRoleta = async (comprarBonus: boolean = false) => {
    setLoading(true);
    setInfo(null);
    setStatus('Girando...');

    try {
      const aposta = Math.floor(Math.random() * 999999);
      let url = `https://api-play.abraaodaldon.com.br/api/play?cSeed=User&aposta=${aposta}`;
      if (comprarBonus) url += '&buyBonus=true';

      const resposta = await fetch(url);
      const dados = await resposta.json();

      // Aqui a mágica acontece: anima as cascatas que vieram do back
      await animarJogo(dados.roteiroDoJogo.jogoBase.historicoRodada);
      
      setInfo(dados);
      setStatus(dados.mensagem);
    } catch (erro) {
      console.error(erro);
      setStatus('Erro ao conectar na API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-container">
      <h1 className="title">🧪 Alquimia Slot</h1>

      {/* O GRID (Essa parte faltava no seu código!) */}
      <div className="slot-machine">
        <div className="grid-5x4">
          {grid.map((simbolo, i) => (
            <div key={i} className={`slot-cell ${simbolo?.venceu ? 'win-anim' : ''}`}>
              {simbolo ? SYMBOLS[simbolo.name] || '❓' : ''}
            </div>
          ))}
        </div>
      </div>

      <div className="controls">
        <p className="status-label">{status}</p>
        <button onClick={() => girarRoleta(false)} disabled={loading} className="btn-play">
          {loading ? 'Processando...' : 'JOGADA NORMAL (R$ 2)'}
        </button>
        <button onClick={() => girarRoleta(true)} disabled={loading} className="btn-bonus">
          COMPRAR BÔNUS (R$ 200)
        </button>
      </div>

      {info && (
        <div className="resumo-painel">
          <p>💰 Aposta: R$ {info.resumoFinanceiro.valorApostado.toFixed(2)}</p>
          <p>🎁 Prêmio: R$ {info.resumoFinanceiro.premioTotalDaSessao.toFixed(2)}</p>
          <p>📈 Resultado: {info.resumoFinanceiro.lucroSessao >= 0 ? '✅ LUCRO' : '❌ PREJUÍZO'}</p>
        </div>
      )}
    </div>
  );
}

export default App;
