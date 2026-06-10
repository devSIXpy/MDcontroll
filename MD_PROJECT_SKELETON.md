# MD — Skeleton Completo do Projeto

> Documento de referência completo. Toda decisão tomada antes de escrever uma linha de código.
> Atualizar este arquivo sempre que houver mudança de direção.

---

## 1. Visão Geral

**Nome:** MD
**Tipo:** App pessoal de gestão de vida (finanças, tarefas, ideias)
**Acesso:** Local via navegador — `md.local`
**Usuário:** Solo (apenas Brayan)
**Filosofia:** Controle total, sem dependência externa, dados 100% locais

---

## 2. Objetivos do Projeto

- Registrar e acompanhar finanças do dia a dia
- Gerenciar tarefas, deveres e projetos pessoais
- Capturar e evoluir ideias
- Ter uma visão geral da vida em um único lugar
- Rodar automaticamente ao ligar o computador, sem nenhum comando manual

---

## 3. Stack Técnica

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Python | 3.11+ | Runtime |
| FastAPI | latest | API REST |
| SQLite | nativo | Banco de dados local |
| SQLAlchemy | 2.x | ORM |
| Alembic | latest | Migrations |
| Uvicorn | latest | Servidor ASGI |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | 18.x | UI |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Estilização |
| React Router DOM | 6.x | Navegação |
| Axios | 1.x | HTTP client |
| Recharts | latest | Gráficos |

### Infraestrutura Local
| Item | Solução |
|---|---|
| Banco de dados | SQLite (`md.db`) — arquivo único |
| Serviço automático | systemd (Linux) |
| Hostname local | `md.local` via `/etc/hosts` |
| Porta backend | `8000` |
| Porta frontend | `3000` |
| Backup | Cópia manual do `md.db` |

---

## 4. Estrutura de Pastas

```
md/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── finances.py
│   │   │   ├── tasks.py
│   │   │   ├── ideas.py
│   │   │   └── dashboard.py
│   │   ├── models/
│   │   │   ├── finance.py
│   │   │   ├── task.py
│   │   │   └── idea.py
│   │   ├── schemas/
│   │   │   ├── finance.py
│   │   │   ├── task.py
│   │   │   └── idea.py
│   │   ├── services/
│   │   │   ├── finance_service.py
│   │   │   ├── task_service.py
│   │   │   └── idea_service.py
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── init_db.py
│   │   └── main.py
│   ├── alembic/
│   │   └── versions/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Componentes base (Button, Input, Card, Badge)
│   │   │   ├── layout/          # Sidebar, Navbar, Layout wrapper
│   │   │   ├── finances/        # Componentes do módulo finanças
│   │   │   ├── tasks/           # Componentes do módulo tarefas
│   │   │   ├── ideas/           # Componentes do módulo ideias
│   │   │   └── dashboard/       # Componentes do dashboard
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Finances.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Ideas.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + todas as chamadas
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Formatação, helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── scripts/
│   ├── start.sh                 # Sobe backend + frontend
│   ├── stop.sh                  # Para os serviços
│   └── backup.sh                # Copia md.db com timestamp
│
├── systemd/
│   ├── md-backend.service       # Serviço systemd do backend
│   └── md-frontend.service      # Serviço systemd do frontend
│
├── CLAUDE.md                    # Contexto para o Claude Code
├── MD_PROJECT_SKELETON.md       # Este arquivo
└── README.md
```

---

## 5. Módulos e Funcionalidades

### 5.1 Dashboard
**Rota:** `/`

Visão geral do dia/semana. Responde: *"Como está minha vida agora?"*

- Resumo financeiro do mês (receita, despesa, saldo)
- Tarefas urgentes ou atrasadas
- Últimas ideias capturadas
- Streak de uso (dias consecutivos com registro)
- Índice de progresso de tarefas do período

---

### 5.2 Finanças
**Rota:** `/finances`

#### Entidades
```
Transaction
  - id
  - type: "income" | "expense"
  - amount: float
  - category: string
  - description: string
  - date: date
  - created_at: datetime
```

