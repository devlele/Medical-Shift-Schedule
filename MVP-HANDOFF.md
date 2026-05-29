# MVP Handoff - MedShift

Este documento orienta a continuacao do MVP, principalmente a integracao do front-end com o backend atual.

## Objetivo do MVP

Garantir o fluxo principal do sistema:

1. hospital se cadastra e faz login;
2. hospital cria setores;
3. hospital cria escalistas;
4. hospital define um setor responsavel para cada escalista;
5. medico se cadastra e faz login;
6. escalista busca medicos e os vincula a setores;
7. escalista cria plantao avulso para um ou mais medicos do setor;
8. medico visualiza sua agenda;
9. medico abre pedido de cobertura;
10. outro medico do mesmo setor visualiza o pedido;
11. outro medico assume a cobertura;
12. a atribuicao individual do plantao muda de responsavel atual;
13. medico solicitante recebe notificacao.

## Estado Atual do Backend

Implementado:

- Autenticacao JWT centralizada em `Usuario`.
- Login unico em `POST /auth/login`.
- Cadastro publico de hospital em `POST /hospital`.
- Cadastro publico de medico em `POST /doctor/register`.
- Cadastro/listagem/edicao de setores pelo hospital.
- Cadastro/listagem/edicao de escalistas pelo hospital.
- Escalista responsavel por um unico setor.
- Vinculo/desvinculo de medicos a setores por escalista.
- Busca de medicos candidatos para vinculo.
- Criacao de plantao avulso por escalista.
- Criacao de plantao fixo/recorrente por escalista.
- Atribuicao de 1 a 4 medicos no mesmo plantao via `medicoIds`.
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

Definir/trocar setor responsavel do escalista:

```http
POST /manager/{id}/setores/{setorId}
```

Listar setor de um escalista:

```http
GET /manager/{id}/setores
```

Listar setor do escalista logado:

```http
GET /manager/me/setores
```

Desvincular escalista de setor:

```http
DELETE /manager/{id}/setores/{setorId}
```

