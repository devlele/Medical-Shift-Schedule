# Medical Shift Schedule - Projeto Front-End

## Visão Geral
Este é o projeto front-end em **React + Vite** do Medical Shift Schedule. O app já possui telas visuais para landing page, login, escolha de tipo de cadastro, cadastro de médico, cadastro de hospital/clínica, perfil e painel principal com calendário.

No estado atual, o front-end ainda trabalha com estado local e dados mockados. As telas de login e cadastro fazem validações no navegador, mas ainda nao enviam requisições para o backend. Este documento foca no que existe hoje em `Front-End/` e no que precisa ser conectado primeiro para integrar **cadastros e login**.

## Tecnologias Utilizadas
- **React 19**
- **Vite 8**
- **React Router DOM 7**
- **Lucide React** para ícones
- **React Icons**
- **FullCalendar** para calendário
- **Framer Motion** instalado, mas nao utilizado no estado atual
- **ESLint** com regras para React Hooks e React Refresh

## Estrutura do Projeto
```text
Front-End/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx                         # Entrada React
    ├── App.jsx                          # Rotas da aplicação
    ├── App.css
    ├── index.css
    ├── assets/                          # Logos, imagens e mock visual
    ├── utils/
    │   ├── validacoes.js                # Email, senha, telefone, CNPJ, CRM e formatadores
    │   ├── validarCPF.js                # Validação de CPF
    │   └── validacoes.css               # Estilos compartilhados de erro
    └── Components/
        ├── Home/                        # Landing page
        ├── Login/                       # Tela de login
        ├── CadastroTipo/                # Escolha entre médico e hospital/clínica
        ├── CadastroMedico/              # Formulário de cadastro de médico
        ├── CadastroHospital/            # Formulário de cadastro de hospital/clínica
        ├── TelaPrincipal/               # Dashboard inicial com dados mockados
        ├── Calendario/                  # Wrapper do FullCalendar
        ├── Perfil/                      # Perfil mockado
        ├── Sidebar/                     # Navegação lateral
        └── Footer/                      # Rodapé reutilizável
```

## Rotas Implementadas
| Rota | Componente | Descrição | Status de integração |
|------|------------|-----------|----------------------|
| `/` | `Home` | Landing page com CTA para login/cadastro. | Sem API |
| `/Login` | `Login` | Formulário de login por email e senha. | Pendente |
| `/CadastroTipo` | `CadastroTipo` | Escolha entre médico e hospital/clínica. | Sem API |
| `/CadastroHospital` | `CadastroHospital` | Cadastro/solicitação de hospital ou clínica. | Pendente |
| `/CadastroMedico` | `CadastroMedico` | Cadastro de médico. | Pendente |
| `/Perfil` | `Perfil` | Perfil com dados fixos. | Mockado |
| `/TelaPrincipal` | `TelaPrincipal` | Dashboard com calendário e plantões fixos. | Mockado |

Observações:
- O código usa rotas com maiúsculas em algumas telas (`/Login`, `/Perfil`, `/TelaPrincipal`).
- Existem links na `Sidebar` para `/agenda`, `/plantoes` e `/historico`, mas essas rotas ainda nao estao declaradas em `App.jsx`.
- A `Sidebar` aponta para `/perfil` em minúsculo, enquanto a rota registrada é `/Perfil`.

## Funcionalidades Implementadas

### 1. Landing Page
Componente: `src/Components/Home/Home.jsx`

- Header com logo, botão de login e botão de cadastro.
- Hero com imagem e CTA para cadastro.
- Seção de recursos.
- Cards de planos.
- Nao possui consumo de API.

### 2. Escolha de Tipo de Cadastro
Componente: `src/Components/CadastroTipo/CadastroTipo.jsx`

- Permite escolher entre:
  - Médico: navega para `/CadastroMedico`.
  - Hospital/Clínica: navega para `/CadastroHospital`.
- Nao possui lógica de API.

### 3. Login
Componente: `src/Components/Login/Login.jsx`

Campos atuais:
- `email`
- `senha`
- checkbox visual `lembrar`

