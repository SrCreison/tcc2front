import type { SpinResponse } from '../types';

interface ResultSummaryProps {
    info: SpinResponse;
}

export function ResultSummary({ info }: ResultSummaryProps) {
    const { premioTotalDaSessao, lucroSessao } = info.resumoFinanceiro;
    const houveLucro = lucroSessao >= 0;

    return (
        <div className="result-summary">
            <p>💰 Ganho total: R$ {premioTotalDaSessao.toFixed(2)}</p>
            <p className={houveLucro ? 'result-summary__profit' : 'result-summary__loss'}>
                {houveLucro ? '✅ Lucro' : '❌ Prejuízo'}: R$ {lucroSessao.toFixed(2)}
            </p>
        </div>
    );
}
