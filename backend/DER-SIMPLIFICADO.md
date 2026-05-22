# DER simplificado - MedShift

Este documento apresenta uma versao conceitual e simplificada do DER do MedShift, pensada para apresentacao em banca de TCC.

O objetivo deste diagrama nao e substituir o DER completo, mas comunicar de forma mais clara as entidades principais e como elas se relacionam no dominio de gestao de plantoes medicos.

## Por que usar um DER simplificado?

Sim, e uma boa pratica apresentar uma versao simplificada quando o modelo oficial possui muitas entidades tecnicas, tabelas associativas ou campos de apoio.

Em documentos academicos e apresentacoes, e comum separar:

- DER conceitual: mostra as entidades principais e as regras de negocio mais importantes;
- DER logico/fisico: mostra chaves estrangeiras, tabelas associativas, campos de auditoria, status internos e detalhes de persistencia.

Neste projeto, o DER completo continua sendo importante para implementacao. Ja este DER simplificado e mais adequado para explicar o funcionamento geral do sistema para a banca.

## Diagrama Mermaid

```mermaid
erDiagram
    USUARIO {
        bigint id PK
        string nome
        string email
        string senha
        string role
    }

    HOSPITAL {
        bigint id PK
        string nome
        string cnpj
        string telefone
        string endereco
    }

    SETOR {
        bigint id PK
        bigint hospital_id FK
        string nome
        string descricao
    }

    ESCALISTA {
        bigint id PK
        bigint setor_id FK
        string nome
        string email
        string telefone
    }

    MEDICO {
        bigint id PK
        string nome
        string email
        string crm
        string telefone
    }

    ESPECIALIDADE {
        bigint id PK
        string nome
        string descricao
    }

    MEDICO_SETOR {
        bigint id PK
        bigint medico_id FK
        bigint setor_id FK
        datetime vinculado_em
        boolean ativo
    }

    MEDICO_ESPECIALIDADE {
        bigint id PK
        bigint medico_id FK
        bigint especialidade_id FK
        boolean principal
    }

    REGRA_PLANTAO_FIXO {
        bigint id PK
        string recorrencia
        string dia_semana
        time hora_inicio
        time hora_fim
        date vigencia_inicio
        date vigencia_fim
    }

    PLANTAO {
        bigint id PK
        string tipo
        string turno
        datetime data_inicio
        datetime data_fim
        string status
    }

    PEDIDO_COBERTURA {
        bigint id PK
        string status
        datetime aberto_em
        datetime assumido_em
    }

    NOTIFICACAO {
        bigint id PK
        string tipo
        string titulo
        string mensagem
        datetime criado_em
        datetime lida_em
    }

    USUARIO ||--o| HOSPITAL : acessa_como
    USUARIO ||--o| ESCALISTA : acessa_como
    USUARIO ||--o| MEDICO : acessa_como

    HOSPITAL ||--o{ SETOR : possui
    HOSPITAL ||--o{ ESCALISTA : cadastra

    SETOR ||--o{ ESCALISTA : responsavel_por
    MEDICO ||--o{ MEDICO_SETOR : possui_vinculo
    SETOR ||--o{ MEDICO_SETOR : recebe_medico

    MEDICO ||--o{ MEDICO_ESPECIALIDADE : possui
    ESPECIALIDADE ||--o{ MEDICO_ESPECIALIDADE : classifica

    ESCALISTA ||--o{ PLANTAO : cria
    SETOR ||--o{ PLANTAO : recebe
    MEDICO ||--o{ PLANTAO : titular
    MEDICO ||--o{ PLANTAO : responsavel_atual

    SETOR ||--o{ REGRA_PLANTAO_FIXO : possui
    MEDICO ||--o{ REGRA_PLANTAO_FIXO : escalado_em
    ESCALISTA ||--o{ REGRA_PLANTAO_FIXO : define
    REGRA_PLANTAO_FIXO ||--o{ PLANTAO : gera

    PLANTAO ||--o| PEDIDO_COBERTURA : pode_originar
    MEDICO ||--o{ PEDIDO_COBERTURA : solicita
    MEDICO ||--o{ PEDIDO_COBERTURA : assume

    PEDIDO_COBERTURA ||--o{ NOTIFICACAO : dispara
    USUARIO ||--o{ NOTIFICACAO : recebe
```

## Leitura do modelo

### Usuario

Representa a conta usada para autenticar no sistema.

