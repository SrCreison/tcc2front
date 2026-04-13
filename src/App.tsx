import { useState } from 'react';

// Mapeamento dos símbolos para emojis
const SYMBOLS: Record<string, string> = {
  'pocao_azul': '👍',
  'pocao_verde': '🧪',
  'pocao_roxa': '👌',
  'cristal': '💎',
  'livro': '📖',
  'scatter_grimorio': '📜',
  'pedra_filosofal': '☄️'
};

function App() {
  const [loading, setLoading] = useState(false);
  // Inicializamos o grid com 20 espaços para garantir que a estrutura apareça de cara
  const [grid, setGrid] = useState<any[]>(Array(20).fill(null)); 
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState('Pronto para a Alquimia?');

  // Função para rodar a animação de cascata (explosões)
  const animarJogo = async (historico: any[]) => {
    for (const etapa of historico) {
      setGrid(etapa.grid); // Atualiza o grid visual
      if (etapa.resultado.teveVitoria) {
        setStatus(`💥 VITÓRIA! +R$ ${etapa.resultado.premioCascata.toFixed(2)}`);
        await new Promise(r => setTimeout(r, 800)); // Delay para a "explosão"
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

      if (dados.roteiroDoJogo && dados.roteiroDoJogo.jogoBase) {
        // Roda as animações das cascatas
        await animarJogo(dados.roteiroDoJogo.jogoBase.historicoRodada);
        setInfo(dados);
        setStatus(dados.mensagem);
      } else {
        setStatus('Erro na estrutura dos dados da API.');
      }
    } catch (erro) {
      console.error(erro);
      setStatus('Erro ao conectar na API. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#111827', 
      color: 'white', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ color: '#a855f7', marginBottom: '20px', textShadow: '0 0 10px #a855f7' }}>
        🧪 Alquimia Slot
      </h1>

      {/* CONTAINER DO GRID - FORÇADO VIA INLINE STYLE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 80px)', // 5 Colunas
        gridTemplateRows: 'repeat(4, 80px)',    // 4 Linhas
        gap: '12px',
        backgroundColor: '#1f2937',
        padding: '20px',
        borderRadius: '16px',
        border: '4px solid #7c3aed',
        boxShadow: '0 0 30px rgba(0,0,0,0.7)',
        marginBottom: '30px'
      }}>
        {grid.map((simbolo, i) => (
          <div key={i} style={{
            backgroundColor: simbolo?.venceu ? '#4c1d95' : '#0f172a',
            border: simbolo?.venceu ? '2px solid #a855f7' : '1px solid #374151',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            transition: 'all 0.3s ease',
            transform: simbolo?.venceu ? 'scale(1.1)' : 'scale(1)',
            boxShadow: simbolo?.venceu ? '0 0 15px #a855f7' : 'none'
          }}>
            {simbolo ? (SYMBOLS[simbolo.name] || '❓') : ''}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', minHeight: '1.5em', color: '#e5e7eb' }}>
          {status}
        </p>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          <button 
            onClick={() => girarRoleta(false)} 
            disabled={loading}
            style={{ 
              padding: '15px 20px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              backgroundColor: '#4f46e5', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: 'bold',
              transition: '0.2s',
              flex: 1
            }}
          >
            {loading ? '...' : 'JOGAR (R$ 2)'}
          </button>
          
          <button 
            onClick={() => girarRoleta(true)} 
            disabled={loading}
            style={{ 
              padding: '15px 20px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              backgroundColor: '#d97706', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: 'bold',
              transition: '0.2s',
              flex: 1
            }}
          >
            BÔNUS (R$ 200)
          </button>
        </div>
      </div>

      {info && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          borderLeft: '6px solid #a855f7',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>Resumo da Rodada</h3>
          <p style={{ margin: '5px 0' }}>💰 Aposta: R$ {info.resumoFinanceiro.valorApostado.toFixed(2)}</p>
          <p style={{ margin: '5px 0' }}>🎁 Ganho: R$ {info.resumoFinanceiro.premioTotalDaSessao.toFixed(2)}</p>
          <p style={{ 
            margin: '5px 0', 
            fontWeight: 'bold', 
            color: info.resumoFinanceiro.lucroSessao >= 0 ? '#4ade80' : '#f87171' 
          }}>
            {info.resumoFinanceiro.lucroSessao >= 0 ? '✅ LUCRO' : '❌ PREJUÍZO'}: R$ {info.resumoFinanceiro.lucroSessao.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
