import { listarPedidos, atualizarStatusPedido } from '@/app/actions/pedido'
import MonitorAcompanhamento from '@/app/components/MonitorAcompanhamento'

export default async function ImpressaoPage() {
  const pedidosNaFila = await listarPedidos('FILA_IMPRESSAO')
  const pedidosEmAndamento = await listarPedidos('IMPRESSAO')

  return (
    <div className="slide-up">
      <div style={{ marginBottom: '3rem' }}>
        <h2 className="h1-premium">Terminal: Impressão</h2>
        <p className="text-muted">Acompanhe a fila vinda da arte e controle o que está rodando nas máquinas.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        
        {/* Fila de Arte Pronta */}
        <div className="glass" style={{ padding: '2rem', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📄</span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-warning)' }}>Fila para Impressão</h3>
          </div>
          
          {pedidosNaFila.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Aguardando arquivos da arte...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pedidosNaFila.map((pedido: any) => (
                <div key={pedido.id} className="card" style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.03)' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{pedido.clienteNome}</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{pedido.descricao}</p>
                  {pedido.observacao && (
                    <p style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '1rem', fontWeight: 500 }}>
                      📌 {pedido.observacao}
                    </p>
                  )}
                  {!pedido.observacao && <div style={{ marginBottom: '1rem' }} />}
                  
                  <form action={atualizarStatusPedido.bind(null, pedido.id, 'IMPRESSAO')}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem', background: 'linear-gradient(135deg, var(--color-warning), #d97706)' }}>
                      ▶️ Colocar para Rodar
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maquinas Rodando */}
        <div className="glass" style={{ padding: '2rem', background: 'rgba(30, 41, 59, 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Rodando na Máquina</h3>
          </div>
          
          {pedidosEmAndamento.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma máquina em operação.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pedidosEmAndamento.map((pedido: any) => (
                <div key={pedido.id} className="card pulse" style={{ padding: '1.5rem', borderColor: 'var(--color-warning)' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{pedido.clienteNome}</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>{pedido.descricao}</p>
                  
                  <form action={atualizarStatusPedido.bind(null, pedido.id, 'PRODUCAO')}>
                    <button type="submit" className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>
                      ⏭️ Mandar para Acabamento
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '5rem' }}>
        <MonitorAcompanhamento 
          titulo="Acompanhamento: No Acabamento / Produção" 
          statuses={['PRODUCAO']} 
        />
      </div>
    </div>
  )
}
