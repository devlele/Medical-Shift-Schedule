# Medical Shift Schedule - Front-End

Este repositório contém a interface React do sistema Medical Shift Schedule, construída com Vite.

## Visão Geral

A aplicação front-end é uma camada de navegação e visualização para usuários médicos e administrativos. Ela oferece telas de login, cadastro, recuperação de senha, além das seções de agenda, histórico, perfil e gestão de plantões.

### Principais funcionalidades

- Autenticação e fluxo de login
- Cadastro de médicos, hospitais e tipos de plantões
- Agenda visual com filtros e eventos
- Histórico de plantões concluídos
- Perfil do usuário com informações pessoais
- Visualização de plantões ofertados e detalhes
- Navegação entre telas com React Router

## Tecnologias e Stack

| Tecnologia    | Versão     | Uso                                 |
| ------------- | ---------- | ----------------------------------- |
| React         | 19.2.4     | Framework principal                 |
| React Router  | 7.14.1     | Navegação entre páginas/rotas       |
| Vite          | 8.0.13     | Build tool e dev server             |
| FullCalendar  | 6.1.20     | Calendários mensal e diário         |
| Lucide React  | 1.8.0      | Ícones SVG                          |
| Framer Motion | 12.38.0    | Animações opcionais                 |
| CSS Puro      | Sem versão | Estilização, sem Tailwind/Bootstrap |

## Estrutura do Projeto

