import { useState, useEffect } from 'react';

// MAPEAMENTO COMPLETO BASEADO NO SEU PRINT
const SYMBOLS: Record<string, string> = {
  'pocao_azul': '🔵',
  'pocao_verde': '🧪',
  'pocao_roxa': '🟣',
  'pocao_vermelha': '🔴',
  'cristal_verde': '💚',
  'cristal_azul': '💙',
  'cristal_rosa': '💗',
  'cristal_cinza': '🩶',
  'cristal_amarelo': '💛',
  'livro': '📖',
  'scatter_grimorio': '📜',
  'pedra_filosofal': '☄️',
  'pocao_dourada': '🍾'
};

function App() {
  const [loading, setLoading] = useState(false);
  // Grid 6x5 = 30 espaços
  const [grid, setGrid] = useState<any[]>(Array(30).fill(null)); 
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState('Pronto para a Alquimia?');

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
      
      <h1 style={{ color: '#a855f7', textShadow: '0 0 15px rgba(168,85,247,0.5)', marginBottom: '20px' }}>🧪 Alquimia Slot</h1>

      {/* GRID 6 COLUNAS x 5 LINHAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 75px)', 
        gridTemplateRows: 'repeat(5, 75px)',
        gap: '10px',
        backgroundColor: '#1e293b',
        padding: '20px',
        borderRadius: '16px',
        border: '5px solid #4c1d95',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        marginBottom: '30px'
      }}>
        {grid.map((simbolo, i) => (
          <div key={i} style={{
            width: '75px',
            height: '75px',
            backgroundColor: simbolo?.venceu ? '#5b21b6' : '#0f172a',
            border: simbolo?.venceu ? '2px solid #fff' : '1px solid #334155',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            transition: 'all 0.2s'
          }}>
            {simbolo ? (SYMBOLS[simbolo.name] || <span style={{fontSize: '10px'}}>{simbolo.name}</span>) : ''}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.2rem' }}>{status}</p>
        
        {/* OS DOIS BOTÕES VOLTARAM! */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => girarRoleta(false)} disabled={loading} style={{ padding: '15px 30px', cursor: 'pointer', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px' }}>
            {loading ? '...' : 'JOGAR R$ 2'}
          </button>

          <button onClick={() => girarRoleta(true)} disabled={loading} style={{ padding: '15px 30px', cursor: 'pointer', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px' }}>
            COMPRAR BÔNUS (R$ 200)
          </button>
        </div>
      </div>

      {info && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', borderLeft: '6px solid #a855f7', minWidth: '320px' }}>
          <p style={{ margin: '5px 0' }}>💰 Ganho: R$ {info.resumoFinanceiro.premioTotalDaSessao.toFixed(2)}</p>
          <p style={{ margin: '5px 0', color: info.resumoFinanceiro.lucroSessao >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
            {info.resumoFinanceiro.lucroSessao >= 0 ? '✅ LUCRO' : '❌ PREJUÍZO'}: R$ {info.resumoFinanceiro.lucroSessao.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
