import { useState, useEffect } from 'react';

// Mapeamento dos símbolos
const SYMBOLS: Record<string, string> = {
  'pocao_azul': '👌',
  'pocao_verde': '🧪',
  'pocao_roxa': '😊',
  'cristal': '💎',
  'livro': '📖',
  'scatter_grimorio': '📜',
  'pedra_filosofal': '☄️'
};

function App() {
  const [loading, setLoading] = useState(false);
  const [grid, setGrid] = useState<any[]>(Array(20).fill(null)); 
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState('Aguardando Jogada...');

  // DEBUG: Isso TEM que aparecer no console (F12) assim que a página carregar
  useEffect(() => {
    console.log("%c VIBE CODING ATIVADO - VERSÃO 2.0 COM GRID ", "background: #a855f7; color: white; font-size: 20px;");
    console.log("Estado inicial do Grid:", grid);
  }, []);

  const animarJogo = async (historico: any[]) => {
    console.log("Iniciando animação de cascatas...", historico);
    if (!historico || !Array.isArray(historico)) return;

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

      console.log("Chamando API:", url);
      const resposta = await fetch(url);
      const dados = await resposta.json();
      console.log("Dados recebidos da API:", dados);

      if (dados.roteiroDoJogo?.jogoBase?.historicoRodada) {
        await animarJogo(dados.roteiroDoJogo.jogoBase.historicoRodada);
        setInfo(dados);
        setStatus(dados.mensagem);
      } else {
        console.error("Estrutura de dados inválida:", dados);
        setStatus('Erro na resposta do servidor.');
      }
    } catch (erro) {
      console.error("Erro no Fetch:", erro);
      setStatus('Erro de conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* CABEÇALHO DE TESTE - Se não vir isso, o site não atualizou */}
      <div style={{ background: '#7c3aed', padding: '5px 20px', borderRadius: '20px', marginBottom: '20px', fontSize: '12px' }}>
        DEBUG MODE: INSTÂNCIA ATIVA
      </div>

      <h1 style={{ color: '#a855f7', textShadow: '0 0 15px rgba(168,85,247,0.5)', margin: '0 0 20px 0' }}>
        🧪 Alquimia Slot
      </h1>

      {/* O GRID - Estilizado na marra */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 85px)',
        gridTemplateRows: 'repeat(4, 85px)',
        gap: '12px',
        backgroundColor: '#1e293b',
        padding: '20px',
        borderRadius: '16px',
        border: '5px solid #4c1d95',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        marginBottom: '30px'
      }}>
        {grid.map((simbolo, i) => (
          <div key={i} style={{
            backgroundColor: simbolo?.venceu ? '#5b21b6' : '#0f172a',
            border: simbolo?.venceu ? '2px solid #ddd' : '1px solid #334155',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.8rem',
            transition: 'all 0.3s'
          }}>
            {simbolo ? (SYMBOLS[simbolo.name] || '❓') : ''}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px', color: '#cbd5e1' }}>{status}</p>
        
        <button onClick={() => girarRoleta(false)} disabled={loading} style={{ padding: '15px 30px', margin: '5px', cursor: 'pointer', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px' }}>
          {loading ? '...' : 'JOGAR R$ 2'}
        </button>

        <button onClick={() => girarRoleta(true)} disabled={loading} style={{ padding: '15px 30px', margin: '5px', cursor: 'pointer', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px' }}>
          BÔNUS R$ 200
        </button>
      </div>

      {info && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', borderLeft: '6px solid #a855f7', minWidth: '300px' }}>
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
