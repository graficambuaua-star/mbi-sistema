'use client'

import { useState } from 'react'
import { criarPedido } from '@/app/actions/pedido'

export function FormularioCaixa() {
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState<{ id: string, nome: string, celular: string, desc: string } | null>(null)

  async function handleAction(formData: FormData) {
    setLoading(true)
    try {
      const result = await criarPedido(formData)
      
      if (result.success && result.pedidoId) {
        setSuccessData({
          id: result.pedidoId,
          nome: formData.get('clienteNome') as string,
          celular: formData.get('celular') as string,
          desc: formData.get('descricao') as string,
        })
        ;(document.getElementById('form-caixa') as HTMLFormElement).reset()
      } else {
        alert(result.error || 'Ocorreu um erro ao processar o pedido.')
      }
    } catch (e) {
      console.error("Erro na comunicação com o servidor:", e)
      alert('Falha na conexão com o servidor. Por favor, verifique se o sistema está online e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Gera link do WhatsApp Web
  const gerarLinkWhatsapp = () => {
    if (!successData) return "#"
    
    const baseUrl = window.location.origin
    const rastreioUrl = `${baseUrl}/rastreio/${successData.id}`
    
    const texto = `Olá ${successData.nome}! Seu pedido referente a *"${successData.desc}"* deu entrada agora aqui na Gráfica MBI.\n\nVocê pode acompanhar o andamento dele em tempo real por esse link:\n👉 ${rastreioUrl}`
    
    const celularLimpo = successData.celular.replace(/\D/g, '') 
    return `https://wa.me/55${celularLimpo}?text=${encodeURIComponent(texto)}`
  }

  if (successData) {
    return (
      <div className="slide-up" style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
        <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pedido em Produção!</h4>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          O departamento de Arte já recebeu as instruções.
        </p>
        
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(37, 211, 102, 0.05)' }}>
          <p style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
            Ação Obrigatória:
          </p>
          <a 
            href={gerarLinkWhatsapp()} 
            target="_blank" 
            rel="noreferrer"
            className="btn pulse" 
            style={{ 
              backgroundColor: '#25D366', 
              color: 'white', 
              width: '100%',
              fontSize: '1.1rem',
              height: '60px'
            }}
          >
            📱 Enviar Rastreio (WhatsApp)
          </a>
        </div>

        <button 
          onClick={() => setSuccessData(null)}
          className="btn btn-outline" 
          style={{ width: '100%' }}
        >
          Cadastrar Próximo Pedido
        </button>
      </div>
    )
  }

  return (
    <form id="form-caixa" action={handleAction} className="slide-up">
      <div className="input-group">
        <label>Nome do Cliente</label>
        <input name="clienteNome" type="text" placeholder="Ex: João da Silva" required disabled={loading} autoFocus />
      </div>

      <div className="input-group">
        <label>Celular (WhatsApp)</label>
        <input name="celular" type="tel" placeholder="Ex: 11999999999" required disabled={loading} />
      </div>

      <div className="input-group">
        <label>O que o cliente pediu?</label>
        <textarea 
          name="descricao" 
          rows={3} 
          placeholder="Ex: 500 Cartões de Visita Fosco com Verniz Localizado" 
          required 
          disabled={loading}
          style={{ resize: 'none' }}
        />
      </div>

      <div className="input-group">
        <label>Observação (Interno / Opcional)</label>
        <input name="observacao" type="text" placeholder="Ex: Cliente tem pressa / Retirar na quarta" disabled={loading} />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '60px', fontSize: '1.1rem' }} disabled={loading}>
        {loading ? 'Registrando...' : '🚀 Iniciar Pedido Agora'}
      </button>
    </form>
  )
}
