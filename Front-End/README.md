# Medical Shift Schedule — Front-End

Interface React do sistema de gerenciamento de plantões hospitalares, construída com Vite. Suporta três perfis de usuário: **Plantonista** (médico), **Escalista** (gerente de escala) e **Hospital**.

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.2.4 | Framework principal |
| Vite | 8.0.14 | Bundler e dev server |
| React Router DOM | 7.14.1 | Roteamento SPA com rotas protegidas |
| Axios | 1.x | Requisições HTTP |
| FullCalendar | 6.1.20 | Calendário de plantões |
| Lucide React | 1.8.0 | Ícones SVG |
| Framer Motion | 12.38.0 | Animações (instalado, não utilizado ainda) |
| CSS puro | — | Estilização via variáveis CSS globais |

---

## Como Executar

Pré-requisitos: **Node.js** compatível com Vite 8.

```bash
npm install
npm run dev
```

Acesse em `http://localhost:5173`.

Scripts disponíveis:

```bash
npm run dev       # Servidor de desenvolvimento com HMR
npm run build     # Build de produção em dist/
npm run preview   # Serve o build localmente
npm run lint      # Executa ESLint
```

A variável de ambiente `VITE_API_URL` define a URL base da API. Se não configurada, as chamadas vão para `http://localhost:8080` por padrão (ver `src/services/`).

---

## Estrutura de Pastas

```text
src/
├── main.jsx                          # Entry point React
├── App.jsx                           # Roteamento e ProtectedRoute por role
├── index.css                         # Variáveis CSS globais e reset
│
├── assets/                           # Logos e imagens
│
├── utils/
│   ├── validacoes.js                 # Validações: email, senha, telefone, CNPJ, CRM
│   ├── validarCPF.js                 # Validação de CPF (algoritmo)
│   ├── validacoes.css                # Estilos de feedback de validação
│   └── authStorage.js                # Leitura do usuário logado via localStorage
│
├── services/                         # Camada HTTP (axios)
│
└── Components/
    ├── Auth/
    │   └── ProtectedRoute.jsx        # Guarda de rota por role
    ├── Home/                         # Landing page pública
    ├── Login/                        # Autenticação (integrada)
    ├── RecuperarSenha/               # Recuperação de senha (UI pronta)
    ├── CadastroTipo/                 # Seleção: médico ou hospital
    ├── CadastroMedico/               # Cadastro de médico (integrado)
    ├── CadastroHospital/             # Cadastro de hospital (integrado)
    ├── Sidebar/                      # Navegação lateral responsiva
    ├── Footer/                       # Rodapé reutilizável
    │
    ├── UserPlantonista/              # Telas do médico (role: medico)
    │   ├── TelaPrincipal/            # Dashboard com cards e calendário
    │   ├── Agenda/                   # Calendário FullCalendar
    │   │   └── DetalhePlantao/       # Detalhe de um plantão
    │   ├── Perfil/                   # Perfil do médico
    │   ├── Historico/                # Histórico de plantões
    │   ├── Plantoes/
    │   │   ├── PlantoesOfertados/    # Plantões disponíveis para cobertura
    │   │   ├── OferecerPlantao/      # Formulário de oferta
    │   │   └── DetalhesOferta/       # Detalhe de uma oferta
    │   └── ResolucaoConflito/        # Resolução de conflitos de horário
    │
    ├── UserHospital/                 # Telas do hospital (role: hospital)
    │   ├── TelaPrincipal/            # Dashboard com métricas e lista de escalistas
    │   ├── Colaboradores/            # Tabela de escalistas e médicos
    │   ├── Setores/                  # Gestão de setores hospitalares
    │   ├── CadastrarProfissional/    # Cadastro de novo escalista
    │   └── Perfil/                   # Perfil da instituição
    │
    └── UserEscalista/                # Telas do escalista (role: escalista)
        ├── TelaPrincipal/            # Dashboard com calendário e lista de plantões
        ├── CriarPlantao/             # Formulário de criação de plantão
        ├── MedicosSetor/             # Associar/remover médicos do setor
        ├── Delegacao/                # Feed de atividades delegadas
        ├── DetalhePlantonista/       # Perfil e agenda de um médico
        └── Perfil/                   # Perfil do escalista
```

---

## Rotas

