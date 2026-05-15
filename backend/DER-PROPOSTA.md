# Proposta de DER - Medical Shift Schedule

Este documento descreve uma modelagem relacional recomendada para o software de gestao de plantoes medicos. A proposta considera o modelo atual do backend, mas corrige alguns pontos importantes para suportar as regras de negocio descritas.

## Principios da modelagem

1. O hospital e a unidade organizacional cadastrada pelo `ADMIN`.
2. O hospital, apos receber credenciais, cadastra setores e escalistas.
3. Escalistas e medicos podem estar vinculados a setores especificos.
4. A visibilidade de plantoes ofertados para cobertura depende dos setores aos quais o medico esta vinculado.
5. Plantoes avulsos sao ocorrencias unicas.
6. Plantoes fixos devem ser modelados como uma regra recorrente que gera ocorrencias concretas de plantao.
7. Pedido de cobertura nao deve ser apenas um status do plantao, pois tem ciclo de vida proprio: abertura, exibicao para medicos elegiveis, acao de assumir, cancelamento, expiracao e notificacao.

## Revisao critica do modelo atual

O modelo atual ja possui os conceitos centrais: `Hospital`, `Setor`, `Manager`, `Doctor` e `Plantao`. Para a especificacao completa, eu ajustaria principalmente estes pontos:

- `Doctor -> Setor` como `ManyToOne` e insuficiente, porque um medico pode pertencer a mais de um setor.
- `Manager -> Setor` como `ManyToOne` tambem limita o caso em que o hospital queira vincular um escalista a mais de um setor.
- `Plantao` mistura a ocorrencia concreta com a ideia de recorrencia. Plantao fixo precisa de uma entidade propria para representar a regra.
- `tb_plantao_interest` registra interesse, mas o fluxo descrito e mais direto: um medico abre o pedido, outro medico elegivel assume, o pedido fecha e o solicitante e notificado.
- `PlantaoStatus.PENDING_INTEREST` tende a virar ambiguidade: o plantao esta pendente ou o pedido de cobertura esta pendente? Eu manteria status de cobertura em entidade propria.

## Entidades principais

### Usuario

Representa uma conta autenticavel no sistema.

Campos sugeridos:

- `id`
- `nome`
- `email`
- `senha_hash`
- `cpf`
- `data_nascimento`
- `role`: `ADMIN`, `HOSPITAL`, `ESCALISTA`, `MEDICO`
- `ativo`
- `criado_em`
- `atualizado_em`

Observacao: o backend atual separa `Hospital`, `Manager` e `Doctor` como usuarios autenticaveis. Isso funciona em projetos menores, mas a longo prazo uma tabela base de usuario simplifica autenticacao, auditoria, permissoes e unicidade de email.

### Hospital

Representa a instituicao hospitalar.

Campos sugeridos:

- `id`
- `usuario_id`: conta usada pelo hospital para login administrativo
- `nome_fantasia`
- `razao_social`
- `cnpj`
- `endereco`
- `nome_gestor`
- `criado_por_admin_id`
- `criado_em`
- `atualizado_em`

Relacionamentos:

- Um `ADMIN` cadastra muitos hospitais.
- Um `Hospital` possui muitos setores.
- Um `Hospital` possui muitos escalistas.
- Um `Hospital` possui muitos medicos.

### Setor

Representa uma area operacional do hospital, por exemplo UTI, Pronto Socorro ou Pediatria.

Campos sugeridos:

- `id`
- `hospital_id`
- `nome`
- `descricao`
- `ativo`
- `criado_em`
- `atualizado_em`

Relacionamentos:

- Um `Hospital` possui muitos `Setor`.
- Um `Setor` possui muitos escalistas por meio de `EscalistaSetor`.
- Um `Setor` possui muitos medicos por meio de `MedicoSetor`.
- Um `Setor` possui muitos plantoes.

### Escalista

Representa o profissional responsavel por montar escalas e atribuir plantoes.

Campos sugeridos:

- `id`
- `usuario_id`
- `hospital_id`
- `cargo`
- `ativo`
- `criado_em`
- `atualizado_em`

Relacionamentos:

- Um `Hospital` possui muitos `Escalista`.
- Um `Escalista` pode estar vinculado a muitos setores por `EscalistaSetor`.
- Um `Escalista` cria regras de plantao fixo.
- Um `Escalista` cria plantoes avulsos.

### EscalistaSetor

Tabela associativa que define em quais setores o escalista pode atuar.

Campos sugeridos:

- `id`
- `escalista_id`
- `setor_id`
- `ativo`
- `vinculado_em`

