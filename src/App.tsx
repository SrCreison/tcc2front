import { useState, useEffect } from 'react';

const SYMBOLS: Record<string, string> = {
  'pocao_azul': '🔵',
  'pocao_verde': '🟢',
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
  const [grid, setGrid] = useState<any[]>(Array(30).fill(null)); 
  const [info, setInfo] = useState<any>(null);
  const [status, setStatus] = useState('Aguardando Jogada...');
  const [tumbleWins, setTumbleWins] = useState<any[]>([]);

  const animarCascatas = async (historico: any[]) => {
    if (!historico) return;
    let vitoriasAcumuladas: any[] = [];

    for (const etapa of historico) {
      setGrid(etapa.grid);

      if (etapa.resultado.teveVitoria) {
        const novasVitorias = etapa.resultado.combinacoesVencedoras.map((v: any) => ({
          name: v.simbolo,
          emoji: SYMBOLS[v.simbolo] || '❓',
          quantidade: v.quantidade,
          // AJUSTE AQUI: Se o seu back manda 'premio', usamos 'premio'
          valor: v.premio || v.valor || 0 
        }));

        vitoriasAcumuladas = [...novasVitorias, ...vitoriasAcumuladas];
        setTumbleWins(vitoriasAcumuladas);

        setStatus(`💥 VITÓRIA! +R$ ${(etapa.resultado.premioCascata || 0).toFixed(2)}`);
        await new Promise(r => setTimeout(r, 1000)); 
      } else {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  };

  const animarBonus = async (dadosBonus: any) => {
    if (!dadosBonus || !dadosBonus.giros) return;
    setStatus('🔥 MODO BÔNUS ATIVADO!');
    await new Promise(r => setTimeout(r, 1500)); 

    for (const giro of dadosBonus.giros) {
      setGrid(giro.grid);
      setStatus(`🎁 BÔNUS: Giro ${giro.giro}/10 | Ganho: R$ ${(giro.premio || 0).toFixed(2)}`);
      await new Promise(r => setTimeout(r, 1200)); 
    }
  };

  const girarRoleta = async (comprarBonus: boolean = false) => {
    if (loading) return;
    setLoading(true);
    setInfo(null);
    setTumbleWins([]);
    setStatus('Misturando poções...');

    try {
      const apostaNonce = Math.floor(Math.random() * 999999);
      let url = `https://api-play.abraaodaldon.com.br/api/play?cSeed=User&aposta=${apostaNonce}`;
      if (comprarBonus) url += '&buyBonus=true';

      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (dados.roteiroDoJogo?.jogoBase?.historicoRodada) {
        await animarCascatas(dados.roteiroDoJogo.jogoBase.historicoRodada);
      }

      if (dados.roteiroDoJogo?.jogoBonus) {
        await animarBonus(dados.roteiroDoJogo.jogoBonus);
      }

      setInfo(dados);
      setStatus(dados.mensagem);
    } catch (erro) {
      console.error("Erro no front:", erro);
      setStatus('Erro na API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <h1 style={{ color: '#a855f7', textShadow: '0 0 15px rgba(168,85,247,0.5)' }}>🧪 Alquimia Slot</h1>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* HISTÓRICO LATERAL */}
        <div style={{ width: '180px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', border: '2px solid #334155', minHeight: '415px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>PAGAMENTOS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tumbleWins.length === 0 && <p style={{ fontSize: '0.8rem', color: '#475569', textAlign: 'center' }}>Aguardando...</p>}
            {tumbleWins.map((win, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', padding: '5px', borderRadius: '6px', borderLeft: '3px solid #4ade80' }}>
                <span style={{ fontSize: '1.2rem' }}>{win.emoji}</span>
                <div style={{ fontSize: '0.7rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{win.quantidade}x</div>
                  <div style={{ color: '#4ade80' }}>R$ {(win.valor || 0).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRID COM BORDAS AJUSTADAS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 75px)', 
          gridTemplateRows: 'repeat(5, 75px)',
          gap: '10px',
          backgroundColor: '#1e293b',
          padding: '20px',
          borderRadius: '16px',
          border: '4px solid #4c1d95',
          boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        }}>
          {grid.map((simbolo, i) => (
            <div key={i} style={{
              width: '75px',
              height: '75px',
              backgroundColor: simbolo?.venceu ? '#312e81' : '#0f172a',
              // BORDA MAIS FINA E ELEGANTE
              border: simbolo?.venceu ? '2px solid #fff' : '1px solid #334155',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              transition: 'all 0.3s ease-in-out',
              transform: simbolo?.venceu ? 'scale(1.1)' : 'scale(1)',
              boxShadow: simbolo?.venceu ? '0 0 15px rgba(255,255,255,0.4)' : 'none',
              zIndex: simbolo?.venceu ? 10 : 1
            }}>
              {simbolo ? (SYMBOLS[simbolo.name] || '❓') : ''}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.2rem', minHeight: '1.5em' }}>{status}</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => girarRoleta(false)} disabled={loading} style={{ padding: '15px 30px', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
            {loading ? '...' : 'JOGAR R$ 2'}
          </button>
          <button onClick={() => girarRoleta(true)} disabled={loading} style={{ padding: '15px 30px', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
            BÔNUS R$ 200
          </button>
        </div>
      </div>

      {info && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', borderLeft: '6px solid #a855f7' }}>
          <p>💰 Ganho Total: R$ {(info.resumoFinanceiro.premioTotalDaSessao || 0).toFixed(2)}</p>
          <p style={{ color: info.resumoFinanceiro.lucroSessao >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
            {info.resumoFinanceiro.lucroSessao >= 0 ? '✅ LUCRO' : '❌ PREJUÍZO'}: R$ {(info.resumoFinanceiro.lucroSessao || 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
