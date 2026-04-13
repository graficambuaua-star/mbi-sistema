import Link from 'next/link'
import Image from 'next/image'

export default function Launchpad() {
  // Tentativa de pegar o IP da rede local para facilitar o acesso de outros PCs
  const nets = require('os').networkInterfaces();
  const results: any = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  
  const ipAddress = results['Wi-Fi']?.[0] || results['Ethernet']?.[0] || Object.values(results).flat()[0] || 'localhost';

  const setores = [
    { name: 'Caixa', icon: '💰', href: '/caixa', color: 'var(--color-primary)', desc: 'Novos pedidos e entregas' },
    { name: 'Arte', icon: '🎨', href: '/arte', color: '#ec4899', desc: 'Design e aprovação' },
    { name: 'Impressão', icon: '🖨️', href: '/impressao', color: 'var(--color-warning)', desc: 'Produção em máquina' },
    { name: 'Produção', icon: '⚙️', href: '/producao', color: 'var(--color-purple)', desc: 'Acabamento final' },
    { name: 'Gestão', icon: '📊', href: '/dashboard', color: 'var(--color-success)', desc: 'Relatórios e KPIs' },
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="card slide-up" style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '3rem' }}>
          <Image src="/logo.png" alt="MBI Logo" width={555} height={185} style={{ objectFit: 'contain' }} />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {setores.map((setor) => (
            <Link key={setor.name} href={setor.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ 
                padding: '1.5rem', 
                height: '100%', 
                borderBottom: `4px solid ${setor.color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{setor.icon}</span>
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{setor.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{setor.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="glass" style={{ 
          padding: '1.5rem', 
          display: 'inline-block',
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            🌐 ACESSO EM OUTROS COMPUTADORES:
          </p>
          <p style={{ fontSize: '1.2rem', marginTop: '0.5rem', letterSpacing: '1px' }}>
            http://<span style={{ color: 'white', fontWeight: 700 }}>{ipAddress}</span>:3000
          </p>
        </div>
      </div>
    </div>
  )
}