Restricoes recomendadas:

- Unico por `escalista_id + setor_id`.
- O setor deve pertencer ao mesmo hospital do escalista.

### Medico

Representa o profissional que recebe plantoes, oferta cobertura e cobre outros medicos.

Campos sugeridos:

- `id`
- `usuario_id`
- `hospital_id`
- `crm`
- `uf_crm`
- `especialidade`
- `telefone`
- `foto_perfil_url`
- `ativo`
- `criado_em`
- `atualizado_em`

Relacionamentos:

- Um `Hospital` possui muitos `Medico`.
- Um `Medico` pode estar vinculado a muitos setores por `MedicoSetor`.
- Um `Medico` pode ser responsavel por muitos plantoes.
- Um `Medico` pode abrir muitos pedidos de cobertura.
- Um `Medico` pode assumir muitos pedidos de cobertura de outros medicos.

### MedicoSetor

Tabela associativa que define a visibilidade e elegibilidade operacional do medico por setor.

Campos sugeridos:

- `id`
- `medico_id`
- `setor_id`
- `ativo`
- `vinculado_em`

Restricoes recomendadas:

- Unico por `medico_id + setor_id`.
- O setor deve pertencer ao mesmo hospital do medico.
- Um medico so deve visualizar pedidos de cobertura de setores nos quais possui vinculo ativo.
- Um medico so deve assumir cobertura de setores nos quais possui vinculo ativo.

## Modelagem de plantoes

### RegraPlantaoFixo

Representa uma escala recorrente. Ela nao e o plantao trabalhado em uma data especifica; ela e a regra que gera os plantoes.

Campos sugeridos:

- `id`
- `hospital_id`
- `setor_id`
- `medico_id`
- `criado_por_escalista_id`
- `tipo_recorrencia`: `SEMANAL`, `MENSAL_N_ESIMO_DIA_SEMANA`, `MENSAL_DIA_FIXO`
- `dia_semana`: exemplo `SABADO`
- `semana_do_mes`: exemplo `2` para segundo sabado do mes
- `dia_do_mes`: usado quando a recorrencia for por dia fixo
- `hora_inicio`
- `hora_fim`
- `data_inicio_vigencia`
- `data_fim_vigencia`
- `ativo`
- `criado_em`
- `atualizado_em`

Exemplos:

- Todo sabado das 07h as 19h: `tipo_recorrencia = SEMANAL`, `dia_semana = SABADO`, `hora_inicio = 07:00`, `hora_fim = 19:00`.
- Todo segundo sabado do mes das 07h as 19h: `tipo_recorrencia = MENSAL_N_ESIMO_DIA_SEMANA`, `semana_do_mes = 2`, `dia_semana = SABADO`.

### Plantao

Representa uma ocorrencia concreta na agenda. Todo plantao que aparece em agenda ou cobertura deve estar nesta tabela.

Campos sugeridos:

- `id`
- `hospital_id`
- `setor_id`
- `medico_titular_id`: medico originalmente escalado
- `medico_responsavel_atual_id`: medico que deve realizar o plantao naquele momento
- `criado_por_escalista_id`
- `regra_plantao_fixo_id`: nulo para plantao avulso
- `tipo`: `FIXO`, `AVULSO`
- `data_inicio`
- `data_fim`
- `status`: `AGENDADO`, `REALIZADO`, `CANCELADO`
- `criado_em`
- `atualizado_em`

Observacoes:

- Plantao avulso tem `regra_plantao_fixo_id = null`.
- Plantao fixo tem origem em uma `RegraPlantaoFixo`.
- Na criacao do plantao, `medico_responsavel_atual_id` deve ser igual a `medico_titular_id`.
- Quando outro medico assume uma cobertura, `medico_responsavel_atual_id` passa a ser o medico cobridor, preservando o titular original e o historico em `PedidoCobertura`.

## Modelagem de cobertura

### PedidoCobertura

Representa o ato de um medico tornar um plantao disponivel para que outro medico do mesmo hospital e setor assuma a cobertura.

Exemplo: se um medico esta escalado para 15/05/2026 das 07h as 19h e abre um pedido de cobertura, esse pedido passa a aparecer como uma marcacao vermelha no calendario dos demais medicos elegiveis daquele setor. Quando um desses medicos clica e assume, o pedido e fechado, o plantao passa para o medico cobridor e o solicitante recebe uma notificacao.

Campos sugeridos:

