# DER proposto para o MedShift

Este DER modela o sistema como uma plataforma multi-hospitalar de gestao de plantoes medicos. A ideia central e separar:

- identidade/autenticacao dos usuarios;
- estrutura organizacional do hospital;
- vinculos operacionais entre escalistas, medicos e setores;
- modelos recorrentes de plantao fixo;
- ocorrencias concretas de plantao;
- fluxo de cobertura/troca e notificacoes.

## Principios da modelagem

1. O hospital e a unidade organizacional principal.
2. `Usuario` representa qualquer pessoa ou conta que autentica no sistema.
3. `Admin`, `Hospital`, `Escalista` e `Medico` sao papeis/perfis com responsabilidades diferentes.
4. Setores pertencem a um unico hospital.
5. Escalistas podem ser vinculados a um ou mais setores do hospital.
6. Medicos podem ser vinculados a um ou mais setores do hospital.
7. Plantao fixo nao deve ser gravado apenas como um plantao unico; ele precisa de um modelo de recorrencia.
8. Toda troca/cobertura deve apontar para uma ocorrencia concreta de plantao.
9. A visibilidade de pedidos de cobertura deve ser resolvida pelo vinculo `MedicoSetor`.
10. Notificacoes devem ser persistidas para garantir rastreabilidade e entrega posterior.

## Entidades principais

### Usuario

Armazena os dados de autenticacao e identidade comum.

Campos sugeridos:

- `id_usuario`
- `nome`
- `email`
- `cpf`
- `telefone`
- `data_nascimento`
- `senha_hash`
- `papel`: `ADMIN`, `HOSPITAL`, `ESCALISTA`, `MEDICO`
- `ativo`
- `criado_em`
- `atualizado_em`

Observacao: o papel ajuda na autorizacao, mas as regras de negocio devem consultar tambem as tabelas especificas de perfil.

### Admin

Perfil administrativo global. Cadastra hospitais e cria suas credenciais.

Campos sugeridos:

- `id_admin`
- `usuario_id`

Relacionamentos:

- Um `Admin` pode cadastrar varios `Hospitais`.

### Hospital

Representa a instituicao. O hospital tambem possui uma conta de usuario para login.

Campos sugeridos:

- `id_hospital`
- `usuario_id`
- `cadastrado_por_admin_id`
- `nome`
- `cnpj`
- `telefone`
- `endereco`
- `ativo`
- `criado_em`

Relacionamentos:

- Um `Hospital` possui muitos `Setores`.
- Um `Hospital` cadastra muitos `Escalistas`.
- Um `Hospital` pode manter muitos `Medicos` vinculados direta ou indiretamente pelos setores.

### Setor

Unidade interna do hospital onde os plantoes acontecem.

Campos sugeridos:

- `id_setor`
- `hospital_id`
- `nome`
- `descricao`
- `ativo`

Relacionamentos:

- Um `Setor` pertence a um `Hospital`.
- Um `Setor` possui varios `Escalistas` via `EscalistaSetor`.
- Um `Setor` possui varios `Medicos` via `MedicoSetor`.
- Um `Setor` possui varios `Plantoes`.

### Escalista

Usuario operacional responsavel por vincular medicos ao setor e atribuir plantoes.

Campos sugeridos:

- `id_escalista`
- `usuario_id`
- `hospital_id`
- `ativo`

Relacionamentos:

- Um `Escalista` pertence a um `Hospital`.
- Um `Escalista` pode atuar em varios setores via `EscalistaSetor`.
- Um `Escalista` cria modelos de plantao fixo.
- Um `Escalista` cria/atribui plantoes avulsos e ocorrencias.

### EscalistaSetor

Tabela associativa que define em quais setores o escalista pode operar.

Campos sugeridos:

- `id_escalista_setor`
- `escalista_id`
- `setor_id`
- `vinculado_por_usuario_id`
- `criado_em`
- `ativo`

Restricao recomendada:

- Unicidade para `escalista_id + setor_id` quando ativo.

### Medico

Perfil do usuario medico.

Campos sugeridos:

- `id_medico`
- `usuario_id`
- `crm`
- `uf_crm`
- `ativo`

Relacionamentos:

- Um `Medico` pode estar vinculado a varios setores via `MedicoSetor`.
- Um `Medico` pode ser titular de varios plantoes.
- Um `Medico` pode abrir pedidos de cobertura.
- Um `Medico` pode assumir pedidos de cobertura abertos por outros medicos.

### Especialidade

Catalogo de especialidades medicas.

Campos sugeridos:

- `id_especialidade`
- `nome`
- `descricao`
- `ativo`

### MedicoEspecialidade

Tabela associativa para permitir que um medico tenha uma ou mais especialidades.

Campos sugeridos:

- `id_medico_especialidade`
- `medico_id`
- `especialidade_id`

### MedicoSetor

Tabela associativa que controla quais medicos podem ver e atuar em quais setores.

Campos sugeridos:

- `id_medico_setor`
- `medico_id`
- `setor_id`
- `vinculado_por_escalista_id`
- `criado_em`
- `ativo`

Regras importantes:

- Um medico so visualiza pedidos de cobertura de setores onde possui `MedicoSetor` ativo.
- Um escalista so deve vincular medicos a setores onde possui `EscalistaSetor` ativo.
- Deve haver unicidade para `medico_id + setor_id` quando ativo.

## Plantao fixo e plantao avulso

### ModeloPlantao

Representa o padrao recorrente de um plantao fixo. Exemplo: todo sabado das 07:00 as 19:00, ou todo segundo sabado do mes.

Campos sugeridos:

- `id_modelo_plantao`
- `hospital_id`
- `setor_id`
- `medico_titular_id`
- `criado_por_escalista_id`
- `frequencia`: `SEMANAL`, `MENSAL`
- `dia_semana`
- `semana_do_mes`: usado para regras como segundo sabado do mes
- `hora_inicio`
- `hora_fim`
- `data_inicio_vigencia`
- `data_fim_vigencia`
- `ativo`
- `criado_em`

Observacao: o modelo nao substitui a tabela `Plantao`; ele apenas gera ou referencia as ocorrencias concretas.

### Plantao

Representa uma ocorrencia concreta de plantao. Pode ser avulso ou uma ocorrencia derivada de um `ModeloPlantao`.

Campos sugeridos:

- `id_plantao`
- `hospital_id`
- `setor_id`
- `modelo_plantao_id`: nulo quando for avulso
- `medico_titular_id`
- `medico_responsavel_atual_id`
- `criado_por_escalista_id`
- `tipo`: `AVULSO`, `FIXO`
- `data_hora_inicio`
- `data_hora_fim`
- `status`: `ESCALADO`, `CANCELADO`, `REALIZADO`
- `criado_em`
- `atualizado_em`

Regras importantes:

- `Plantao` sempre pertence a um setor.
- O medico titular deve possuir vinculo ativo com o setor do plantao.
- Na criacao do plantao, `medico_responsavel_atual_id` deve ser igual a `medico_titular_id`.
- O escalista criador deve possuir vinculo ativo com o setor do plantao.
- Pedido de cobertura aberto nao precisa alterar o status do plantao; a marcacao vermelha no calendario deve vir de `PedidoCobertura.status = ABERTO`.
- Quando uma cobertura e assumida, o sistema preserva o titular original e atualiza `medico_responsavel_atual_id` para o medico cobridor.

## Cobertura de plantao

### PedidoCobertura

Representa o pedido feito pelo medico responsavel atual para que outro medico do mesmo hospital e setor assuma seu plantao.

No calendario dos medicos elegiveis, um `PedidoCobertura` com status `ABERTO` deve aparecer como uma marcacao vermelha no horario do plantao. Ao clicar e assumir, o pedido deixa de estar aberto e passa a registrar quem ficou responsavel pela cobertura.

