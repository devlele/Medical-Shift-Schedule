# DER - Medical Shift Schedule

```mermaid
erDiagram
    USUARIO {
        bigint id PK
        string nome
        string email
        string senha_hash
        string cpf
        date data_nascimento
        string role
        boolean ativo
        datetime criado_em
        datetime atualizado_em
    }

    HOSPITAL {
        bigint id PK
        bigint usuario_id FK
        string nome_fantasia
        string razao_social
        string cnpj
        string endereco
        string nome_gestor
        bigint criado_por_admin_id FK
        datetime criado_em
        datetime atualizado_em
    }

    SETOR {
        bigint id PK
        bigint hospital_id FK
        string nome
        string descricao
        boolean ativo
        datetime criado_em
        datetime atualizado_em
    }

    ESCALISTA {
        bigint id PK
        bigint usuario_id FK
        bigint hospital_id FK
        string cargo
        boolean ativo
        datetime criado_em
        datetime atualizado_em
    }

    ESCALISTA_SETOR {
        bigint id PK
        bigint escalista_id FK
        bigint setor_id FK
        boolean ativo
        datetime vinculado_em
    }

    MEDICO {
        bigint id PK
        bigint usuario_id FK
        bigint hospital_id FK
        string crm
        string uf_crm
        string especialidade
        string telefone
        string foto_perfil_url
        boolean ativo
        datetime criado_em
        datetime atualizado_em
    }

    MEDICO_SETOR {
        bigint id PK
        bigint medico_id FK
        bigint setor_id FK
        boolean ativo
        datetime vinculado_em
    }

    REGRA_PLANTAO_FIXO {
        bigint id PK
        bigint hospital_id FK
        bigint setor_id FK
        bigint medico_id FK
        bigint criado_por_escalista_id FK
        string tipo_recorrencia
        string dia_semana
        int semana_do_mes
        int dia_do_mes
        time hora_inicio
        time hora_fim
        date data_inicio_vigencia
        date data_fim_vigencia
        boolean ativo
        datetime criado_em
        datetime atualizado_em
    }

    PLANTAO {
        bigint id PK
        bigint hospital_id FK
        bigint setor_id FK
        bigint medico_titular_id FK
        bigint medico_responsavel_atual_id FK
        bigint criado_por_escalista_id FK
        bigint regra_plantao_fixo_id FK
        string tipo
        datetime data_inicio
        datetime data_fim
        string status
        datetime criado_em
        datetime atualizado_em
    }

    PEDIDO_COBERTURA {
        bigint id PK
        bigint plantao_id FK
        bigint hospital_id FK
        bigint setor_id FK
        bigint medico_solicitante_id FK
        bigint medico_cobridor_id FK
        string status
        string motivo
        datetime aberto_em
        datetime assumido_em
        datetime cancelado_em
        datetime expirado_em
    }

    NOTIFICACAO {
        bigint id PK
        bigint usuario_destino_id FK
        string tipo
        string titulo
        string mensagem
        bigint pedido_cobertura_id FK
        bigint plantao_id FK
        datetime lida_em
        datetime criado_em
    }

    USUARIO ||--|| HOSPITAL : credencial_hospital
    USUARIO ||--|| ESCALISTA : perfil_escalista
    USUARIO ||--|| MEDICO : perfil_medico
    USUARIO ||--o{ HOSPITAL : admin_cadastra
    USUARIO ||--o{ NOTIFICACAO : recebe

    HOSPITAL ||--o{ SETOR : possui
    HOSPITAL ||--o{ ESCALISTA : cadastra
    HOSPITAL ||--o{ MEDICO : cadastra
    HOSPITAL ||--o{ REGRA_PLANTAO_FIXO : define
    HOSPITAL ||--o{ PLANTAO : possui

    SETOR ||--o{ ESCALISTA_SETOR : tem_escalistas
    ESCALISTA ||--o{ ESCALISTA_SETOR : atua_em

    SETOR ||--o{ MEDICO_SETOR : tem_medicos
    MEDICO ||--o{ MEDICO_SETOR : atua_em

    SETOR ||--o{ REGRA_PLANTAO_FIXO : agenda_fixa
    MEDICO ||--o{ REGRA_PLANTAO_FIXO : medico_fixo
    ESCALISTA ||--o{ REGRA_PLANTAO_FIXO : cria

    REGRA_PLANTAO_FIXO ||--o{ PLANTAO : gera_ocorrencias
    SETOR ||--o{ PLANTAO : recebe
    MEDICO ||--o{ PLANTAO : titular
    MEDICO ||--o{ PLANTAO : responsavel_atual
    ESCALISTA ||--o{ PLANTAO : cria

    PLANTAO ||--o{ PEDIDO_COBERTURA : pode_abrir
    HOSPITAL ||--o{ PEDIDO_COBERTURA : restringe_hospital
    SETOR ||--o{ PEDIDO_COBERTURA : filtra_calendario
    MEDICO ||--o{ PEDIDO_COBERTURA : solicita
    MEDICO ||--o{ PEDIDO_COBERTURA : assume

    PEDIDO_COBERTURA ||--o{ NOTIFICACAO : origina
    PLANTAO ||--o{ NOTIFICACAO : referencia
```

## Leitura rapida do diagrama

- `MEDICO_SETOR` e a tabela que garante que um medico so veja pedidos de cobertura dos setores aos quais esta vinculado.
- `ESCALISTA_SETOR` limita em quais setores o escalista pode criar escalas e vincular medicos.
- `REGRA_PLANTAO_FIXO` representa a recorrencia; `PLANTAO` representa cada ocorrencia concreta.
- `PEDIDO_COBERTURA` representa a oferta aberta no calendario dos medicos elegiveis do mesmo hospital e setor.
- O campo `medico_cobridor_id` fica nulo enquanto o pedido esta aberto e recebe o medico que assumiu a cobertura.
- `NOTIFICACAO` registra o aviso ao medico solicitante quando outro medico assume a cobertura.