#### Funcionalidades
- [ ] Registrar receita/despesa
- [ ] Listar transações com filtro por período e categoria
- [ ] Editar e deletar transação
- [ ] Categorias customizáveis
- [ ] Balanço por período (dia, semana, mês)
- [ ] Gráfico de tendência mês a mês
- [ ] Metas financeiras com progresso visual
- [ ] Alerta de padrão (ex: "Gastou 40% mais em alimentação essa semana")
- [ ] Linha do tempo financeira

#### Categorias padrão
Receita: `Salário`, `Freelance`, `Investimento`, `Outros`
Despesa: `Alimentação`, `Transporte`, `Moradia`, `Saúde`, `Lazer`, `Assinatura`, `Educação`, `Outros`

---

### 5.3 Tarefas
**Rota:** `/tasks`

#### Entidades
```
Task
  - id
  - title: string
  - description: string (opcional)
  - status: "pending" | "in_progress" | "done" | "cancelled"
  - priority: "low" | "medium" | "high"
  - due_date: date (opcional)
  - is_recurring: boolean
  - recurrence: "daily" | "weekly" | "monthly" | null
  - project: string (opcional, agrupador livre)
  - created_at: datetime
  - completed_at: datetime (opcional)
```

#### Funcionalidades
- [ ] Criar, editar, deletar tarefa
- [ ] Mudar status com drag or click
- [ ] Filtrar por status, prioridade, projeto
- [ ] Alerta visual de tarefas atrasadas
- [ ] Tarefas recorrentes (geração automática)
- [ ] Log de conclusões (histórico do que foi feito)
- [ ] Agrupar por projeto/área

---

### 5.4 Ideias
**Rota:** `/ideas`

#### Entidades
```
Idea
  - id
  - title: string
  - body: text (Markdown)
  - status: "raw" | "refining" | "planning" | "executing" | "archived"
  - category: string (opcional)
  - linked_task_id: int (opcional, FK para Task)
  - created_at: datetime
  - updated_at: datetime
```

#### Funcionalidades
- [ ] Captura rápida — título em 2 segundos, detalhar depois
- [ ] Editor com suporte a Markdown
- [ ] Evoluir status da ideia
- [ ] Vincular ideia a uma tarefa existente ou criar tarefa a partir da ideia
- [ ] Filtrar por status e categoria
- [ ] Notas livres como espaço de rascunho

---

## 6. Design & Visual Identity

### Paleta de Cores
| Nome | Hex | Uso |
|---|---|---|
| Background | `#0D0D0D` | Fundo principal |
| Surface | `#161616` | Cards, painéis |
| Surface Alt | `#1E1E1E` | Inputs, hover states |
| Border | `#2A2A2A` | Bordas e divisores |
| Text Primary | `#F0F0F0` | Títulos e texto principal |
| Text Secondary | `#888888` | Labels, meta info |
| Accent | `#6C63FF` | Roxo — ação primária, destaques |
| Accent Hover | `#574FCC` | Hover do accent |
| Success | `#3DAA6D` | Concluído, positivo |
| Warning | `#F5A623` | Atenção, prazo próximo |
| Danger | `#E05C5C` | Erro, atrasado, negativo |
| Income | `#3DAA6D` | Receita |
| Expense | `#E05C5C` | Despesa |

### Tipografia
| Papel | Fonte | Peso |
|---|---|---|
| Display / Títulos | `Inter` | 700 |
| Corpo | `Inter` | 400 / 500 |
| Dados / Mono | `JetBrains Mono` | 400 |

### Princípios de UI
- Dark mode apenas — sem toggle, sem light mode
- Sidebar fixa à esquerda com ícones + label
- Cards com bordas sutis (`#2A2A2A`), sem sombra pesada
- Animações mínimas e funcionais — sem efeitos decorativos
- Densidade média — informação visível sem poluição visual
- Mobile: layout colapsa para bottom navigation

---

## 7. Arquitetura de Rotas

### Backend (FastAPI)
```
GET    /api/dashboard/summary

GET    /api/finances/transactions
POST   /api/finances/transactions
PUT    /api/finances/transactions/{id}
DELETE /api/finances/transactions/{id}
GET    /api/finances/categories
POST   /api/finances/categories
GET    /api/finances/goals
POST   /api/finances/goals
PUT    /api/finances/goals/{id}

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
PATCH  /api/tasks/{id}/status

GET    /api/ideas
POST   /api/ideas
PUT    /api/ideas/{id}
DELETE /api/ideas/{id}
PATCH  /api/ideas/{id}/status
```

