import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function DashboardPage() {
  const pedidosAtivos = await prisma.pedido.findMany({
    where: { 
      statusAtual: {
        notIn: ['ENTREGUE']
      }
    },
    orderBy: { createdAt: 'asc' },
    include: {
      historico: {
        orderBy: { criadoEm: 'desc' },
        take: 1
      }
    }
  })

  const totalFila = pedidosAtivos.filter((p: any) => p.statusAtual === 'CAIXA').length
  const totalArte = pedidosAtivos.filter((p: any) => p.statusAtual === 'ARTE').length
  const totalImpressao = pedidosAtivos.filter((p: any) => p.statusAtual === 'IMPRESSAO' || p.statusAtual === 'FILA_IMPRESSAO').length
  const totalProducao = pedidosAtivos.filter((p: any) => p.statusAtual === 'PRODUCAO').length
  const totalProntos = pedidosAtivos.filter((p: any) => p.statusAtual === 'PRONTO').length

  return (
    <div className="slide-up">
      <div style={{ marginBottom: '3rem' }}>
        <h2 className="h1-premium">Painel de Gestão</h2>
        <p className="text-muted">Visão em tempo real da carga de trabalho em cada departamento.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(59, 130, 246, 0.4)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{totalFila}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Caixa</p>
        </div>
        <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(236, 72, 153, 0.4)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{totalArte}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Arte</p>
        </div>
        <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-warning)' }}>{totalImpressao}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Impressão</p>
        </div>
        <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(139, 92, 246, 0.4)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-purple)' }}>{totalProducao}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Acabamento</p>
        </div>
        <div className="card" style={{ textAlign: 'center', borderBottom: '4px solid var(--color-success)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{totalProntos}</div>
          <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Balcão</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>⌛ Monitoramento de SLA (Atrasos)</h3>
        </div>
        
        {pedidosAtivos.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p className="text-muted">Nenhum pedido em produção. Operação em dia!</p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '1.25rem' }}>Cliente</th>
                  <th style={{ padding: '1.25rem' }}>Setor Atual</th>
                  <th style={{ padding: '1.25rem' }}>Tempo no Setor</th>
                  <th style={{ padding: '1.25rem' }}>Tempo Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidosAtivos.map((pedido: any) => {
                  const tempoNoSetor = pedido.historico[0] 
                    ? formatDistanceToNow(new Date(pedido.historico[0].criadoEm), { locale: ptBR })
                    : '--'
                  
                  const tempoTotal = formatDistanceToNow(new Date(pedido.createdAt), { locale: ptBR })
                  const horasDesdeCriado = (new Date().getTime() - new Date(pedido.createdAt).getTime()) / (1000 * 60 * 60)
                  const isDelayed = horasDesdeCriado > 2 

                  return (
                    <tr key={pedido.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '1.25rem' }}>
                        <div style={{ fontWeight: 600 }}>{pedido.clienteNome}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{pedido.descricao}</div>
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <span className={`status-badge`} style={{ 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white'
                        }}>
                          {pedido.statusAtual}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem', fontSize: '0.9rem' }}>{tempoNoSetor}</td>
                      <td style={{ padding: '1.25rem', fontSize: '0.9rem', color: isDelayed ? 'var(--color-danger)' : 'var(--color-success)' }}>
                        {isDelayed && '⚠️ '} {tempoTotal}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