### Públicas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Home` | Landing page |
| `/Login` | `Login` | Formulário de autenticação |
| `/CadastroTipo` | `CadastroTipo` | Escolha entre médico e hospital |
| `/CadastroMedico` | `CadastroMedico` | Cadastro de médico |
| `/CadastroHospital` | `CadastroHospital` | Cadastro de hospital |
| `/RecuperarSenha` | `RecuperarSenha` | Recuperação de senha |

### Plantonista — `allowedRoles: ["medico"]`

| Rota | Componente | Descrição |
|---|---|---|
| `/UserPlantonista/TelaPrincipal` | `TelaPrincipal` | Dashboard do médico |
| `/UserPlantonista/Agenda` | `Agenda` | Calendário com FullCalendar |
| `/UserPlantonista/DetalhePlantao/:id` | `DetalhePlantao` | Detalhe de plantão |
| `/UserPlantonista/Perfil` | `PerfilPlantonista` | Perfil do médico |
| `/UserPlantonista/PlantoesOfertados` | `PlantoesOfertados` | Plantões disponíveis para cobertura |
| `/UserPlantonista/OferecerPlantao` | `OferecerPlantao` | Formulário para ofertar plantão |
| `/UserPlantonista/DetalhesOferta` | `DetalhesOferta` | Detalhe de uma oferta |
| `/UserPlantonista/ResolucaoConflito` | `ResolucaoConflito` | Resolução de conflito de horário |

### Hospital — `allowedRoles: ["hospital"]`

| Rota | Componente | Descrição |
|---|---|---|
| `/UserHospital/TelaPrincipal` | `TelaPrincipalHospital` | Dashboard com métricas |
| `/UserHospital/Colaboradores` | `Colaboradores` | Tabela de escalistas e médicos |
| `/UserHospital/Setores` | `Setores` | Gestão de setores |
| `/UserHospital/CadastrarProfissional` | `CadastrarProfissional` | Cadastro de escalista |
| `/UserHospital/Perfil` | `PerfilHospital` | Perfil da instituição |

### Escalista — `allowedRoles: ["escalista"]`

| Rota | Componente | Descrição |
|---|---|---|
| `/UserEscalista/TelaPrincipal` | `TelaPrincipalEscalista` | Dashboard com calendário e plantões |
| `/UserEscalista/CriarPlantao` | `CriarPlantao` | Criação de plantão |
| `/UserEscalista/Medicos` | `MedicosSetor` | Gerenciar médicos por setor |
| `/UserEscalista/Delegacao` | `Delegacao` | Feed de atividades delegadas |
| `/UserEscalista/Perfil` | `PerfilEscalista` | Perfil do escalista |
| `/detalhePlantonista` | `DetalhePlantonista` | Perfil e agenda de médico vinculado |

---

## Autenticação

O fluxo completo de autenticação está integrado com o backend:

1. `POST /auth/login` com `{ email, password }`
2. Backend retorna `{ token, id, name, email, role }`
3. Front salva em `localStorage` e redireciona por role:
   - `medico` → `/UserPlantonista/TelaPrincipal`
   - `hospital` → `/UserHospital/TelaPrincipal`
   - `escalista` → `/UserEscalista/TelaPrincipal`
4. `ProtectedRoute` bloqueia rotas sem token ou com role incorreta
5. Logout limpa `localStorage` e redireciona para `/Login`

Token JWT expira em **2 horas**.

---

## Design System

O projeto usa **CSS puro com variáveis CSS globais** definidas em `index.css`. Não há Tailwind, Bootstrap ou CSS-in-JS.

### Variáveis principais

```css
/* Cores */
--medical-dark: #1f7a63;      /* verde primário */
--medical-dark-alt: #255443;  /* verde escuro para botões de ação */
--medical-teal: #2bbf9c;      /* acento teal */
--medical-mint: #e6faf3;      /* fundo leve */
--app-bg: #edf8f2;            /* fundo de página */
--app-surface: #f8fffb;       /* fundo de card */
--app-panel: #dff1e8;         /* painel/filtro */
--app-input: #d8e7df;         /* fundo de input */
--app-heading: #1e3732;       /* cor de título */
--app-muted: #68807a;         /* texto secundário */

/* Border radius */
--border-radius-sm: 8px;
--border-radius-md: 12px;
--border-radius-lg: 16px;
--border-radius-xl: 20px;
--border-radius-2xl: 28px;
--border-radius-3xl: 34px;

/* Sombras */
--shadow-sm / --shadow-md / --shadow-lg / --shadow-xl

/* Espaçamento */
--spacing-xs / --spacing-sm / --spacing-md / --spacing-lg / --spacing-xl / --spacing-2xl
```

