# Proximos passos do backend

Este documento registra a ordem recomendada para completar o backend do MedShift, considerando os fluxos principais do sistema: hospital, setores, escalistas, medicos, plantoes, cobertura e notificacoes.

## 1. Plantao avulso (IMPLEMENTADO)

Implementar o fluxo em que o escalista cria um plantao unico para um medico em uma data e horario especificos.

O backend deve validar:

- o usuario logado e um escalista;
- o escalista atua no setor informado;
- o medico possui vinculo ativo com o setor;
- `dataInicio` e anterior a `dataFim`;
- o medico nao possui outro plantao conflitante no mesmo periodo.

Resultado esperado: um registro `PLANTAO` com `tipo = AVULSO`, `status = AGENDADO`, hospital, setor, medico titular, medico responsavel atual e escalista criador.

## 2. Listagens de agenda e calendario

Criar endpoints para consultar plantoes conforme o contexto do usuario logado.

Consultas prioritarias:

- medico visualiza seus plantoes;
- escalista visualiza plantoes dos setores em que atua;
- hospital visualiza plantoes de seus setores;
- filtros por periodo, hospital, setor e status.

Resultado esperado: o frontend consegue montar calendarios reais sem dados mockados.

## 3. Plantao fixo e recorrencia

Implementar `REGRA_PLANTAO_FIXO` para representar plantoes recorrentes.

Casos esperados:

- todo sabado das 07h as 19h;
- todo segundo sabado do mes;
- recorrencia com data de inicio e fim de vigencia;
- geracao de ocorrencias concretas em `PLANTAO`.

Resultado esperado: o sistema separa a regra recorrente das ocorrencias reais exibidas na agenda.

## 4. Pedido de cobertura

Implementar o fluxo em que o medico solicita que outro medico assuma um plantao.

Regras esperadas:

- apenas o medico responsavel atual pode abrir pedido para seu plantao;
- o pedido fica associado ao plantao, hospital, setor e medico solicitante;
- medicos elegiveis do mesmo hospital e setor conseguem visualizar o pedido;
- um medico elegivel pode assumir o plantao;
- ao assumir, `medicoResponsavelAtual` do plantao e atualizado.

Resultado esperado: plantao ofertado aparece no calendario dos medicos elegiveis como pedido de cobertura.

## 5. Controle de concorrencia na cobertura

Garantir que dois medicos nao assumam o mesmo pedido ao mesmo tempo.

Regras esperadas:

- transacao ao assumir pedido;
- verificacao de status `ABERTO` antes de aceitar;
- mudanca atomica para `ASSUMIDO`;
- rejeicao caso o pedido ja tenha sido assumido, cancelado ou expirado.

Resultado esperado: consistencia mesmo com cliques simultaneos.

## 6. Notificacoes

Implementar notificacoes para eventos importantes do sistema.

Prioridade inicial:

- notificar medico solicitante quando outro medico assumir seu pedido de cobertura;
- listar notificacoes do usuario logado;
- marcar notificacao como lida.

Resultado esperado: o medico recebe aviso quando seu plantao for assumido por outro profissional.

## 7. Endpoints de perfil por contexto

Criar endpoints para o frontend buscar dados do usuario logado sem depender apenas do token ou do `localStorage`.

Endpoints recomendados:

- `GET /dashboard/me`;
- `GET /hospital/me`;
- `GET /doctor/me`;
- `GET /manager/me`.

Resultado esperado: o frontend consegue montar cabecalhos, menus e paineis com dados reais e atuais.

## 8. DTOs e padronizacao de respostas

Substituir retornos diretos de entidades JPA por DTOs.

Prioridades:

- hospital;
- medico;
- escalista;
- setor;
- plantao;
- pedido de cobertura;
- notificacao.

Resultado esperado: respostas mais estaveis, sem vazamento de campos internos e sem risco de serializacao circular.

## 9. Tratamento global de erros

Criar um `@ControllerAdvice` para padronizar erros da API.

Mapeamentos esperados:

- `400 Bad Request` para payload invalido ou regra de negocio quebrada;
- `401 Unauthorized` para usuario nao autenticado;
- `403 Forbidden` para usuario sem permissao;
- `404 Not Found` para recurso inexistente;
- `409 Conflict` para conflitos de agenda, email, CRM, CNPJ ou vinculo duplicado.

Resultado esperado: integracao mais previsivel para o frontend e mensagens mais claras para o usuario.

## 10. Regras e constraints no banco

Fortalecer a integridade no banco de dados.

Prioridades:

- unicidade de email em `USUARIO`;
- unicidade de CNPJ em `HOSPITAL`;
- unicidade de CRM em `MEDICO`;
- unicidade logica de vinculo ativo em `MEDICO_SETOR`;
- unicidade logica de vinculo ativo em `ESCALISTA_SETOR`;
- indices para consultas de agenda por hospital, setor, medico e periodo.

Resultado esperado: o banco ajuda a impedir dados duplicados ou inconsistentes.

## 11. Testes de integracao dos fluxos principais

Expandir a cobertura dos testes para os fluxos de negocio completos.

Cenarios prioritarios:

- hospital cadastra setor;
- hospital cadastra escalista;
- hospital vincula escalista a setor;
- medico se cadastra;
- escalista vincula medico a setor;
- escalista cria plantao avulso;
- medico visualiza agenda;
- medico abre pedido de cobertura;
- outro medico assume cobertura;
- notificacao e criada.

Resultado esperado: confianca para evoluir o sistema sem quebrar fluxos essenciais.

## 12. Dashboards reais

Substituir dados mockados por agregacoes reais vindas do backend.

Indicadores iniciais:

- total de setores ativos;
- total de escalistas do hospital;
- total de medicos vinculados;
- total de plantoes no periodo;
- total de pedidos de cobertura abertos;
- proximos plantoes.

Resultado esperado: paineis hospitalar, medico e escalista refletindo o estado real do sistema.
