import { listarPedidos, atualizarStatusPedido } from '@/app/actions/pedido'

export default async function ProducaoPage() {
  const pedidosEmProducao = await listarPedidos('PRODUCAO')

  return (
    <div className="slide-up">
      <div style={{ marginBottom: '3rem' }}>
        <h2 className="h1-premium">Terminal: Produção & Acabamento</h2>
        <p className="text-muted">Finalize o material físico, faça o corte, montagem e envie para o balcão do Caixa.</p>
      </div>

      <div className="glass" style={{ maxWidth: '800px', padding: '2.5rem', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '2rem' }}>✂️</span>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-purple)' }}>Mesa de Acabamento</h3>
        </div>
        
        {pedidosEmProducao.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p className="text-muted" style={{ fontSize: '1.2rem' }}>Tudo limpo por aqui. ✨</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pedidosEmProducao.map((pedido: any) => (
              <div key={pedido.id} className="card" style={{ 
                background: 'rgba(139, 92, 246, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{pedido.clienteNome}</h4>
                  <p className="text-muted" style={{ marginBottom: '0.5rem' }}>{pedido.descricao}</p>
                  {pedido.observacao && (
                    <p style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 500 }}>
                      📌 {pedido.observacao}
                    </p>
                  )}
                </div>
                
                <form action={atualizarStatusPedido.bind(null, pedido.id, 'PRONTO')}>
                  <button type="submit" className="btn btn-success" style={{ padding: '1.25rem 2rem' }}>
                    ✔️ Finalizar e Avisar Caixa
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