```text
Front-End/
|-- src/
|   |-- main.jsx              # Entry point
|   |-- App.jsx               # Root component + routes
|   |-- App.css               # Estilos globais
|   |-- index.css             # Reset CSS + variáveis globais
|   |-- Components/
|   |   |-- Login/            # Tela de login
|   |   |-- Home/             # Home pública
|   |   |-- RecuperarSenha/   # Recuperação de senha
|   |   |-- Cadastro*/        # Telas de cadastro: hospital, médico e tipo
|   |   |-- Sidebar/          # Menu lateral reutilizado
|   |   |-- Calendario/       # Componente calendário
|   |   |-- Footer/           # Rodapé reutilizado
|   |   `-- UserPlantonista/  # Seção autenticada
|   |       |-- TelaPrincipal/       # Dashboard
|   |       |-- Perfil/              # Perfil do usuário
|   |       |-- Agenda/              # Calendário semanal/mensal
|   |       |-- Historico/           # Histórico de plantões
|   |       |-- Plantoes/            # Gestão de plantões
|   |       |   |-- PlantoesOfertados.jsx  # Plantões disponíveis
|   |       |   |-- OferecerPlantao.jsx    # Oferta de plantão
|   |       |   `-- DetalhesOferta.jsx     # Detalhes da oferta
|   |       `-- ResolucaoConflito/   # Tela de conflitos
|   |-- services/
|   |   `-- api.js            # Chamadas HTTP com axios/fetch
|   |-- utils/
|   |   |-- validacoes.js     # Validações de formulário
|   |   `-- validarCPF.js     # Validação de CPF específica
|   `-- assets/               # Imagens, logos e ícones
|-- vite.config.js            # Configuração Vite
|-- eslint.config.js          # Regras ESLint
`-- package.json              # Dependências
```

## Estrutura de Telas

Abaixo estão as telas principais e o que cada uma faz.

### 1. Home

Local: `src/Components/Home/Home.jsx`

Conteúdo e função:

- Tela inicial da aplicação.
- Exibe opções para entrar no sistema ou navegar para cadastro.
- Normalmente atua como ponto de partida para novos usuários.

### 2. Login

Local: `src/Components/Login/Login.jsx`

Conteúdo e função:

- Formulário de login com campos de e-mail e senha.
- Envia credenciais ao backend para autenticar o usuário.
- Geralmente redireciona para a tela principal após o login bem-sucedido.

### 3. Recuperar Senha

Local: `src/Components/RecuperarSenha/RecuperarSenha.jsx`

Conteúdo e função:

- Formulário para iniciar o fluxo de recuperação de senha.
- Solicita o e-mail do usuário para envio de instruções.
- Serve para recuperar acesso quando a senha for esquecida.

### 4. Cadastro de Médico

Local: `src/Components/CadastroMedico/CadastroMedico.jsx`

Conteúdo e função:

- Formulário para registrar um novo médico no sistema.
- Coleta dados como nome, especialidade, CRM, e-mail e senha.
- Deve validar campos obrigatórios e garantir unicidade.

### 5. Cadastro de Hospital

Local: `src/Components/CadastroHospital/CadastroHospital.jsx`

Conteúdo e função:

- Formulário para registrar um novo hospital ou unidade.
- Inclui dados de endereço e informações de serviço.
- É parte do fluxo administrativo de cadastro institucional.

### 6. Cadastro de Tipo

Local: `src/Components/CadastroTipo/CadastroTipo.jsx`

Conteúdo e função:

- Tela para cadastrar tipos ou categorias de plantões.
- Pode incluir classificações como urgência, turno ou especialidade.
- Auxilia na organização das ofertas de plantões.

### 7. Tela Principal / Painel de Controle

Local: `src/Components/UserPlantonista/TelaPrincipal/TelaPrincipal.jsx`

Conteúdo e função:

- Painel de controle com resumo de alertas e plantões no mês.
- Mostra cards de estatísticas e lista de próximos plantões.
- Inclui barra lateral de navegação (`Sidebar`).
- Permite acesso rápido a outras seções do usuário.

### 8. Agenda

Local: `src/Components/UserPlantonista/Agenda/Agenda.jsx`

Conteúdo e função:

- Interface de calendário construída com FullCalendar.
- Exibe plantões programados em visão semanal ou mensal.
- Permite filtrar por hospitais e alternar entre modo dia/mês.
- Mostra lista de plantões ao lado do calendário.

### 9. Histórico

Local: `src/Components/UserPlantonista/Historico/Historico.jsx`

Conteúdo e função:

- Lista de plantões anteriores e seus status.
- Permite filtrar por hospital.
- Pagina os registros e exibe informações como data, horário e unidade.
- Ideal para revisão da jornada do profissional.

### 10. Perfil

Local: `src/Components/UserPlantonista/Perfil/Perfil.jsx`

Conteúdo e função:

- Exibe informações do usuário médico.
- Mostra foto, nome, especialidade, CRM e e-mail.
- Apresenta um resumo de histórico recente.
- Permite visualizar dados pessoais de forma organizada.

### 11. Plantões Ofertados

Local: `src/Components/UserPlantonista/Plantoes/PlantoesOfertados.jsx`

Conteúdo e função:

- Exibe plantões atuais que estão disponíveis para aceitar.
- Mostra informações de hospital, turno, data e médico ofertante.
- Possui botões para ver detalhes ou aceitar o plantão.
- Serve como ponto de entrada para intercâmbio de plantões.

### 12. Oferecer Plantão

Local: `src/Components/UserPlantonista/Plantoes/OferecerPlantao.jsx`

Conteúdo e função:

- Tela para disponibilizar um plantão para outros profissionais.
- Permite informar dados da oferta, como data, horário, local e descrição.
- Ajuda no fluxo de troca ou cobertura de plantões.

### 13. Detalhes da Oferta de Plantão

Local: `src/Components/UserPlantonista/Plantoes/DetalhesOferta.jsx`

Conteúdo e função:

- Tela detalhada de uma oferta de plantão.
- Apresenta data, horário, localização e descrição do turno.
- Possui botão para aceitar o plantão.
- Vinculada à lista de plantões ofertados.

## Navegação

A aplicação usa `react-router-dom` para controlar as rotas. As rotas principais estão definidas em `src/App.jsx`.

## Estrutura de Código Relevante

- `src/App.jsx` - configura as rotas e faz o mapeamento das telas.
- `src/services/api.js` - ponto de integração com o backend.
- `src/Components/Sidebar/Sidebar.jsx` - navegação principal usada em telas internas.
- `src/assets/` - imagens e recursos visuais usados em várias telas.
- `src/utils/` - validações e helpers reutilizáveis.

## Como Executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra o navegador em `http://localhost:5173`.

## Próximos Passos Sugeridos

- Conectar os formulários ao backend real.
- Implementar validações adicionais de CPF, e-mail e senha.
- Adicionar proteção de rotas para usuários autenticados.
- Integrar a agenda e o histórico com APIs de plantões.
- Ajustar o layout para responsividade.
