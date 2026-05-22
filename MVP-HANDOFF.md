# MVP Handoff - MedShift

Este documento orienta a continuacao do MVP, principalmente a integracao do front-end com o backend atual.

## Objetivo do MVP

Garantir o fluxo principal do sistema:

1. hospital se cadastra e faz login;
2. hospital cria setores;
3. hospital cria escalistas;
4. hospital vincula escalistas a setores;
5. medico se cadastra e faz login;
6. escalista busca medicos e os vincula a setores;
7. escalista cria plantao avulso para medico do setor;
8. medico visualiza sua agenda;
9. medico abre pedido de cobertura;
10. outro medico do mesmo setor visualiza o pedido;
11. outro medico assume a cobertura;
12. plantao muda de responsavel atual;
13. medico solicitante recebe notificacao.

## Estado Atual do Backend

Implementado:

- Autenticacao JWT centralizada em `Usuario`.
- Login unico em `POST /auth/login`.
- Cadastro publico de hospital em `POST /hospital`.
- Cadastro publico de medico em `POST /doctor/register`.
- Cadastro/listagem/edicao de setores pelo hospital.
- Cadastro/listagem/edicao de escalistas pelo hospital.
- Vinculo/desvinculo de escalistas a setores.
- Vinculo/desvinculo de medicos a setores por escalista.
- Busca de medicos candidatos para vinculo.
- Criacao de plantao avulso por escalista.
- Plantao por turno:
  - `DIURNO`: 07:00 ate 19:00;
  - `NOTURNO`: 19:00 ate 07:00 do dia seguinte;
  - `PERSONALIZADO`: usa `dataInicio` e `dataFim`.
- Agenda real por contexto do usuario logado.
- Pedido de cobertura.
- Assumir cobertura com validacoes e lock pessimista.
- Notificacao quando cobertura e assumida.
- DTOs estaveis para respostas principais.
- Erros padronizados via `ErrorResponse`.

## Autenticacao

Endpoint:

```http
POST /auth/login
```

Payload:

```json
{
  "email": "hospital@saojoao.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "token": "jwt",
  "user": {
    "id": 1,
    "name": "Hospital Sao Joao",
    "email": "hospital@saojoao.com",
    "role": "HOSPITAL"
  }
}
```

No front, salvar o token e enviar em todas as rotas privadas:

```http
Authorization: Bearer <token>
```

Roles relevantes:

- `ADMIN`
- `HOSPITAL`
- `ESCALISTA`
- `MANAGER` alias legado de escalista
- `MEDICO`
- `DOCTOR` alias legado de medico

## Contrato de Erro

Todas as rotas novas e fluxos principais usam resposta de erro padronizada:

```json
{
  "timestamp": "2026-05-21T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Medico cobridor ja possui plantao conflitante no periodo informado",
  "path": "/coberturas/1/assumir"
}
```

O front deve usar `message` para exibicao ao usuario.

Codigos importantes:

- `400`: payload invalido ou regra de negocio invalida;
- `403`: usuario autenticado, mas sem permissao/escopo;
- `404`: recurso inexistente;
- `409`: conflito de estado, como horario conflitante ou pedido ja assumido;
- `500`: erro inesperado.

## Endpoints Para Integracao

### 1. Hospital

Cadastro publico:

```http
POST /hospital
```

Payload minimo:

```json
{
  "nomeFantasia": "Hospital Sao Joao",
  "cnpj": "12345678000199",
  "telefone": "11999999999",
  "endereco": "Rua Central, 100",
  "nomeGestor": "Carlos Mendes",
  "email": "hospital@saojoao.com",
  "password": "123456"
}
```

Resposta: `HospitalResponse`.

Rotas administrativas existentes:

```http
GET /hospital
GET /hospital/{id}
PUT /hospital/{id}
DELETE /hospital/{id}
```

Observacao: no MVP do front comum, hospital usa principalmente login, setores e escalistas.

