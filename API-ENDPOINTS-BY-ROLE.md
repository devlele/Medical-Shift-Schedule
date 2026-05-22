# API Endpoints por Perfil - MedShift

Este documento mapeia os endpoints do backend por tipo de usuario que pode acessa-los, com foco em integracao do front-end.

Base URL local esperada:

```text
http://localhost:8080
```

Para rotas privadas, enviar:

```http
Authorization: Bearer <token>
```

## Perfis

- `PUBLICO`: nao exige token.
- `ADMIN`: administrador do sistema.
- `HOSPITAL`: hospital autenticado.
- `ESCALISTA`: escalista autenticado.
- `MANAGER`: alias legado de `ESCALISTA`.
- `MEDICO`: medico autenticado.
- `DOCTOR`: alias legado de `MEDICO`.
- `AUTENTICADO`: qualquer usuario autenticado.

## Rotas Publicas

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `POST` | `/auth/login` | Login unico | `{ token, user }` |
| `POST` | `/hospital` | Cadastro publico de hospital | `HospitalResponse` |
| `POST` | `/doctor/register` | Cadastro publico de medico | `DoctorResponse` |

Observacao: medico cadastrado publicamente ainda nao pertence a hospital/setor ate ser vinculado por um escalista.

## Rotas do Admin

| Metodo | Endpoint | Uso no front/admin | Resposta |
|---|---|---|---|
| `GET` | `/hospital` | Listar hospitais | `HospitalResponse[]` |
| `GET` | `/hospital/{id}` | Buscar hospital | `HospitalResponse` |
| `PUT` | `/hospital/{id}` | Atualizar hospital | `HospitalResponse` |
| `GET` | `/setor/hospital/{hospitalId}` | Listar setores de hospital especifico | `SetorResponse[]` |
| `GET` | `/doctor` | Listar medicos | `DoctorResponse[]` |
| `GET` | `/doctor/{id}` | Buscar medico | `DoctorResponse` |
| `DELETE` | `/**` | Exclusoes gerais nao cobertas por regras especificas | `204` |

Atencao: a regra `DELETE /**` esta liberada apenas para `ADMIN`. Portanto deletes como `/hospital/{id}`, `/setor/{id}`, `/doctor/{id}`, `/manager/{id}` e `/plantao/{id}` ficam efetivamente administrativos, exceto os deletes de vinculos que possuem regras especificas.

## Rotas do Hospital

### Setores

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `POST` | `/setor` | Criar setor do hospital logado | `SetorResponse` |
| `GET` | `/setor` | Listar setores do hospital logado | `SetorResponse[]` |
| `GET` | `/setor/{id}` | Buscar setor do hospital logado | `SetorResponse` |
| `PUT` | `/setor/{id}` | Atualizar setor do hospital logado | `SetorResponse` |

### Escalistas

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `POST` | `/manager` | Criar escalista | `ManagerResponse` |
| `GET` | `/manager` | Listar escalistas do hospital logado | `ManagerResponse[]` |
| `GET` | `/manager/{id}` | Buscar escalista do hospital logado | `ManagerResponse` |
| `PUT` | `/manager/{id}` | Atualizar escalista | `ManagerResponse` |
| `GET` | `/manager/{id}/setores` | Listar setores vinculados ao escalista | `EscalistaSetorResponse[]` |
| `POST` | `/manager/{id}/setores/{setorId}` | Vincular escalista ao setor | `EscalistaSetorResponse` |
| `DELETE` | `/manager/{id}/setores/{setorId}` | Desvincular escalista do setor | `204` |

### Medicos e Agenda

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `GET` | `/doctor` | Listar medicos visiveis para o hospital | `DoctorResponse[]` |
| `GET` | `/doctor/{id}` | Buscar medico | `DoctorResponse` |
| `PUT` | `/doctor/{id}` | Atualizar medico | `DoctorResponse` |
| `GET` | `/agenda/me` | Agenda do hospital logado | `PlantaoSummaryResponse[]` |
| `GET` | `/agenda/setor/{setorId}` | Agenda de setor do hospital | `PlantaoSummaryResponse[]` |
| `GET` | `/agenda/hospital/{hospitalId}` | Agenda de hospital no escopo permitido | `PlantaoSummaryResponse[]` |
| `GET` | `/dashboard/me` | Resumo do hospital logado | `DashboardResponse` |