Campos sugeridos:

- `id_pedido_cobertura`
- `plantao_id`
- `hospital_id`
- `setor_id`
- `solicitante_medico_id`
- `medico_cobridor_id`
- `motivo`
- `status`: `ABERTO`, `ASSUMIDO`, `CANCELADO`, `EXPIRADO`
- `criado_em`
- `assumido_em`
- `cancelado_em`
- `expirado_em`

Regras importantes:

- Apenas o medico responsavel atual pelo plantao pode abrir o pedido.
- O pedido fica visivel apenas para medicos do mesmo hospital vinculados ao mesmo setor.
- O medico solicitante nao pode assumir o proprio pedido.
- O medico que assume precisa ter `MedicoSetor` ativo no setor do plantao.
- Ao assumir, o sistema registra `medico_cobridor_id`, muda o status para `ASSUMIDO`, atualiza `Plantao.medico_responsavel_atual_id` e gera notificacao para o solicitante.
- A acao de assumir deve ocorrer em transacao atomica, condicionada a `status = ABERTO`, para evitar dupla cobertura no mesmo pedido.
- Recomenda-se permitir apenas um pedido `ABERTO` por plantao.

## Notificacoes

### Notificacao

Registra eventos relevantes para usuarios, especialmente quando um pedido de cobertura e assumido.

Campos sugeridos:

- `id_notificacao`
- `usuario_destinatario_id`
- `tipo`: `COBERTURA_ASSUMIDA`, `PLANTAO_ATRIBUIDO`, `PLANTAO_CANCELADO`
- `titulo`
- `mensagem`
- `pedido_cobertura_id`
- `plantao_id`
- `lida_em`
- `criada_em`

Regra obrigatoria:

- Quando um medico assume um pedido de cobertura, o sistema cria uma notificacao para o usuario do medico solicitante.

## Cardinalidades resumidas

- `Admin 1:N Hospital`
- `Usuario 1:0..1 Admin`
- `Usuario 1:0..1 Hospital`
- `Usuario 1:0..1 Escalista`
- `Usuario 1:0..1 Medico`
- `Hospital 1:N Setor`
- `Hospital 1:N Escalista`
- `Escalista N:N Setor` via `EscalistaSetor`
- `Medico N:N Setor` via `MedicoSetor`
- `Medico N:N Especialidade` via `MedicoEspecialidade`
- `Setor 1:N ModeloPlantao`
- `ModeloPlantao 1:N Plantao`
- `Setor 1:N Plantao`
- `Medico 1:N Plantao` como titular
- `Medico 1:N Plantao` como responsavel atual
- `Plantao 1:0..1 PedidoCobertura` aberto/ativo
- `PedidoCobertura N:1 Medico` como solicitante
- `PedidoCobertura N:0..1 Medico` como cobridor
- `Usuario 1:N Notificacao`

## Indices e restricoes recomendadas

- `usuario.email` unico.
- `usuario.cpf` unico quando informado.
- `hospital.cnpj` unico.
- `medico.crm + medico.uf_crm` unico.
- `setor.hospital_id + setor.nome` unico.
- `escalista_setor.escalista_id + setor_id` unico quando ativo.
- `medico_setor.medico_id + setor_id` unico quando ativo.
- `pedido_cobertura.plantao_id` unico para pedidos abertos.
- Indices em `plantao.setor_id`, `plantao.medico_titular_id`, `plantao.medico_responsavel_atual_id`, `plantao.data_hora_inicio`.
- Indices em `pedido_cobertura.hospital_id`, `pedido_cobertura.setor_id`, `pedido_cobertura.status`.

## Observacao arquitetural

Mesmo que `hospital_id` possa ser inferido a partir de `setor_id`, manter `hospital_id` em `Plantao`, `ModeloPlantao` e `PedidoCobertura` pode ser util para filtros, autorizacao e performance. Essa duplicidade exige validacao: o setor informado deve pertencer ao mesmo hospital gravado no registro.
