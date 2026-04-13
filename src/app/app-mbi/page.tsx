'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function AppInstallPage() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    })

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt && !isIOS()) {
      alert("Para instalar, use o menu do Chrome 'Instalar Aplicativo' ou 'Adicionar à tela de início'.")
      return
    }

    setInstalling(true)
    
    // Simulação de progresso premium
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        
        if (installPrompt) {
          installPrompt.prompt()
          installPrompt.userChoice.then((choice: any) => {
            if (choice.outcome === 'accepted') {
              setInstalled(true)
            }
            setInstalling(false)
          })
        } else {
          setInstalling(false)
          alert("Siga as instruções abaixo para instalar no seu iPhone.")
        }
      }
      setProgress(currentProgress)
    }, 400)
  }

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, #1e293b, #0f172a)', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px', borderRadius: '30px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Image 
            src="/logo.png" 
            alt="MBI Logo" 
            width={120} 
            height={120} 
            style={{ borderRadius: '50%', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }} 
          />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sistema MBI</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Gráfica & Comunicação Visual</p>

        {installing ? (
          <div style={{ width: '100%', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Preparando aplicativo... {Math.round(progress)}%</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #3b82f6, #ec4899)',
                transition: 'width 0.4s ease-out'
              }} />
            </div>
          </div>
        ) : installed ? (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '15px', color: '#10b981', fontWeight: 600 }}>
            ✅ Aplicativo Instalado!
          </div>
        ) : (
          <button 
            onClick={handleInstall}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', borderRadius: '15px' }}
          >
            📥 Baixar Aplicativo
          </button>
        )}

        {isIOS() && !installed && (
          <div style={{ marginTop: '2rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '15px' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 700 }}>No iPhone/iPad:</p>
            <ol style={{ textAlign: 'left', paddingLeft: '1.2rem', opacity: 0.8 }}>
              <li>Toque no botão de <b>Compartilhar</b> (quadradinho com seta)</li>
              <li>Role para baixo e selecione <b>"Adicionar à Tela de Início"</b></li>
            </ol>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a href="/caixa" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>
          Acessar versão web
        </a>
      </div>
    </div>
  )
}
