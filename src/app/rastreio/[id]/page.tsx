import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function RastreioPage(
  props: { params: Promise<{ id: string }> } // Type adjusted for Next.js 15+ Async params
) {
  const { id } = await props.params;

  const pedido = await prisma.pedido.findUnique({
    where: { id },
  })

  if (!pedido) {
    notFound()
  }

  // Definindo as etapas e calculando a atual
  const steps = [
    { label: 'Pedido Recebido', key: 'CAIXA' },
    { label: 'Em Arte/Design', key: 'ARTE' },
    { label: 'Na Impressão', key: 'IMPRESSAO' },
    { label: 'No Acabamento', key: 'PRODUCAO' },
    { label: 'Pronto para Retirar', key: 'PRONTO' },
  ]

  let currentStepIndex = 0
  if (pedido.statusAtual === 'CAIXA') currentStepIndex = 0
  else if (pedido.statusAtual === 'ARTE') currentStepIndex = 1
  else if (pedido.statusAtual === 'FILA_IMPRESSAO' || pedido.statusAtual === 'IMPRESSAO') currentStepIndex = 2
  else if (pedido.statusAtual === 'PRODUCAO') currentStepIndex = 3
  else if (pedido.statusAtual === 'PRONTO' || pedido.statusAtual === 'ENTREGUE') currentStepIndex = 4

  const progressoPorcentagem = ((currentStepIndex) / (steps.length - 1)) * 100

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem'
    }}>
      {/* Header Rastreio */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%', maxWidth: '600px' }}>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          MBI Rastreamento
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Acompanhe o andamento do seu material</p>
      </div>

      {/* Cartão de Detalhes */}
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Olá, {pedido.clienteNome.split(' ')[0]}!</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Material: <span style={{ color: 'white', fontWeight: 500 }}>{pedido.descricao}</span>
          </p>
        </div>

        {/* Barra de Progresso */}
        <div style={{ position: 'relative', marginTop: '3rem', marginBottom: '4rem' }}>
          
          {/* Linha de fundo */}
          <div style={{
            position: 'absolute', top: '15px', left: '10%', right: '10%', height: '4px',
            background: 'var(--color-surface-hover)', zIndex: 0, borderRadius: '4px'
          }}></div>

          {/* Linha preenchida */}
          <div style={{
            position: 'absolute', top: '15px', left: '10%', width: `${progressoPorcentagem * 0.8}%`, height: '4px',
            background: 'var(--color-primary)', zIndex: 1, borderRadius: '4px',
            transition: 'width 0.5s ease'
          }}></div>

          {/* Pontos */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2
          }}>
            {steps.map((step, index) => {
              const completado = index <= currentStepIndex;
              const atual = index === currentStepIndex;
              
              return (
                <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    backgroundColor: completado ? 'var(--color-primary)' : 'var(--color-surface)',
                    border: completado ? 'none' : '3px solid var(--color-surface-hover)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: atual ? '0 0 15px rgba(59, 130, 246, 0.6)' : 'none',
                    transition: 'all 0.3s ease',
                    marginBottom: '0.8rem'
                  }}>
                    {completado && <span style={{ color: 'white', fontSize: '0.8rem' }}>✓</span>}
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: completado ? 'white' : 'var(--color-text-muted)',
                    fontWeight: completado ? 600 : 400,
                    textAlign: 'center',
                    maxWidth: '80px',
                    lineHeight: '1.2'
                  }}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerta de Retirada */}
        {pedido.statusAtual === 'PRONTO' && (
          <div className="animate-fade-in" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--color-success)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-success)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>🎉 Material Pronto!</h3>
            <p style={{ fontSize: '0.9rem', color: '#bbf7d0' }}>Seu pedido já está aguardando você no balcão da MBI.</p>
          </div>
        )}

      </div>
    </div>
  )
}