### Frontend (React Router)
```
/              → Dashboard
/finances      → Lista de transações + resumo
/finances/new  → Formulário de nova transação
/tasks         → Lista de tarefas
/ideas         → Lista de ideias
/ideas/:id     → Detalhe/editor de ideia
```

---

## 8. Banco de Dados (SQLite)

### Arquivo
`backend/md.db` — backup via `scripts/backup.sh`

### Tabelas
```sql
-- Finanças
transactions (id, type, amount, category_id, description, date, created_at)
categories   (id, name, type, color, created_at)
goals        (id, title, target_amount, current_amount, deadline, created_at)

-- Tarefas
tasks        (id, title, description, status, priority, due_date,
              is_recurring, recurrence, project, created_at, completed_at)

-- Ideias
ideas        (id, title, body, status, category, linked_task_id,
              created_at, updated_at)

-- Meta
usage_log    (id, date, created_at)   -- para streak de uso
```

---

## 9. Configuração Local

### `/etc/hosts`
```
127.0.0.1   md.local
```

### Variáveis de Ambiente (`backend/.env`)
```
DATABASE_URL=sqlite:///./md.db
CORS_ORIGINS=http://md.local:3000,http://localhost:3000
```

### systemd — Backend (`systemd/md-backend.service`)
```ini
[Unit]
Description=MD Backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/brayan/md/backend
ExecStart=/home/brayan/md/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### systemd — Frontend (`systemd/md-frontend.service`)
```ini
[Unit]
Description=MD Frontend
After=md-backend.service

[Service]
Type=simple
WorkingDirectory=/home/brayan/md/frontend
ExecStart=/usr/bin/npm run preview -- --host --port 3000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

> **Nota:** O frontend em produção local roda `vite build` + `vite preview`, não `vite dev`.

---

## 10. Fases de Desenvolvimento

### Fase 1 — Base do Projeto
- [ ] Estrutura de pastas
- [ ] Backend: FastAPI + SQLAlchemy + SQLite
- [ ] Alembic configurado com migration inicial
- [ ] Frontend: React + Vite + Tailwind configurados
- [ ] CORS configurado
- [ ] Health check: `GET /api/health`

### Fase 2 — Finanças
- [ ] Models, schemas, rotas e services de transações
- [ ] Categorias padrão seedadas no banco
- [ ] CRUD completo no frontend
- [ ] Gráfico de balanço mensal (Recharts)

### Fase 3 — Tarefas
- [ ] Models, schemas, rotas e services de tarefas
- [ ] CRUD completo no frontend
- [ ] Filtros por status e prioridade
- [ ] Alertas visuais de prazo

### Fase 4 — Ideias
- [ ] Models, schemas, rotas e services de ideias
- [ ] Editor Markdown no frontend
- [ ] Captura rápida
- [ ] Vínculo ideia → tarefa

### Fase 5 — Dashboard
- [ ] Endpoint `/api/dashboard/summary`
- [ ] Página de dashboard com todos os blocos
- [ ] Streak de uso
- [ ] Índice de progresso

### Fase 6 — Infraestrutura Local
- [ ] Scripts `start.sh`, `stop.sh`, `backup.sh`
- [ ] Configuração systemd
- [ ] Configuração `/etc/hosts`
- [ ] Teste de boot automático
- [ ] Documentação no README

---

## 11. Regras Invioláveis

- `.env` nunca no Git
- `md.db` nunca no Git (adicionar ao `.gitignore`)
- Toda lógica fica nos `services/`, nunca nas rotas
- Migrations **sempre** via Alembic, nunca SQL direto
- Backup do `md.db` antes de qualquer migration destrutiva

---

## 12. Decisões Futuras (não implementar agora)

- [ ] Sincronização com celular (quando necessário)
- [ ] Export de dados (CSV/JSON)
- [ ] Modo offline com Service Worker (PWA)
- [ ] Deploy no Vercel/Supabase (migração futura)
- [ ] Módulo de hábitos
- [ ] Integração com calendário
- [ ] Notificações desktop (tarefas atrasadas)

---

*Última atualização: Junho 2026*
