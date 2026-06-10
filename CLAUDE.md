CLAUDE.md — MD Project

Arquivo de contexto para o Claude Code.
Leia este arquivo completamente antes de escrever qualquer linha de código.
Em caso de dúvida sobre qualquer decisão: consulte o MD_PROJECT_SKELETON.md.


O Projeto
App pessoal de gestão de vida: finanças, tarefas e ideias.
Roda 100% local via md.local. Usuário único (Brayan). Sem autenticação.
Filosofia: controle total, dados locais, sem dependência externa.

Stack
Backend

Python 3.11+, FastAPI, SQLAlchemy 2.x, Alembic, SQLite, Uvicorn

Frontend

React 18, Vite 5, Tailwind CSS 3, React Router DOM 6, Axios 1.x, Recharts


Estrutura de Pastas
md/
├── backend/
│   ├── app/
│   │   ├── api/          # Rotas — apenas recebem, delegam, retornam
│   │   ├── models/       # Modelos SQLAlchemy
│   │   ├── schemas/      # Schemas Pydantic (entrada e saída)
│   │   ├── services/     # TODA lógica de negócio fica aqui
│   │   └── db/           # Conexão e inicialização do banco
│   ├── alembic/
│   │   └── versions/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env              # NUNCA tocar, NUNCA commitar
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/           # Button, Input, Card, Badge — base reutilizável
│       │   ├── layout/       # Sidebar, Navbar, Layout wrapper
│       │   ├── finances/
│       │   ├── tasks/
│       │   ├── ideas/
│       │   └── dashboard/
│       ├── pages/            # Dashboard, Finances, Tasks, Ideas
│       ├── services/         # api.js — instância Axios + todas as chamadas
│       ├── hooks/            # Custom hooks
│       └── utils/            # Formatação, helpers
│
├── scripts/                  # start.sh, stop.sh, backup.sh
├── systemd/                  # md-backend.service, md-frontend.service
├── CLAUDE.md                 # Este arquivo
├── MD_PROJECT_SKELETON.md    # Referência completa de decisões
└── README.md

Regras Invioláveis
Segurança

NUNCA ler, exibir, modificar ou commitar .env
NUNCA commitar md.db — ambos estão no .gitignore
NUNCA logar ou expor senhas, tokens ou dados sensíveis em nenhum output

Arquitetura

Lógica de negócio sempre em services/ — nunca nas rotas
Rotas apenas: recebem request → chamam service → retornam response
Schema do banco é criado e alterado exclusivamente via Alembic — nunca Base.metadata.create_all(), nunca SQL direto
db/init_db.py serve apenas para seed de dados iniciais (ex: categorias padrão) — nunca para criar tabelas
Antes de qualquer migration destrutiva: executar scripts/backup.sh

Qualidade de Código

Código production-ready desde o início — sem "arrumar depois"
Sem comentários óbvios — código deve ser autoexplicativo
Sem lógica duplicada — extrair para utilitários ou services
Todo endpoint deve ter schema Pydantic de entrada e saída
Tratar erros explicitamente — sem except: pass ou silêncio em falhas

Ambiente e Dependências

Tailwind fixado na v3.x — instalar sempre como tailwindcss@3, nunca migrar para v4
O Claude Code não cria nem ativa venv — apenas mantém o requirements.txt atualizado; o ambiente Python é responsabilidade do Brayan

Fluxo de Trabalho

Não implementar nada além do que foi solicitado na fase atual
Aguardar confirmação antes de avançar para próxima fase
Se houver ambiguidade, perguntar antes de assumir


Módulos
MóduloRota FrontendPrefixo APIDashboard//api/dashboardFinanças/finances/api/financesTarefas/tasks/api/tasksIdeias/ideas/api/ideas

Design
Paleta
TokenHexUsoBackground#0D0D0DFundo principalSurface#161616Cards, painéisSurface Alt#1E1E1EInputs, hover statesBorder#2A2A2ABordas e divisoresText Primary#F0F0F0Títulos e texto principalText Secondary#888888Labels, meta infoAccent#6C63FFAção primária, destaquesAccent Hover#574FCCHover do accentSuccess#3DAA6DConcluído, receita, positivoWarning#F5A623Atenção, prazo próximoDanger#E05C5CErro, atrasado, despesa
Tipografia

Display / Títulos: Inter 700
Corpo: Inter 400/500
Dados / Mono: JetBrains Mono 400

Princípios de UI

Dark mode exclusivo — sem toggle, sem light mode
Sidebar fixa à esquerda com ícones + label
Cards com borda #2A2A2A, sem sombra pesada
Animações mínimas e funcionais — sem efeitos decorativos
Mobile: bottom navigation substituindo sidebar


Ambiente Local
O projeto tem dois modos de execução — não confundir:
Modo Desenvolvimento (Fases 1–5)
ItemValorBackenduvicorn app.main:app --reload → http://localhost:8000Frontendnpm run dev → http://localhost:3000 (hot reload)
Modo Serviço — uso diário (Fase 6)
ItemValorBackendsystemd → Uvicorn em http://localhost:8000Frontendsystemd → vite build + vite preview em http://md.local:3000BootServiços sobem automaticamente ao ligar o computador
Comum aos dois modos
ItemValorCORS originshttp://md.local:3000, http://localhost:3000Bancobackend/md.db

Fases de Desenvolvimento
Implementar uma fase por vez, aguardar revisão e confirmação antes de avançar.
FaseEscopo1 — BaseEstrutura de pastas, FastAPI + SQLite + Alembic, React + Vite + Tailwind, CORS, health check2 — FinançasModels, schemas, rotas, services de transações e categorias; CRUD frontend + gráfico Recharts3 — TarefasModels, schemas, rotas, services de tarefas; CRUD frontend + filtros + alertas de prazo4 — IdeiasModels, schemas, rotas, services de ideias; editor Markdown + captura rápida + vínculo com tarefa5 — DashboardEndpoint /api/dashboard/summary, página de dashboard, streak de uso, índice de progresso6 — InfraScripts shell, systemd, /etc/hosts, teste de boot automático, README final

Referência Completa
Ver MD_PROJECT_SKELETON.md para:

Schema detalhado de todas as entidades
Lista completa de endpoints
Definição de todas as tabelas SQL
Decisões futuras (não implementar agora)