### 2. Setores

Criar setor como hospital:

```http
POST /setor
```

Payload:

```json
{
  "nome": "Emergencia",
  "descricao": "Pronto atendimento adulto"
}
```

Listar setores do hospital logado:

```http
GET /setor
```

Buscar setor:

```http
GET /setor/{id}
```

Atualizar setor:

```http
PUT /setor/{id}
```

Resposta: `SetorResponse`.

Campos principais:

- `id`
- `nome`
- `descricao`
- `hospitalId`
- `hospitalNome`
- `ativo`
- `criadoEm`
- `atualizadoEm`

### 3. Escalistas

Criar escalista como hospital:

```http
POST /manager
```

Payload minimo:

```json
{
  "name": "Ana Escalista",
  "email": "ana@hospital.com",
  "password": "123456",
  "cpf": "11122233344",
  "department": "Emergencia",
  "setor": {
    "id": 1
  }
}
```

Listar escalistas do hospital logado:

```http
GET /manager
```

Buscar escalista:

```http
GET /manager/{id}
```

Vincular escalista a setor:

```http
POST /manager/{id}/setores/{setorId}
```

Listar setores de um escalista:

```http
GET /manager/{id}/setores
```

Listar setores do escalista logado:

```http
GET /manager/me/setores
```

Desvincular escalista de setor:

```http
DELETE /manager/{id}/setores/{setorId}
```

Resposta de escalista: `ManagerResponse`.

Resposta de vinculo: `EscalistaSetorResponse`.

### 4. Medicos

Cadastro publico:

```http
POST /doctor/register
```

Payload minimo:

```json
{
  "name": "Dr. Bruno",
  "email": "bruno@med.com",
  "password": "123456",
  "cpf": "22233344455",
  "crm": "12345",
  "specialty": "Clinica Medica",
  "telefone": "11988888888"
}
```

Importante: medico pode se cadastrar publicamente, mas nao fica vinculado a setor/hospital ate um escalista vincular.

Perfil do medico logado:

```http
GET /doctor/me
GET /doctor/me/profile
PUT /doctor/me/profile
```

Listar medicos visiveis para hospital/escalista:

```http
GET /doctor
```

Buscar candidatos para vinculo pelo escalista:

```http
GET /doctor/link-candidates?setorId=1&termo=bruno
```

Vincular medico a setor:

```http
POST /doctor/{id}/setores/{setorId}
```

Listar setores vinculados ao medico:

```http
GET /doctor/{id}/setores
```

Desvincular medico de setor:

```http
DELETE /doctor/{id}/setores/{setorId}
```

Respostas:

- `DoctorResponse`
- `DoctorLookupResponse`
- `MedicoSetorResponse`

### 5. Plantoes Avulsos

Criar plantao avulso como escalista:

```http
POST /plantao/avulso
```

Formato recomendado para plantao padrao:

```json
{
  "setorId": 1,
  "medicoId": 2,
  "data": "2026-05-15",
  "turno": "DIURNO"
}
```

Tambem aceita:

```json
{
  "setorId": 1,
  "medicoId": 2,
  "data": "2026-05-15",
  "turno": "NOTURNO"
}
```

O backend calcula automaticamente:

- `DIURNO`: `07:00` ate `19:00` no mesmo dia;
- `NOTURNO`: `19:00` ate `07:00` do dia seguinte.

Formato personalizado:

```json
{
  "setorId": 1,
  "medicoId": 2,
  "dataInicio": "2026-05-15T08:00:00",
  "dataFim": "2026-05-15T14:00:00"
}
```

Tambem pode enviar:

```json
{
  "setorId": 1,
  "medicoId": 2,
  "turno": "PERSONALIZADO",
  "dataInicio": "2026-05-15T08:00:00",
  "dataFim": "2026-05-15T14:00:00"
}
```

Aliases aceitos para `turno`:

- `DIURNO` ou `DIA`;
- `NOTURNO` ou `NOITE`;
- `PERSONALIZADO`.

Resposta: `PlantaoSummaryResponse`.

Campos importantes:

- `id`
- `type`: `dia`, `noite` ou `personalizado`
- `turno`: `DIURNO`, `NOTURNO` ou `PERSONALIZADO`
- `setor`
- `setorId`
- `hospital`
- `hospitalId`
- `doctor`
- `doctorId`
- `date`
- `dataInicio`
- `dataFim`
- `time`
- `duracaoHoras`
- `status`

Regras validadas:

- usuario logado e escalista;
- escalista atua no setor informado;
- medico possui vinculo ativo com o setor;
- periodo valido;
- medico nao possui outro plantao conflitante.

### 6. Agenda

Endpoint principal recomendado:

```http
GET /agenda/me
```

Com filtro:

```http
GET /agenda/me?dataInicio=2026-05-01T00:00:00&dataFim=2026-05-31T23:59:59
```

Comportamento:

- medico: retorna seus plantoes;
- hospital: retorna plantoes do hospital;
- escalista: retorna plantoes dos setores em que atua.

Rotas especificas ainda disponiveis:

```http
GET /agenda/doctor/me
GET /agenda/doctor/me/hospital/{hospitalId}
GET /agenda/setor/{setorId}
GET /agenda/hospital/{hospitalId}
```

Resposta: lista de `PlantaoSummaryResponse`.

### 7. Pedido de Cobertura

Abrir pedido de cobertura como medico responsavel atual:

```http
POST /coberturas
```

Payload:

```json
{
  "plantaoId": 10,
  "motivo": "Compromisso pessoal"
}
```

Listar pedidos disponiveis para o medico logado:

```http
GET /coberturas/disponiveis
```

Listar pedidos criados pelo medico logado:

```http
GET /coberturas/me
```

Assumir cobertura:

```http
POST /coberturas/{id}/assumir
```

Cancelar pedido aberto:

```http
POST /coberturas/{id}/cancelar
```

Resposta: `PedidoCoberturaResponse`.

Regras:

- apenas medico responsavel atual abre pedido;
- plantao precisa estar `AGENDADO`;
- nao pode haver outro pedido `ABERTO` para o mesmo plantao;
- apenas medicos do mesmo setor visualizam o pedido;
- solicitante nao pode assumir o proprio pedido;
- medico cobridor nao pode ter conflito de horario;
- ao assumir, `Plantao.medicoResponsavelAtual` muda para o cobridor;
- ao assumir, solicitante recebe notificacao.

### 8. Notificacoes

Listar notificacoes do usuario logado:

```http
GET /notificacoes/me
```

Listar apenas nao lidas:

```http
GET /notificacoes/me?apenasNaoLidas=true
```

Marcar como lida:

```http
POST /notificacoes/{id}/lida
```

Resposta: `NotificacaoResponse`.

Quando uma cobertura e assumida, o backend cria uma notificacao para o medico solicitante.

## Sequencia Recomendada no Front

### Fluxo do hospital

1. Tela de cadastro de hospital usa `POST /hospital`.
2. Tela de login usa `POST /auth/login`.
3. Salvar `token` e `user`.
4. Se `role = HOSPITAL`, direcionar para painel hospitalar.
5. Painel hospitalar lista setores com `GET /setor`.
6. Tela de setores cria setor com `POST /setor`.
7. Tela de escalistas lista com `GET /manager`.
8. Criar escalista com `POST /manager`.
9. Opcionalmente vincular escalista a outros setores com `POST /manager/{id}/setores/{setorId}`.

### Fluxo do escalista

1. Login em `POST /auth/login`.
2. Se `role = ESCALISTA` ou `MANAGER`, direcionar para painel do escalista.
3. Buscar setores do escalista em `GET /manager/me/setores`.
4. Buscar medicos candidatos em `GET /doctor/link-candidates?setorId={id}&termo={texto}`.
5. Vincular medico ao setor com `POST /doctor/{id}/setores/{setorId}`.
6. Criar plantao avulso com `POST /plantao/avulso`.
7. Visualizar agenda com `GET /agenda/me`.

