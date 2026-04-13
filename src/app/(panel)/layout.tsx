import Link from "next/link";
import Image from "next/image";
import AutoRefresh from "@/app/components/AutoRefresh";

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="main-container">
      {/* Sincronização Automática em segundo plano */}
      <AutoRefresh />

      {/* Menu Lateral Premium */}
      <nav className="sidebar">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Image src="/logo.png" alt="MBI Logo" width={333} height={111} style={{ objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          <Link href="/caixa" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>💰 Caixa</Link>
          <Link href="/arte" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>🎨 Arte</Link>
          <Link href="/impressao" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>🖨️ Impressão</Link>
          <Link href="/producao" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>⚙️ Produção</Link>
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <Link href="/dashboard" className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%', borderColor: 'rgba(34, 197, 94, 0.2)', color: 'var(--color-success)' }}>📊 Painel de Gestão</Link>
            <Link href="/" className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%', marginTop: '0.5rem', fontSize: '0.8rem' }}>🏠 Voltar ao Início</Link>
          </div>
        </div>
      </nav>

      {/* Área de Conteúdo */}
      <main className="content-area">
        <div className="slide-up">
          {children}
        </div>
      </main>
    </div>
  );
}
