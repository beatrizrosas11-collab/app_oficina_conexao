import { useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const sidebarItems = [
  { id: 'inicio', label: 'Início', icon: '⌂' },
  { id: 'cadastros', label: 'Cadastros', icon: '▤' },
  { id: 'relatorios', label: 'Relatórios', icon: '▥' },
]

const footerItems = [
  { id: 'inicio', label: 'Início', icon: '⌂' },
  { id: 'cadastros', label: 'Cadastros', icon: '▤' },
  { id: 'novo', label: 'Novo', icon: '+' },
  { id: 'perfil', label: 'Perfil', icon: '◉' },
]

const pageCopy = {
  inicio: {
    eyebrow: 'VISÃO GERAL',
    title: 'Bem-vinda à Oficina Conexão',
    description: 'Este é o ambiente inicial do nosso aplicativo de teste.',
  },
  cadastros: {
    eyebrow: 'CADASTROS',
    title: 'Área de cadastros',
    description: 'Esta tela é demonstrativa. O formulário de nome fica na opção Novo.',
  },
  relatorios: {
    eyebrow: 'ACOMPANHAMENTO',
    title: 'Relatórios',
    description: 'Página mockada para validar a navegação entre as áreas do aplicativo.',
  },
  perfil: {
    eyebrow: 'CONTA',
    title: 'Meu perfil',
    description: 'Área de perfil demonstrativa, sem autenticação nesta primeira versão.',
  },
}

export default function App() {
  const [activePage, setActivePage] = useState('novo')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  function navigate(page) {
    setActivePage(page === 'novo' ? 'novo' : page)
    setFeedback(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const normalizedName = name.trim()

    if (!normalizedName) {
      setFeedback({ type: 'error', message: 'Digite seu nome antes de salvar.' })
      return
    }

    setSaving(true)
    setFeedback(null)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('nomes_teste')
          .insert({ nome: normalizedName })

        if (error) throw error

        setFeedback({ type: 'success', message: 'Nome enviado ao Supabase com sucesso!' })
      } else {
        const currentItems = JSON.parse(localStorage.getItem('oficina-conexao-demo') || '[]')
        localStorage.setItem(
          'oficina-conexao-demo',
          JSON.stringify([...currentItems, { nome: normalizedName, created_at: new Date().toISOString() }]),
        )
        setFeedback({
          type: 'demo',
          message: 'Salvo neste navegador em modo demonstração. Configure o Supabase para gravar no banco.',
        })
      }

      setName('')
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Não foi possível salvar. Verifique a conexão com o Supabase.',
      })
    } finally {
      setSaving(false)
    }
  }

  const isFormPage = activePage === 'novo'
  const page = pageCopy[activePage] || pageCopy.inicio

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('inicio')} aria-label="Ir para início">
          <span className="brand-mark">OC</span>
          <span className="brand-copy">
            <strong>Oficina Conexão</strong>
            <small>AMBIENTE DE TESTE</small>
          </span>
        </button>

        <div className="topbar-right">
          <span className={`connection-pill ${isSupabaseConfigured ? 'connected' : 'demo'}`}>
            <span className="status-dot" />
            {isSupabaseConfigured ? 'Supabase configurado' : 'Modo demonstração'}
          </span>
          <div className="avatar" title="Perfil de teste">B</div>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-label">MENU PRINCIPAL</div>
          <nav className="side-nav" aria-label="Menu lateral">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-help">
              <span className="help-icon">?</span>
              <div>
                <strong>Ambiente de teste</strong>
                <small>Versão inicial 1.0</small>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="content-inner">
            <div className="breadcrumb">
              <span>Oficina Conexão</span>
              <span className="breadcrumb-separator">/</span>
              <strong>{isFormPage ? 'Novo cadastro' : page.title}</strong>
            </div>

            {isFormPage ? (
              <>
                <section className="page-heading">
                  <span className="eyebrow">CADASTRO SIMPLES</span>
                  <h1>Vamos começar?</h1>
                  <p>Preencha seu nome no campo abaixo para testar a conexão com o banco de dados.</p>
                </section>

                <section className="form-card">
                  <div className="card-heading">
                    <div className="card-icon">✎</div>
                    <div>
                      <h2>Identificação</h2>
                      <p>Precisamos apenas desta informação.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nome</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      maxLength={120}
                      required
                    />

                    {feedback && (
                      <div className={`feedback ${feedback.type}`} role="status">
                        <span>{feedback.type === 'success' ? '✓' : feedback.type === 'error' ? '!' : 'i'}</span>
                        {feedback.message}
                      </div>
                    )}

                    <div className="form-actions">
                      <span className="secure-note">
                        <span>⌑</span>
                        {isSupabaseConfigured ? 'Conexão segura via Supabase' : 'Demonstração local até configurar o banco'}
                      </span>
                      <button className="primary-button" type="submit" disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar nome'}
                        {!saving && <span aria-hidden="true">→</span>}
                      </button>
                    </div>
                  </form>
                </section>

                <div className="bottom-note">
                  <span className="note-icon">✦</span>
                  <p>Este é um aplicativo inicial. Os demais menus estão disponíveis para testar a navegação.</p>
                </div>
              </>
            ) : (
              <section className="mock-page">
                <span className="eyebrow">{page.eyebrow}</span>
                <h1>{page.title}</h1>
                <p>{page.description}</p>
                <div className="mock-card">
                  <span className="mock-card-icon">✦</span>
                  <div>
                    <strong>Conteúdo demonstrativo</strong>
                    <p>Esta área será desenvolvida nas próximas etapas do projeto.</p>
                  </div>
                </div>
                <button className="primary-button return-button" onClick={() => navigate('novo')}>
                  Ir para o cadastro <span aria-hidden="true">→</span>
                </button>
              </section>
            )}
          </div>
        </main>
      </div>

      <footer className="mobile-footer">
        <nav aria-label="Menu inferior">
          {footerItems.map((item) => (
            <button
              key={item.id}
              className={`footer-item ${(activePage === item.id || (item.id === 'novo' && activePage === 'novo')) ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  )
}