### Fluxo do medico

1. Cadastro em `POST /doctor/register`.
2. Login em `POST /auth/login`.
3. Se `role = MEDICO` ou `DOCTOR`, direcionar para painel do medico.
4. Agenda usa `GET /agenda/me`.
5. Para passar plantao, usar `POST /coberturas`.
6. Para ver plantoes ofertados por outros medicos do mesmo setor, usar `GET /coberturas/disponiveis`.
7. Para assumir, usar `POST /coberturas/{id}/assumir`.
8. Para notificacoes, usar `GET /notificacoes/me`.
9. Para marcar notificacao lida, usar `POST /notificacoes/{id}/lida`.

## Estado Visual Sugerido no Calendario

No front, usar `PlantaoSummaryResponse` para renderizar a agenda.

Sugestao:

- plantao normal do medico: cor neutra/azul;
- pedido de cobertura disponivel: vermelho;
- plantao assumido por cobertura: tratar como plantao normal do medico cobridor;
- `turno = DIURNO`: icone/label "Dia";
- `turno = NOTURNO`: icone/label "Noite";
- `turno = PERSONALIZADO`: mostrar horario exato.

Para mostrar pedidos de cobertura no calendario do medico:

1. carregar `GET /agenda/me`;
2. carregar `GET /coberturas/disponiveis`;
3. renderizar os pedidos disponiveis usando o `plantao` embutido em `PedidoCoberturaResponse`;
4. ao clicar em pedido disponivel, abrir modal com botao "Assumir cobertura".

## Checklist Manual do MVP

1. Cadastrar hospital.
2. Logar como hospital.
3. Criar setor.
4. Criar escalista vinculado ao setor.
5. Cadastrar medico A.
6. Cadastrar medico B.
7. Logar como escalista.
8. Ver setores do escalista.
9. Buscar medico A e medico B como candidatos.
10. Vincular medico A e medico B ao setor.
11. Criar plantao avulso para medico A usando `data + turno`.
12. Logar como medico A.
13. Ver plantao em `GET /agenda/me`.
14. Medico A abre pedido de cobertura.
15. Logar como medico B.
16. Medico B ve pedido em `GET /coberturas/disponiveis`.
17. Medico B assume cobertura.
18. `GET /agenda/me` do medico B mostra o plantao assumido.
19. `GET /agenda/me` do medico A nao mostra mais esse plantao como responsavel atual.
20. Medico A ve notificacao em `GET /notificacoes/me`.
21. Medico A marca notificacao como lida.

## Pendente ou Fora do MVP

- Plantao fixo/recorrente.
- Grupo de plantao com quantidade necessaria de medicos por turno.
- Relatorios.
- Dashboards analiticos completos.
- Recuperacao de senha.
- Push notification/websocket.
- Upload de foto refinado.
- Remocao definitiva de campos legados (`DOCTOR`, `MANAGER`, campos antigos em medico/escalista).
- Testes automatizados completos dos fluxos de cobertura.

## Observacoes Para Outra IA

- Nao substituir `dataInicio` e `dataFim`: eles continuam sendo a fonte operacional para conflito, agenda e cobertura.
- `turno` e uma classificacao auxiliar, mas agora tambem ajuda a criar plantao padrao.
- Preferir `GET /agenda/me` no front, pois ele resolve o contexto pelo token.
- Preferir DTOs existentes em vez de expor entidades JPA.
- Antes de integrar uma tela, conferir o role salvo em `auth.user.role`.
- `MEDICO/DOCTOR` e `ESCALISTA/MANAGER` ainda coexistem por compatibilidade.
- Ao tratar erro no front, usar sempre `error.message` da resposta padronizada.
