import { FormularioCaixa } from './FormularioCaixa'
import { listarPedidos, atualizarStatusPedido, deletarPedido } from '@/app/actions/pedido'
import MonitorAcompanhamento from '@/app/components/MonitorAcompanhamento'

export default async function CaixaPage() {
  const pedidosProntos = await listarPedidos('PRONTO')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 className="h1-premium">Terminal: Caixa</h2>
        <p className="text-muted">Inicie novos fluxos ou finalize a entrega para o cliente.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1.2fr)', gap: '3rem', alignItems: 'start' }}>
        
        {/* Painel Esquerdo: Cadastro Centralizado */}
        <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--color-primary-glow)', padding: '0.75rem', borderRadius: '12px' }}>✨</div>
              <h3 style={{ fontSize: '1.4rem' }}>Novo Pedido</h3>
            </div>
            <FormularioCaixa />
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📱</span>
              <h4 style={{ fontSize: '1rem' }}>Usar no Celular</h4>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              Abra o link abaixo no seu celular (conectado no mesmo Wi-Fi) para instalar o App da MBI.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', wordBreak: 'break-all', color: 'var(--color-primary)', fontWeight: 700 }}>
              http://10.0.0.11:3000/app-mbi
            </div>
          </div>
        </div>

        {/* Painel Direito: Entrega e Gestão */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--color-success)' }}>✅</div>
            <h3 style={{ fontSize: '1.4rem' }}>Prontos para Retirada</h3>
          </div>
          
          {pedidosProntos.length === 0 ? (
            <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>📦</div>
              <p className="text-muted">Nenhum pedido aguardando no balcão.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pedidosProntos.map((pedido: any) => (
                <div key={pedido.id} className="card slide-up" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{pedido.clienteNome}</h4>
                      <p className="text-muted" style={{ fontSize: '0.9rem' }}>{pedido.descricao}</p>
                      {pedido.observacao && (
                        <p style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '0.5rem', fontWeight: 600 }}>
                          📌 {pedido.observacao}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <form action={atualizarStatusPedido.bind(null, pedido.id, 'ENTREGUE')}>
                      <button type="submit" className="btn btn-success" style={{ width: '100%', fontSize: '0.85rem' }}>
                        ✅ Pedido Entregue
                      </button>
                    </form>

                    <form action={deletarPedido.bind(null, pedido.id)}>
                      <button type="submit" className="btn btn-danger" style={{ width: '100%', fontSize: '0.85rem' }}>
                        🗑️ Excluir
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '5rem' }}>
        <MonitorAcompanhamento 
          titulo="Monitor de Produção (Acompanhamento)" 
          statuses={['ARTE', 'FILA_IMPRESSAO', 'IMPRESSAO', 'PRODUCAO']} 
        />
      </div>
    </div>
  )
}
