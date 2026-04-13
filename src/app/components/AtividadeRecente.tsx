import { obterHistoricoRecente } from '@/app/actions/pedido'

export default async function AtividadeRecente() {
  const historico = await obterHistoricoRecente()

  return (
    <div className="recent-activity-feed">
      <h3 style={{ fontSize: '0.9rem', color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        🚩 Atividade Recente
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {historico.map((item) => (
          <div key={item.id} className="activity-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {item.pedido.clienteNome}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                {new Date(item.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
              {getFriendlyStatusChange(item.statusOrigem, item.statusDestino)}
            </div>
          </div>
        ))}

        {historico.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Nenhuma atividade ainda.
          </p>
        )}
      </div>
    </div>
  )
}

function getFriendlyStatusChange(origem: string | null, destino: string) {
  if (!origem) return `✨ Pedido cadastrado no Caixa`
  
  const statusMap: Record<string, string> = {
    'CAIXA': 'Caixa',
    'ARTE': 'Arte & Criação',
    'FILA_IMPRESSAO': 'Fila de Impressão',
    'IMPRESSAO': 'Em Impressão',
    'PRODUCAO': 'Produção de Acabamento',
    'FINALIZADO': 'Pedido Entregue'
  }

  const de = statusMap[origem] || origem
  const para = statusMap[destino] || destino

  if (destino === 'FINALIZADO') return `✅ Finalizado e Entregue`
  
  return `🕒 ${de} → ${para}`
}
