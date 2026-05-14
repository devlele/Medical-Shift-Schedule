Até agora, **totalmente funcional e integrado front + back**, temos:

**Cadastro de hospital**
- Front envia para `POST /hospital`.
- Backend cria hospital, valida CNPJ/email duplicado e criptografa senha.
- Tela: `CadastroHospital`.

**Login**
- Front envia email/senha para `POST /auth/login`.
- Backend autentica hospital, escalista ou médico e retorna JWT.
- Front salva o token no `localStorage`.
- Backend agora também retorna dados básicos do usuário no login: `id`, `name`, `email`, `role`.

**Cadastro de médico**
- Front envia para `POST /doctor/register`.
- Backend cria médico, valida CRM/email duplicado, define role `DOCTOR` e criptografa senha.
- Campos extras já suportados no back: `uf`, `telefone`, `fotoPerfilUrl`.

**Logout**
- Front tem botão **Sair** na Sidebar.
- Remove token/dados locais e redireciona para `/Login`.
- Funciona para hospital, escalista e médico porque é logout client-side de JWT.

**Proteção de contexto no backend**
- Hospital só enxerga dados do próprio hospital nas buscas contextuais.
- Escalista só enxerga dados do hospital e setor vinculados ao token.
- Admin fica com buscas gerais.
- Isso foi aplicado para médicos, agenda/plantões e busca de plantão por id.

**Agenda/plantões no backend**
- Backend já possui endpoints funcionais para buscar agenda por:
  - médico logado
  - hospital do token
  - setor do token
  - hospital + setor do escalista
- Retorna DTO resumido próprio para calendário/lista de plantões.
- Observação: o front ainda usa dados mockados em `Agenda.jsx`, então o backend está pronto, mas essa tela ainda não está consumindo a API real.

**Dashboard no backend**
- `GET /dashboard/me` já calcula:
  - plantões do mês
  - conflitos
  - próximos plantões
- Usa contexto do token.
- Observação: `TelaPrincipal.jsx` ainda usa dados mockados, então o backend está pronto, mas o front ainda não consome esse endpoint.

## Decisão de Escopo

- A parte de conflitos e próximos plantões ficará mais direcionada ao médico e ao escalista.
- O médico deverá ser notificado quando houver conflitos relacionados aos seus plantões.
- O escalista também deverá ser notificado quando houver conflitos no setor/hospital que representa.

**Perfil médico no backend**
- `GET /doctor/me/profile`
- `PUT /doctor/me/profile`
- `POST /doctor/me/profile-photo`
- Observação: a tela `Perfil.jsx` ainda está com dados fixos, então o backend está pronto, mas o front ainda não consome esses endpoints.

Então, de ponta a ponta mesmo no front hoje: **cadastro hospital, login, cadastro médico e logout**.  
O restante está funcional no backend, mas ainda falta trocar os mocks do front por chamadas reais.