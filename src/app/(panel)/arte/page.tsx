import { listarPedidos, atualizarStatusPedido } from '@/app/actions/pedido'
import Image from 'next/image'
import MonitorAcompanhamento from '@/app/components/MonitorAcompanhamento'

export default async function ArtePage() {
  const pedidosNaFila = await listarPedidos('CAIXA')
  const pedidosEmAndamento = await listarPedidos('ARTE')

  return (
    <div className="slide-up">
      <div style={{ marginBottom: '3rem' }}>
        <h2 className="h1-premium">Terminal: Arte & Criação</h2>
        <p className="text-muted">Inicie a criação das artes ou encaminhe arquivos aprovados para a impressão.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        
        {/* Fila de Entrada */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📥</span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Aguardando Designer</h3>
          </div>
          
          {pedidosNaFila.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Fila vazia. Tudo em dia! ✨</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pedidosNaFila.map((pedido: any) => (
                <div key={pedido.id} className="card" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{pedido.clienteNome}</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{pedido.descricao}</p>
                  {pedido.observacao && (
                    <p style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '1.5rem', fontWeight: 500 }}>
                      📌 {pedido.observacao}
                    </p>
                  )}
                  {!pedido.observacao && <div style={{ marginBottom: '1rem' }} />}
                  
                  <form action={atualizarStatusPedido.bind(null, pedido.id, 'ARTE')}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem', gap: '0.5rem' }}>
                      <Image src="/logo.png" alt="MBI" width={20} height={20} style={{ borderRadius: '50%' }} />
                      Iniciar Criação
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Em Andamento */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✏️</span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-secondary)' }}>Em Produção de Arte</h3>
          </div>
          
          {pedidosEmAndamento.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma arte sendo criada agora.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pedidosEmAndamento.map((pedido: any) => (
                <div key={pedido.id} className="card" style={{ padding: '1.5rem', borderColor: 'var(--color-secondary)' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{pedido.clienteNome}</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{pedido.descricao}</p>
                  {pedido.observacao && (
                    <p style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '1.5rem', fontWeight: 500 }}>
                      📌 {pedido.observacao}
                    </p>
                  )}
                  {!pedido.observacao && <div style={{ marginBottom: '1rem' }} />}
                  
                  <form action={atualizarStatusPedido.bind(null, pedido.id, 'FILA_IMPRESSAO')}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem', background: 'linear-gradient(135deg, var(--color-secondary), #be185d)', gap: '0.5rem' }}>
                      <Image src="/logo.png" alt="MBI" width={20} height={20} style={{ borderRadius: '50%' }} />
                      Arte Pronta para Impressão
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
          titulo="Acompanhamento: Para onde foi meu arquivo?" 
          statuses={['FILA_IMPRESSAO', 'IMPRESSAO', 'PRODUCAO']} 
        />
      </div>
    </div>
  )
}
