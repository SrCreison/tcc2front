import { useState, useEffect } from 'react';

const SYMBOLS: Record<string, string> = {
  'pocao_azul': '🧪',
  'pocao_verde': '🟢',
  'pocao_roxa': '🟣',
  'cristal': '💎',
  'livro': '📖',
  'scatter_grimorio': '📜',
  'pedra_filosofal': '☄️'
};

function App() {
  const [loading, setLoading] = useState(false);
  // AGORA COM 30 ESPAÇOS (6x5)
  const [grid, setGrid] = useState<any[]>(Array(30).fill(null)); 
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState('Pronto para o caos?');

  const animarJogo = async (historico: any[]) => {
    if (!historico) return;
    for (const etapa of historico) {
      setGrid(etapa.grid);
      if (etapa.resultado.teveVitoria) {
        setStatus(`💥 VITÓRIA! +R$ ${etapa.resultado.premioCascata.toFixed(2)}`);
        await new Promise(r => setTimeout(r, 800));
      }
    }
  };

  const girarRoleta = async (comprarBonus: boolean = false) => {
    setLoading(true);
    setInfo(null);
    setStatus('Misturando poções...');
    try {
      const aposta = Math.floor(Math.random() * 999999);
      let url = `https://api-play.abraaodaldon.com.br/api/play?cSeed=User&aposta=${aposta}`;
      if (comprarBonus) url += '&buyBonus=true';

      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (dados.roteiroDoJogo?.jogoBase?.historicoRodada) {
        await animarJogo(dados.roteiroDoJogo.jogoBase.historicoRodada);
        setInfo(dados);
        setStatus(dados.mensagem);
      }
    } catch (erro) {
      setStatus('Erro na API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <h1 style={{ color: '#a855f7', textShadow: '0 0 15px rgba(168,85,247,0.5)' }}>🧪 Alquimia Slot</h1>

      {/* GRID CORRIGIDO PARA 6 COLUNAS E 5 LINHAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 70px)', // 6 colunas
        gridTemplateRows: 'repeat(5, 70px)',    // 5 linhas
        gap: '8px',
        backgroundColor: '#1e293b',
        padding: '15px',
        borderRadius: '16px',
        border: '5px solid #4c1d95',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        marginBottom: '20px'
      }}>
        {grid.map((simbolo, i) => (
          <div key={i} style={{
            width: '70px',
            height: '70px',
            backgroundColor: simbolo?.venceu ? '#5b21b6' : '#0f172a',
            border: simbolo?.venceu ? '2px solid #fff' : '1px solid #334155',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            transition: 'all 0.2s'
          }}>
            {simbolo ? (SYMBOLS[simbolo.name] || <span style={{fontSize: '10px'}}>{simbolo.name}</span>) : ''}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{status}</p>
        <button onClick={() => girarRoleta(false)} disabled={loading} style={{ padding: '12px 25px', cursor: 'pointer', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          {loading ? '...' : 'JOGAR R$ 2'}
        </button>
      </div>

      {info && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '10px', borderLeft: '5px solid #a855f7' }}>
          <p>💰 Ganho: R$ {info.resumoFinanceiro.premioTotalDaSessao.toFixed(2)}</p>
          <p style={{ color: info.resumoFinanceiro.lucroSessao >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
            {info.resumoFinanceiro.lucroSessao >= 0 ? 'LUCRO' : 'PREJUÍZO'}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