Observacao: pela regra atual, um escalista ativo deve permanecer associado a um setor. Para trocar o setor, use `POST /manager/{id}/setores/{setorId}` com o novo setor. A remocao direta do setor responsavel atual e bloqueada pelo backend.

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
  "medicoIds": [2, 3],
  "data": "2026-05-15",
  "turno": "DIURNO"
}
```

`medicoId` ainda e aceito por compatibilidade. Para novos fluxos, usar `medicoIds` com no maximo 4 medicos.

Tambem aceita:

```json
{
  "setorId": 1,
  "medicoIds": [2, 3],
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
  "medicoIds": [2, 3],
  "dataInicio": "2026-05-15T08:00:00",
  "dataFim": "2026-05-15T14:00:00"
}
```

Tambem pode enviar:

```json
{
  "setorId": 1,
  "medicoIds": [2, 3],
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
- `medicos`: lista de atribuicoes individuais do plantao, com `id`, medico titular, medico responsavel atual e status.

Regras validadas:

- usuario logado e escalista;
- escalista e responsavel pelo setor informado;
- todos os medicos possuem vinculo ativo com o setor;
- periodo valido;
- nenhum medico possui outro plantao conflitante;
- o plantao possui no maximo 4 medicos.

### 6. Plantoes Fixos

Criar regra fixa/recorrente como escalista:

```http
POST /plantao/fixo
```

Exemplo semanal:

```json
{
  "setorId": 1,
  "medicoIds": [2, 3],
  "tipoRecorrencia": "SEMANAL",
  "diaSemana": "SABADO",
  "turno": "DIURNO",
  "dataInicioVigencia": "2026-05-01",
  "dataFimVigencia": "2026-08-31"
}
```

Exemplo mensal no segundo sabado do mes:

```json
{
  "setorId": 1,
  "medicoIds": [2, 3],
  "tipoRecorrencia": "MENSAL_N_ESIMO_DIA_SEMANA",
  "diaSemana": "SABADO",
  "semanaDoMes": 2,
  "turno": "DIURNO",
  "dataInicioVigencia": "2026-05-01",
  "dataFimVigencia": "2026-12-31"
}
```

Exemplo mensal por dia fixo:

```json
{
  "setorId": 1,
  "medicoIds": [2, 3],
  "tipoRecorrencia": "MENSAL_DIA_FIXO",
  "diaDoMes": 15,
  "turno": "NOTURNO",
  "dataInicioVigencia": "2026-05-01",
  "dataFimVigencia": "2026-12-31"
}
```

Exemplo com horario personalizado:

```json
{
  "setorId": 1,
  "medicoIds": [2, 3],
  "tipoRecorrencia": "SEMANAL",
  "diaSemana": "QUARTA",
  "turno": "PERSONALIZADO",
  "horaInicio": "08:00:00",
  "horaFim": "14:00:00",
  "dataInicioVigencia": "2026-05-01",
  "dataFimVigencia": "2026-08-31"
}
```

Resposta: `PlantaoFixoResponse`, contendo a regra criada e a lista de `PlantaoSummaryResponse` gerados.

Regras validadas:

- usuario logado e escalista;
- escalista e responsavel pelo setor informado;
- todos os medicos possuem vinculo ativo com o setor;
- recorrencia e vigencia validas;
- nenhum medico possui outro plantao conflitante em nenhuma ocorrencia gerada;
- cada plantao gerado possui no maximo 4 medicos;
- geracao inicial limitada a 366 dias;
- se `dataFimVigencia` nao for enviada, a regra fica aberta e o backend gera ocorrencias iniciais para 90 dias.

Tipos de recorrencia:

- `SEMANAL`: exige `diaSemana`;
- `MENSAL_N_ESIMO_DIA_SEMANA`: exige `diaSemana` e `semanaDoMes`;
- `MENSAL_DIA_FIXO`: exige `diaDoMes`.

### 7. Agenda

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
- escalista: retorna plantoes do setor pelo qual e responsavel.

Rotas especificas ainda disponiveis:

```http
GET /agenda/doctor/me
GET /agenda/doctor/me/hospital/{hospitalId}
GET /agenda/setor/{setorId}
GET /agenda/hospital/{hospitalId}
```

Resposta: lista de `PlantaoSummaryResponse`.

### 8. Pedido de Cobertura

Abrir pedido de cobertura como medico responsavel atual por uma atribuicao:

```http
POST /coberturas
```

Payload:

```json
{
  "plantaoId": 10,
  "plantaoMedicoId": 22
}
```

`plantaoMedicoId` vem de `PlantaoSummaryResponse.medicos[].id`. Ele identifica qual vaga/atribuicao daquele plantao esta sendo passada. Se o front enviar apenas `plantaoId`, o backend tenta resolver automaticamente pela atribuicao do medico logado.

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
- o pedido pertence a uma atribuicao individual em `PlantaoMedico`;
- plantao precisa estar `AGENDADO`;
- nao pode haver outro pedido `ABERTO` para a mesma atribuicao;
- apenas medicos do mesmo setor visualizam o pedido;
- solicitante nao pode assumir o proprio pedido;
- medico cobridor nao pode ter conflito de horario;
- ao assumir, `PlantaoMedico.medicoResponsavelAtual` muda para o cobridor;
- ao assumir, solicitante recebe notificacao.

### 9. Notificacoes

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
9. Para trocar o setor do escalista, usar `POST /manager/{id}/setores/{setorId}` com o novo setor.

### Fluxo do escalista

1. Login em `POST /auth/login`.
2. Se `role = ESCALISTA` ou `MANAGER`, direcionar para painel do escalista.
3. Buscar o setor do escalista em `GET /manager/me/setores`.
4. Buscar medicos candidatos em `GET /doctor/link-candidates?setorId={id}&termo={texto}`.
5. Vincular medico ao setor com `POST /doctor/{id}/setores/{setorId}`.
6. Criar plantao avulso com `POST /plantao/avulso`.
7. Criar plantao fixo/recorrente com `POST /plantao/fixo`.
8. Visualizar agenda com `GET /agenda/me`.

### Fluxo do medico

1. Cadastro em `POST /doctor/register`.
2. Login em `POST /auth/login`.
3. Se `role = MEDICO` ou `DOCTOR`, direcionar para painel do medico.
4. Agenda usa `GET /agenda/me`.
5. Para passar plantao, usar `POST /coberturas` com `plantaoId` e, preferencialmente, `plantaoMedicoId`.
6. Para ver plantoes ofertados por outros medicos do mesmo setor, usar `GET /coberturas/disponiveis`.
7. Para assumir, usar `POST /coberturas/{id}/assumir`.
8. Para notificacoes, usar `GET /notificacoes/me`.
9. Para marcar notificacao lida, usar `POST /notificacoes/{id}/lida`.

## Estado Visual Sugerido no Calendario

No front, usar `PlantaoSummaryResponse` para renderizar a agenda.

Sugestao:

- plantao normal do medico: cor neutra/azul;
- plantao fixo: pode usar a mesma cor do plantao normal, diferenciando por legenda ou detalhe;
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
8. Ver setor do escalista.
9. Buscar medico A e medico B como candidatos.
10. Vincular medico A e medico B ao setor.
11. Criar plantao avulso para medico A ou para medico A+B usando `data + turno` e `medicoIds`.
12. Criar plantao fixo para medico A ou para medico A+B usando `POST /plantao/fixo`.
13. Logar como medico A.
14. Ver plantoes em `GET /agenda/me`.
15. Medico A abre pedido de cobertura.
16. Logar como medico B.
17. Medico B ve pedido em `GET /coberturas/disponiveis`.
18. Medico B assume cobertura.
19. `GET /agenda/me` do medico B mostra o plantao assumido.
20. `GET /agenda/me` do medico A nao mostra mais esse plantao como responsavel atual.
21. Medico A ve notificacao em `GET /notificacoes/me`.
22. Medico A marca notificacao como lida.

## Pendente ou Fora do MVP

- Quantidade obrigatoria/exata de medicos por setor ou turno. Hoje ha limite maximo de 4, mas nao obrigatoriedade de exatamente 4.
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