Validações atuais:
- Email obrigatório.
- Formato básico de email.
- Senha obrigatória.
- Senha com mínimo de 6 caracteres.

Status atual:
- O submit apenas valida e escreve no console.
- Ainda nao existe `fetch`, `axios`, service HTTP ou armazenamento de token.
- O botão "Entrar" contém um `Link` para `/TelaPrincipal`, entao a navegação nao depende de autenticação real.
- Nao existe tratamento de erro de credenciais inválidas.
- Nao existe redirecionamento por role.

### 4. Cadastro de Médico
Componente: `src/Components/CadastroMedico/CadastroMedico.jsx`

Campos atuais:
- `nome`
- `crm`
- `uf`
- `email`
- `cpf`
- `dataNascimento`
- `telefone`
- `especialidade`
- `senha`
- `confirmaSenha`

Validações atuais:
- Nome obrigatório.
- CRM obrigatório e com 5 a 8 dígitos.
- UF obrigatória.
- Email obrigatório e com formato válido.
- CPF obrigatório e válido.
- Data de nascimento obrigatória.
- Telefone obrigatório e no formato `(XX) XXXXX-XXXX`.
- Especialidade obrigatória.
- Senha obrigatória com mínimo de 6 caracteres.
- Confirmação de senha obrigatória e igual à senha.

Status atual:
- O submit apenas valida e escreve os dados no console.
- Ainda nao chama endpoint de cadastro.
- CPF e telefone sao enviados no estado com máscara, entao será preciso decidir se a API receberá valores formatados ou somente dígitos.
- `dataNascimento` está em formato de input HTML date (`YYYY-MM-DD`).

### 5. Cadastro de Hospital/Clínica
Componente: `src/Components/CadastroHospital/CadastroHospital.jsx`

Campos atuais:
- `nome`
- `cnpj`
- `responsavel`
- `telefone`
- `email`
- `descricao`

Validações atuais:
- Nome da instituição obrigatório.
- CNPJ obrigatório e válido.
- Responsável obrigatório.
- Telefone obrigatório e no formato `(XX) XXXXX-XXXX`.
- Email corporativo obrigatório e válido.
- Descrição obrigatória.

Status atual:
- O submit apenas valida e escreve os dados no console.
- Ainda nao chama endpoint de cadastro.
- Nao há campo de senha para hospital/clínica.
- CNPJ e telefone sao mantidos no estado com máscara.
- Os nomes dos campos precisam ser alinhados com o contrato final do backend antes da integração.

### 6. Dashboard, Calendário e Perfil
Componentes:
- `src/Components/TelaPrincipal/TelaPrincipal.jsx`
- `src/Components/Calendario/Calendario.jsx`
- `src/Components/Perfil/Perfil.jsx`
- `src/Components/Sidebar/Sidebar.jsx`

Status atual:
- `TelaPrincipal` usa lista local de plantões mockados.
- `Calendario` recebe eventos via props e usa FullCalendar.
- `Perfil` exibe dados fixos de exemplo.
- Essas features ficam fora da primeira etapa de integração, que será limitada a cadastros e login.

## Estado Atual da Integração
Legenda:
- **OK**: pronto no front.
- **Parcial**: UI/validação existe, mas falta API ou ajuste de contrato.
- **Pendente**: ainda nao implementado.

| Fluxo | Tela | Estado no front | Integração |
|-------|------|-----------------|------------|
| Login | `/Login` | Parcial | Falta chamar API, salvar token e proteger rotas |
| Cadastro de médico | `/CadastroMedico` | Parcial | Falta chamar API e mapear payload |
| Cadastro de hospital/clínica | `/CadastroHospital` | Parcial | Falta campo senha, chamada API e mapear payload |
| Escolha de tipo | `/CadastroTipo` | OK | Nao exige API |
| Logout | Nao existe | Pendente | Necessário limpar token/sessao |
| Sessao autenticada | Nao existe | Pendente | Necessário contexto/auth service |
| Rotas protegidas | Nao existe | Pendente | Necessário bloquear dashboard/perfil sem token |
| Perfil do usuário logado | `/Perfil` | Mockado | Futuro |
| Plantões/agenda | `/TelaPrincipal` | Mockado | Futuro |