- `id`
- `plantao_id`
- `hospital_id`
- `setor_id`
- `medico_solicitante_id`
- `medico_cobridor_id`: nulo enquanto o pedido estiver aberto
- `status`: `ABERTO`, `ASSUMIDO`, `CANCELADO`, `EXPIRADO`
- `motivo`
- `aberto_em`
- `assumido_em`
- `cancelado_em`
- `expirado_em`

Restricoes recomendadas:

- Um plantao deve ter no maximo um pedido de cobertura aberto por vez.
- `medico_solicitante_id` deve ser o medico responsavel atual pelo plantao no momento da abertura.
- O pedido deve copiar `hospital_id` e `setor_id` do plantao para facilitar filtros de calendario e autorizacao.
- O pedido aberto deve aparecer apenas para medicos com `MedicoSetor` ativo no mesmo `setor_id` e pertencentes ao mesmo `hospital_id`.
- O medico solicitante nao pode assumir o proprio pedido.
- Para assumir, o medico cobridor precisa ter vinculo ativo com o setor do pedido e pertencer ao mesmo hospital.
- Ao assumir a cobertura:
  - `PedidoCobertura.status` muda para `ASSUMIDO`.
  - `PedidoCobertura.medico_cobridor_id` recebe o medico que assumiu.
  - `PedidoCobertura.assumido_em` registra a data/hora da acao.
  - `Plantao.medico_responsavel_atual_id` passa a ser o medico cobridor.
  - Uma notificacao deve ser criada para o medico solicitante.
- A operacao de assumir deve ser atomica, atualizando apenas pedidos ainda `ABERTO`, para impedir que dois medicos assumam o mesmo plantao simultaneamente.

## Notificacoes

### Notificacao

Representa mensagens de sistema entregues aos usuarios.

Campos sugeridos:

- `id`
- `usuario_destino_id`
- `tipo`: `COBERTURA_ASSUMIDA`, `COBERTURA_CANCELADA`, `PLANTAO_ATRIBUIDO`
- `titulo`
- `mensagem`
- `pedido_cobertura_id`
- `plantao_id`
- `lida_em`
- `criado_em`

Regra importante:

- Sempre que um medico assumir o pedido de cobertura de outro medico, criar uma notificacao `COBERTURA_ASSUMIDA` para o usuario do medico solicitante.

## Regras de acesso e integridade

### Hospital

- Pode cadastrar setores do proprio hospital.
- Pode cadastrar escalistas do proprio hospital.
- Pode vincular escalistas a setores do proprio hospital.
- Pode cadastrar ou importar medicos do proprio hospital.

### Escalista

- So pode vincular medicos a setores sob sua responsabilidade.
- So pode criar plantoes em setores aos quais esta vinculado.
- So pode atribuir plantao a medico vinculado ao setor do plantao.

### Medico

- So visualiza a propria agenda.
- Visualiza como marcacao vermelha os pedidos de cobertura abertos dos setores aos quais esta vinculado no mesmo hospital.
- So pode assumir pedido de cobertura de setor ao qual esta vinculado no mesmo hospital.
- Nao pode assumir o proprio pedido de cobertura.

## Indices recomendados

- `usuario.email` unico.
- `hospital.cnpj` unico.
- `medico.crm + medico.uf_crm` unico.
- `setor.hospital_id + setor.nome` unico.
- `medico_setor.medico_id + medico_setor.setor_id` unico.
- `escalista_setor.escalista_id + escalista_setor.setor_id` unico.
- `plantao.setor_id + plantao.data_inicio`.
- `plantao.medico_responsavel_atual_id + plantao.data_inicio`.
- `pedido_cobertura.hospital_id + pedido_cobertura.setor_id + pedido_cobertura.status`.
- `pedido_cobertura.medico_cobridor_id + pedido_cobertura.status`.
- `pedido_cobertura.plantao_id` com unicidade parcial para status `ABERTO`, se o banco suportar.
- `notificacao.usuario_destino_id + notificacao.lida_em`.

## Observacao sobre implementacao gradual

Se a ideia for evoluir o backend atual sem uma reescrita grande, eu faria em etapas:

1. Criar `medico_setor` e migrar o campo atual `doctor.setor_id`.
2. Criar `escalista_setor` e migrar o campo atual `manager.setor_id`.
3. Criar `regra_plantao_fixo` e adicionar `tipo` e `regra_plantao_fixo_id` em `tb_plantao`.
4. Substituir `tb_plantao_interest` por `pedido_cobertura`, registrando solicitante, medico cobridor, status e timestamps do fluxo.
5. Criar `notificacao`.
6. Depois, se desejado, unificar autenticacao em `usuario`.