### Utilitários globais

Classes disponíveis em qualquer componente sem importação adicional:

```css
.btn-primary      /* botão verde escuro */
.btn-secondary    /* botão branco com borda */
.btn-danger       /* botão vermelho */
.card             /* card branco com sombra */
.container        /* max-width: 1200px com padding */
```

### Layout com Sidebar

A `Sidebar` é `position: fixed`. O conteúdo de cada página deve compensar com `padding-left: var(--sidebar-width)` no wrapper de layout, e `padding: 40px` no container de conteúdo. No mobile (< 900px), o wrapper remove o padding e o conteúdo adiciona `padding-top: 90px` para o header móvel.

---

## Status de Integração

| Funcionalidade | Status |
|---|---|
| Login com JWT e redirect por role | ✅ Integrado |
| Cadastro de hospital | ✅ Integrado |
| Cadastro de médico | ✅ Integrado |
| Logout | ✅ Integrado |
| Rotas protegidas por role | ✅ Integrado |
| Cadastro de escalista (via hospital) | ✅ Integrado |
| Gestão de setores | ✅ Integrado |
| Criação de plantão | ✅ Integrado |
| Médicos por setor (associar/remover) | ✅ Integrado |
| Agenda do médico | ⚠️ UI pronta — back pronto — front usa mock |
| Dashboard do médico | ⚠️ UI pronta — back pronto — front usa mock |
| Perfil do médico | ⚠️ UI pronta — back pronto — front usa mock |
| Check-in / Check-out | ⚠️ UI pronta — back pronto — não integrado |
| Oferta e cobertura de plantão | ⚠️ UI pronta — back pronto — não integrado |
| Recuperação de senha | ⚠️ UI pronta — back não implementado |
| Conflitos de escala | ❌ Pendente |

---

## Validações de Formulário

Implementadas em `src/utils/validacoes.js`:

- **Email**: formato RFC básico
- **Senha**: mínimo 6 caracteres
- **CPF**: algoritmo de dígitos verificadores (`validarCPF.js`)
- **CNPJ**: algoritmo de dígitos verificadores
- **CRM**: 5 a 8 dígitos numéricos
- **Telefone**: formato `(XX) XXXXX-XXXX` com máscara automática
- **Data de nascimento**: campo obrigatório, formato `YYYY-MM-DD`

CPF e telefone são enviados ao backend **com máscara** no estado atual.

---

## Payloads dos Formulários

Campos que o front-end monta no estado e envia ao backend.

### Login

```json
POST /auth/login
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

O campo local é `senha`, mapeado para `password` no corpo da requisição.

### Cadastro de Médico

```json
POST /doctor/register
{
  "name": "Dr(a). Nome",
  "crm": "123456",
  "uf": "SP",
  "email": "medico@clinica.com.br",
  "cpf": "000.000.000-00",
  "birthday": "1990-01-01",
  "telefone": "(11) 99999-9999",
  "specialty": "Cardiologia",
  "password": "senha123"
}
```

> `cpf` e `telefone` são enviados **com máscara** no estado atual. `confirmaSenha` é removido antes do envio.

### Cadastro de Hospital

```json
POST /hospital
{
  "nomeFantasia": "Hospital Central",
  "cnpj": "00.000.000/0000-00",
  "nomeGestor": "Nome completo",
  "telefone": "(11) 99999-9999",
  "email": "contato@hospital.com.br",
  "password": "senha123"
}
```

> `cnpj` é enviado **com máscara** no estado atual.

---

## Próximos Passos

- [ ] Substituir mock da Agenda por `GET /agenda/doctor/me`
- [ ] Substituir mock do Dashboard por `GET /dashboard/me`
- [ ] Substituir mock do Perfil por `GET /doctor/me/profile`
- [ ] Integrar check-in/check-out (`POST /plantao/{id}/check-in`)
- [ ] Integrar oferta e cobertura de plantões
- [ ] Implementar recuperação de senha (depende de endpoint no back)
- [ ] Padronizar envio de CPF/telefone sem máscara no payload
