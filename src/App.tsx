import { useState } from 'react';

function App() {
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const girarRoleta = async (comprarBonus: boolean = false) => {
    setCarregando(true);
    setResultado(null);

    try {
      // USANDO A SUA URL DA CLOUDFLARE
      // const baseUrl = 'https://api-play.abraaodaldon.com.br/api/play';
      const baseUrl = window.location.protocol + '//api-play.abraaodaldon.com.br/api/play';
      const aposta = Math.floor(Math.random() * 999999);
      
      // let urlFinal = `${baseUrl}?cSeed=FrontEnd_User&aposta=${aposta}`;
      let urlFinal = `${baseUrl}?cSeed=FrontEnd_User&aposta=${aposta}`;
      if (comprarBonus) urlFinal += '&buyBonus=true';

      const resposta = await fetch(urlFinal);
      const dadosJson = await resposta.json();

      setResultado(dadosJson);
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Erro ao conectar na API. Verifique o console.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ color: '#a855f7' }}>🧪 Alquimia Slot - TCC</h1>
      
      <div style={{ margin: '20px' }}>
        <button 
          onClick={() => girarRoleta(false)} 
          disabled={carregando}
          style={{ padding: '15px 25px', margin: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: 'white' }}
        >
          {carregando ? 'Processando...' : 'JOGADA NORMAL (R$ 2)'}
        </button>

        <button 
          onClick={() => girarRoleta(true)} 
          disabled={carregando}
          style={{ padding: '15px 25px', margin: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: 'white' }}
        >
          {carregando ? 'Processando...' : 'COMPRAR BÔNUS (R$ 200)'}
        </button>
      </div>

      {resultado && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', borderRadius: '12px', backgroundColor: '#2d2d2d', textAlign: 'left', border: '1px solid #444' }}>
          <h2 style={{ color: resultado.roteiroDoJogo.jogoBase.ativouGirosGratis ? '#fbbf24' : '#10b981' }}>
            {resultado.mensagem}
          </h2>
          <hr style={{ borderColor: '#444' }} />
          <p>💰 <strong>Aposta:</strong> R$ {resultado.resumoFinanceiro.valorApostado.toFixed(2)}</p>
          <p>🎁 <strong>Prêmio:</strong> R$ {resultado.resumoFinanceiro.premioTotalDaSessao.toFixed(2)}</p>
          <p>📈 <strong>Resultado:</strong> {resultado.resumoFinanceiro.lucroSessao >= 0 ? '✅ LUCRO' : '❌ PREJUÍZO'}</p>
          <p>📚 <strong>Scatters na tela:</strong> {resultado.roteiroDoJogo.jogoBase.scattersEncontrados}</p>
          
          <p style={{ fontSize: '12px', color: '#888' }}>*Abra o F12 {'>'} Console para ver os hashes e o grid.</p>
        </div>
      )}
    </div>
  );
}

export default App;