Um usuario pode acessar o sistema como hospital, escalista ou medico, conforme seu papel de acesso.

No DER completo, essa decisao permite centralizar login, senha e permissoes em uma unica entidade.

### Hospital

Representa a instituicao hospitalar cadastrada no sistema.

O hospital possui setores e cadastra escalistas. Cada escalista fica responsavel por um unico setor do hospital.

### Setor

Representa uma area ou unidade operacional do hospital, como UTI, emergencia, pediatria ou centro cirurgico.

O setor e uma entidade central porque limita a atuacao dos escalistas, dos medicos e a visibilidade dos pedidos de cobertura.

### Escalista

Representa o profissional responsavel por montar e administrar escalas.

O escalista atua em um unico setor. Dentro desse setor, ele pode vincular medicos e criar plantoes.

### Medico

Representa o profissional que realiza plantoes.

O medico pode estar vinculado a um ou mais setores. Esses vinculos definem:

- em quais setores ele pode receber plantoes;
- quais pedidos de cobertura ele pode visualizar;
- quais plantoes ele pode assumir.

### Medico setor

Representa o vinculo entre medico e setor.

Essa entidade associativa foi mantida no DER simplificado porque e uma regra central do sistema: um medico pode atuar em varios setores, e um setor pode possuir varios medicos.

Esse vinculo define quais plantoes o medico pode receber e quais pedidos de cobertura ele pode visualizar.

### Especialidade

Representa a area de atuacao do medico, como cardiologia, ortopedia ou clinica medica.

### Medico especialidade

Representa o vinculo entre medico e especialidade.

Essa entidade associativa permite que um medico tenha uma ou mais especialidades, e que uma mesma especialidade esteja associada a varios medicos.

O campo `principal` indica a especialidade principal do medico quando houver mais de uma.

### Regra de plantao fixo

Representa a regra de recorrencia de um plantao fixo.

Exemplos:

- todo sabado das 07h as 19h;
- todo segundo sabado do mes;
- toda semana no turno noturno.

Essa entidade nao e o plantao realizado em si. Ela apenas define a regra que gera plantoes concretos.

### Plantao

Representa uma ocorrencia real de plantao, com data, horario, setor, medico titular e medico responsavel atual.

O plantao pode ser:

- avulso: criado para uma data e horario especificos;
- fixo: gerado a partir de uma regra de recorrencia.

O medico titular e o medico originalmente escalado. O medico responsavel atual pode mudar quando outro medico assume uma cobertura.

### Pedido de cobertura

Representa a solicitacao feita por um medico que deseja passar um plantao para outro profissional.

Quando o pedido e aberto, ele fica visivel apenas para medicos vinculados ao mesmo setor do plantao.

Quando outro medico assume a cobertura, o pedido e marcado como assumido e o plantao passa a ter esse medico como responsavel atual.

### Notificacao

Representa mensagens internas enviadas aos usuarios.

No fluxo principal do sistema, uma notificacao e enviada ao medico solicitante quando outro medico assume seu pedido de cobertura.

## Simplificacoes em relacao ao DER completo

Este diagrama omite propositalmente alguns detalhes tecnicos para melhorar a clareza:

- tabela associativa `ESCALISTA_SETOR`;
- campos de auditoria, como `criado_em`, `atualizado_em` e `ativo`;
- chaves estrangeiras explicitas em todas as entidades;
- campos legados mantidos por compatibilidade com o codigo;
- detalhes internos de controle de status.

Essas simplificacoes nao removem regras importantes do dominio. Elas apenas tornam o DER mais adequado para apresentacao e explicacao conceitual.

## Como apresentar para a banca

Uma forma clara de explicar este DER e seguir esta ordem:

1. O sistema possui usuarios autenticados com diferentes papeis.
2. O hospital cadastra setores e escalistas.
3. Cada escalista responde por um unico setor.
4. O medico e vinculado aos setores por meio de `MEDICO_SETOR`.
5. O medico possui especialidades por meio de `MEDICO_ESPECIALIDADE`.
6. O escalista cria plantoes para os medicos.
7. O medico pode solicitar cobertura de um plantao.
8. Apenas medicos do mesmo setor visualizam e podem assumir a cobertura.
9. Quando a cobertura e assumida, o solicitante recebe uma notificacao.

Assim, a banca entende primeiro o fluxo principal do sistema, sem precisar analisar todas as estruturas tecnicas do banco de dados.