## Rotas do Escalista

Valem para `ESCALISTA` e `MANAGER`.

### Contexto do Escalista

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `GET` | `/manager/me/setores` | Listar setores em que o escalista atua | `EscalistaSetorResponse[]` |
| `GET` | `/dashboard/me` | Resumo do escalista logado | `DashboardResponse` |

### Medicos do Setor

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `GET` | `/doctor` | Listar medicos vinculados aos setores do escalista | `DoctorResponse[]` |
| `GET` | `/doctor/link-candidates?setorId={id}&termo={texto}` | Buscar medicos candidatos para vinculo | `DoctorLookupResponse[]` |
| `GET` | `/doctor/{id}` | Buscar medico se estiver no escopo | `DoctorResponse` |
| `GET` | `/doctor/{id}/setores` | Listar setores do medico no escopo do escalista | `MedicoSetorResponse[]` |
| `POST` | `/doctor/{id}/setores/{setorId}` | Vincular medico ao setor | `MedicoSetorResponse` |
| `DELETE` | `/doctor/{id}/setores/{setorId}` | Desvincular medico do setor | `204` |
| `PUT` | `/doctor/{id}` | Atualizar medico | `DoctorResponse` |

### Plantoes e Agenda

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `POST` | `/plantao/avulso` | Criar plantao avulso | `PlantaoSummaryResponse` |
| `POST` | `/plantao` | Criar plantao por payload legado | `PlantaoSummaryResponse` |
| `PUT` | `/plantao/{id}` | Atualizar plantao | `PlantaoSummaryResponse` |
| `GET` | `/plantao/{id}` | Buscar plantao | `PlantaoSummaryResponse` |
| `GET` | `/agenda/me` | Agenda dos setores do escalista | `PlantaoSummaryResponse[]` |
| `GET` | `/agenda/setor/{setorId}` | Agenda de setor do escalista | `PlantaoSummaryResponse[]` |
| `GET` | `/agenda/hospital/{hospitalId}` | Agenda do hospital no escopo do escalista | `PlantaoSummaryResponse[]` |

Payload recomendado para `POST /plantao/avulso`:

```json
{
  "setorId": 1,
  "medicoId": 2,
  "data": "2026-05-15",
  "turno": "DIURNO"
}
```

Turnos aceitos:

- `DIURNO` ou `DIA`: 07:00 ate 19:00;
- `NOTURNO` ou `NOITE`: 19:00 ate 07:00 do dia seguinte;
- `PERSONALIZADO`: exige `dataInicio` e `dataFim`.

## Rotas do Medico

Valem para `MEDICO` e `DOCTOR`.

### Perfil

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `GET` | `/doctor/me` | Perfil simples do medico logado | `DoctorResponse` |
| `GET` | `/doctor/me/profile` | Perfil completo do medico logado | `DoctorProfileResponse` |
| `PUT` | `/doctor/me/profile` | Atualizar perfil do medico logado | `DoctorProfileResponse` |
| `POST` | `/doctor/me/profile-photo` | Upload de foto do medico logado | `DoctorProfileResponse` |
| `GET` | `/dashboard/me` | Resumo do medico logado | `DashboardResponse` |

### Agenda

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `GET` | `/agenda/me` | Agenda do medico logado | `PlantaoSummaryResponse[]` |
| `GET` | `/agenda/doctor/me` | Alias de agenda do medico logado | `PlantaoSummaryResponse[]` |
| `GET` | `/agenda/doctor/me/hospital/{hospitalId}` | Agenda do medico filtrada por hospital | `PlantaoSummaryResponse[]` |

### Coberturas

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `POST` | `/coberturas` | Abrir pedido para passar plantao | `PedidoCoberturaResponse` |
| `GET` | `/coberturas/disponiveis` | Listar pedidos disponiveis nos setores do medico | `PedidoCoberturaResponse[]` |
| `GET` | `/coberturas/me` | Listar pedidos criados pelo medico logado | `PedidoCoberturaResponse[]` |
| `POST` | `/coberturas/{id}/assumir` | Assumir cobertura | `PedidoCoberturaResponse` |
| `POST` | `/coberturas/{id}/cancelar` | Cancelar pedido proprio aberto | `PedidoCoberturaResponse` |

