import { listarPedidosPorVariosStatus } from '@/app/actions/pedido'
import AtividadeRecente from './AtividadeRecente'

interface MonitorProps {
  statuses: string[]
  titulo: string
}

export default async function MonitorAcompanhamento({ statuses, titulo }: MonitorProps) {
  const pedidos = await listarPedidosPorVariosStatus(statuses)

  const statusLabels: Record<string, { label: string, color: string }> = {
    'CAIXA': { label: 'Aguardando', color: '#9ca3af' },
    'ARTE': { label: 'Em Criação', color: '#3b82f6' },
    'FILA_IMPRESSAO': { label: 'Fila Impressão', color: '#8b5cf6' },
    'IMPRESSAO': { label: 'Imprimindo', color: '#ec4899' },
    'PRODUCAO': { label: 'Produção', color: '#f59e0b' },
    'PRONTO': { label: 'No Balcão', color: '#10b981' }
  }

  return (
    <div className="glass" style={{ padding: '2rem', marginTop: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Lado Esquerdo: Tabela de Pedidos em outros setores */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📡</span>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{titulo}</h3>
          </div>

          {pedidos.length === 0 ? (
            <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Nenhum pedido nestes setores.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '1rem 0.75rem', color: 'var(--color-text-muted)' }}>Cliente</th>
                    <th style={{ padding: '1rem 0.75rem', color: 'var(--color-text-muted)' }}>Status Atual</th>
                    <th style={{ padding: '1rem 0.75rem', color: 'var(--color-text-muted)' }}>Atualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{ fontWeight: 600 }}>{pedido.clienteNome}</div>
                        <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>{pedido.descricao}</div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          background: `${statusLabels[pedido.statusAtual]?.color || '#9ca3af'}22`,
                          color: statusLabels[pedido.statusAtual]?.color || '#9ca3af',
                          border: `1px solid ${statusLabels[pedido.statusAtual]?.color || '#9ca3af'}44`,
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {statusLabels[pedido.statusAtual]?.label || pedido.statusAtual}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(pedido.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lado Direito: Feed de Atividades Recentes */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
          <AtividadeRecente />
        </div>

      </div>
    </div>
  )
}