## Pontos de Atenção Para Login e Cadastros

### Login
Payload que a tela consegue montar hoje:
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

O front usa o nome local `senha`, mas para integração pode mapear para `password` no corpo da requisição.

Após login bem-sucedido, o front precisa:
- receber o token;
- salvar o token em `localStorage`, `sessionStorage` ou estado global;
- configurar header `Authorization: Bearer <token>` nas próximas requisições;
- redirecionar para a tela correta;
- exibir erro quando a API retornar credenciais inválidas.

### Cadastro de Médico
Payload bruto disponível no estado atual:
```json
{
  "nome": "Dr(a). Nome",
  "crm": "123456",
  "uf": "SP",
  "email": "medico@clinica.com.br",
  "cpf": "000.000.000-00",
  "dataNascimento": "1990-01-01",
  "telefone": "(11) 99999-9999",
  "especialidade": "Cardiologia",
  "senha": "senha123"
}
```

Decisões necessárias para integrar:
- definir nomes finais dos campos esperados pela API;
- decidir se `cpf` e `telefone` devem ir com máscara ou sem máscara;
- decidir se `uf` deve ser campo separado ou incorporado ao CRM;
- remover `confirmaSenha` do payload enviado;
- tratar respostas de email/CPF/CRM duplicados.

### Cadastro de Hospital/Clínica
Payload bruto disponível no estado atual:
```json
{
  "nome": "Hospital Central",
  "cnpj": "00.000.000/0000-00",
  "responsavel": "Nome completo",
  "telefone": "(11) 99999-9999",
  "email": "contato@hospital.com.br",
  "descricao": "Descrição da necessidade"
}
```

Decisões necessárias para integrar:
- adicionar campo de senha caso o hospital precise autenticar logo após o cadastro;
- definir se `nome` representa nome legal, nome fantasia ou nome público;
- decidir se `cnpj` e `telefone` devem ir com máscara ou sem máscara;
- confirmar se `responsavel` e `descricao` existem no contrato da API ou se sao apenas dados de solicitação comercial;
- tratar respostas de email/CNPJ duplicados.

## Lacunas Técnicas Para a Primeira Integração
1. Criar camada HTTP, por exemplo `src/services/api.js`.
2. Definir variável de ambiente para base URL, por exemplo `VITE_API_URL=http://localhost:8080`.
3. Criar funções de auth/cadastro, por exemplo:
   - `login(email, password)`
   - `registerDoctor(payload)`
   - `registerHospital(payload)`
4. Substituir `console.log` dos submits por chamadas reais.
5. Remover navegação automática do `Link` dentro do botão de login.
6. Salvar token após login.
7. Criar mecanismo simples de rota protegida para `/TelaPrincipal` e `/Perfil`.
8. Exibir mensagens de loading, sucesso e erro nos formulários.
9. Corrigir inconsistências de rotas entre maiúsculas/minúsculas.
10. Padronizar nomes de campos entre front e backend.

## Como Executar
Pré-requisitos:
- Node.js compatível com Vite 8.
- npm.

Comandos:
```bash
cd Front-End
npm install
npm run dev
```

Scripts disponíveis:
```bash
npm run dev      # inicia o servidor Vite
npm run build    # gera build de produção
npm run lint     # executa ESLint
npm run preview  # serve o build localmente
```

## Próximos Passos Recomendados
1. Definir o contrato final dos payloads de login, cadastro de médico e cadastro de hospital.
2. Criar `src/services/api.js` com `fetch` ou instalar/configurar `axios`.
3. Implementar integração real em `Login.jsx`, `CadastroMedico.jsx` e `CadastroHospital.jsx`.
4. Adicionar campo de senha no cadastro de hospital, se necessário para autenticação.
5. Criar armazenamento de token e helper para requisições autenticadas.
6. Implementar rota protegida para telas internas.
7. Ajustar rotas em minúsculas ou padronizar as rotas atuais.
8. Depois da integração de cadastros e login, avançar para perfil, agenda, plantões e calendário usando dados reais da API.