### Notificacoes

| Metodo | Endpoint | Uso no front | Resposta |
|---|---|---|---|
| `GET` | `/notificacoes/me` | Listar notificacoes | `NotificacaoResponse[]` |
| `GET` | `/notificacoes/me?apenasNaoLidas=true` | Listar apenas nao lidas | `NotificacaoResponse[]` |
| `POST` | `/notificacoes/{id}/lida` | Marcar notificacao como lida | `NotificacaoResponse` |

## Rotas Compartilhadas Autenticadas

| Metodo | Endpoint | Quem acessa | Uso no front | Observacao |
|---|---|---|---|---|
| `GET` | `/dashboard/me` | `AUTENTICADO` | Dashboard por contexto | O controller retorna dados conforme role |
| `GET` | `/agenda/me` | `MEDICO`, `HOSPITAL`, `ESCALISTA`, `MANAGER`, `DOCTOR` | Agenda principal | Preferir esta rota no front |
| `GET` | `/notificacoes/me` | `AUTENTICADO` | Notificacoes do usuario logado | Usa `Usuario` do token |
| `POST` | `/notificacoes/{id}/lida` | `AUTENTICADO` | Marcar notificacao como lida | So altera notificacao do usuario logado |
| `GET` | `/plantao/{id}` | `AUTENTICADO` | Buscar plantao | Controller restringe hospital/escalista, mas medico ainda cai em busca direta por id |

## Matriz Resumida

| Endpoint/Grupo | Publico | Admin | Hospital | Escalista | Medico |
|---|---:|---:|---:|---:|---:|
| `POST /auth/login` | Sim | Sim | Sim | Sim | Sim |
| `POST /hospital` | Sim | Sim | Sim | Sim | Sim |
| `POST /doctor/register` | Sim | Sim | Sim | Sim | Sim |
| `/hospital` `GET/PUT` | Nao | Sim | Nao | Nao | Nao |
| `/setor` `POST/GET/PUT` | Nao | Parcial | Sim | Nao | Nao |
| `/manager` | Nao | Nao | Sim | Parcial: `/manager/me/setores` | Nao |
| `/doctor` consultas | Nao | Sim | Sim | Sim | Nao, exceto `/doctor/me` |
| `/doctor` vinculos com setor | Nao | Nao | Nao | Sim | Nao |
| `/plantao/avulso` | Nao | Nao | Nao | Sim | Nao |
| `/agenda/me` | Nao | Nao | Sim | Sim | Sim |
| `/coberturas` | Nao | Nao | Nao | Nao | Sim |
| `/notificacoes/me` | Nao | Sim | Sim | Sim | Sim |
| `DELETE /**` geral | Nao | Sim | Nao | Nao | Nao |

## Observacoes de Seguranca

- A regra final `.anyRequest().authenticated()` permite rotas nao mapeadas explicitamente para qualquer usuario autenticado.
- `GET /plantao/{id}` esta autenticado, mas o controller so aplica escopo especial para hospital e escalista. Antes de expor uma tela de detalhes de plantao para medico, recomenda-se endurecer esse endpoint para medico acessar apenas seus proprios plantoes.
- `PUT /doctor/{id}` esta liberado para `MANAGER`, `HOSPITAL` e `ADMIN`, mas o controller atual nao recebe `AuthenticationPrincipal` nesse metodo. Para producao, recomenda-se escopar a atualizacao por hospital/escalista.
- Algumas rotas administrativas existem no controller mas nao sao necessarias para o MVP do front.
- Para o front, prefira sempre as rotas por contexto:
  - `GET /agenda/me`;
  - `GET /dashboard/me`;
  - `GET /doctor/me`;
  - `GET /manager/me/setores`;
  - `GET /notificacoes/me`.

## Ordem Recomendada Para Integracao

1. Auth e protecao de rotas por `role`.
2. Hospital: setores e escalistas.
3. Escalista: setores, busca/vinculo de medicos, criacao de plantao.
4. Agenda por `GET /agenda/me`.
5. Medico: abrir pedido de cobertura.
6. Medico: listar e assumir coberturas disponiveis.
7. Notificacoes.
8. Ajustes visuais de calendario por `turno` e status.

