-- Align domain schema with DER.md. Old tables are kept for backwards data migration.

CREATE TABLE tb_usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha_hash VARCHAR(255),
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    telefone VARCHAR(50),
    role VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP,
    atualizado_em TIMESTAMP
);

ALTER TABLE tb_hospital ADD COLUMN usuario_id BIGINT;
ALTER TABLE tb_hospital ADD COLUMN criado_por_usuario_id BIGINT;
ALTER TABLE tb_hospital ADD COLUMN razao_social VARCHAR(255);
ALTER TABLE tb_hospital ADD COLUMN telefone VARCHAR(50);
ALTER TABLE tb_hospital ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE tb_hospital ADD COLUMN criado_em TIMESTAMP;
ALTER TABLE tb_hospital ADD COLUMN atualizado_em TIMESTAMP;
ALTER TABLE tb_hospital ADD FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id);
ALTER TABLE tb_hospital ADD FOREIGN KEY (criado_por_usuario_id) REFERENCES tb_usuario(id);

ALTER TABLE tb_setor ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE tb_setor ADD COLUMN criado_em TIMESTAMP;
ALTER TABLE tb_setor ADD COLUMN atualizado_em TIMESTAMP;

CREATE TABLE tb_escalista (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    cargo VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP,
    atualizado_em TIMESTAMP,
    role VARCHAR(50),
    hospital_id BIGINT,
    setor_id BIGINT,
    name VARCHAR(255),
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(255) UNIQUE,
    birthday DATE,
    password VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id),
    FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id),
    FOREIGN KEY (setor_id) REFERENCES tb_setor(id)
);

CREATE TABLE tb_medico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    crm VARCHAR(20) NOT NULL,
    uf_crm VARCHAR(2),
    telefone VARCHAR(50),
    foto_perfil_url VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP,
    atualizado_em TIMESTAMP,
    specialty VARCHAR(100),
    role VARCHAR(50),
    hospital_id BIGINT,
    setor_id BIGINT,
    name VARCHAR(255),
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(255) UNIQUE,
    birthday DATE,
    password VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id),
    FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id),
    FOREIGN KEY (setor_id) REFERENCES tb_setor(id)
);

CREATE TABLE tb_escalista_setor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    escalista_id BIGINT,
    setor_id BIGINT,
    vinculado_por_usuario_id BIGINT,
    ativo BOOLEAN DEFAULT TRUE,
    vinculado_em TIMESTAMP,
    desvinculado_em TIMESTAMP,
    FOREIGN KEY (escalista_id) REFERENCES tb_escalista(id),
    FOREIGN KEY (setor_id) REFERENCES tb_setor(id),
    FOREIGN KEY (vinculado_por_usuario_id) REFERENCES tb_usuario(id)
);

CREATE TABLE tb_medico_setor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medico_id BIGINT,
    setor_id BIGINT,
    vinculado_por_escalista_id BIGINT,
    ativo BOOLEAN DEFAULT TRUE,
    vinculado_em TIMESTAMP,
    desvinculado_em TIMESTAMP,
    FOREIGN KEY (medico_id) REFERENCES tb_medico(id),
    FOREIGN KEY (setor_id) REFERENCES tb_setor(id),
    FOREIGN KEY (vinculado_por_escalista_id) REFERENCES tb_escalista(id)
);

CREATE TABLE tb_especialidade (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) UNIQUE,
    descricao VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP,
    atualizado_em TIMESTAMP
);

CREATE TABLE tb_medico_especialidade (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medico_id BIGINT,
    especialidade_id BIGINT,
    principal BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP,
    FOREIGN KEY (medico_id) REFERENCES tb_medico(id),
    FOREIGN KEY (especialidade_id) REFERENCES tb_especialidade(id)
);

CREATE TABLE tb_regra_plantao_fixo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hospital_id BIGINT,
    setor_id BIGINT,
    medico_titular_id BIGINT,
    criado_por_escalista_id BIGINT,
    tipo_recorrencia VARCHAR(50),
    dia_semana VARCHAR(50),
    semana_do_mes INT,
    dia_do_mes INT,
    hora_inicio TIME,
    hora_fim TIME,
    data_inicio_vigencia DATE,
    data_fim_vigencia DATE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP,
    atualizado_em TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id),
    FOREIGN KEY (setor_id) REFERENCES tb_setor(id),
    FOREIGN KEY (medico_titular_id) REFERENCES tb_medico(id),
    FOREIGN KEY (criado_por_escalista_id) REFERENCES tb_escalista(id)
);

ALTER TABLE tb_plantao ADD COLUMN hospital_id BIGINT;
ALTER TABLE tb_plantao ADD COLUMN regra_plantao_fixo_id BIGINT;
ALTER TABLE tb_plantao ADD COLUMN medico_titular_id BIGINT;
ALTER TABLE tb_plantao ADD COLUMN medico_responsavel_atual_id BIGINT;
ALTER TABLE tb_plantao ADD COLUMN criado_por_escalista_id BIGINT;
ALTER TABLE tb_plantao ADD COLUMN tipo VARCHAR(50);
ALTER TABLE tb_plantao ADD COLUMN criado_em TIMESTAMP;
ALTER TABLE tb_plantao ADD COLUMN atualizado_em TIMESTAMP;
ALTER TABLE tb_plantao ADD FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id);
ALTER TABLE tb_plantao ADD FOREIGN KEY (regra_plantao_fixo_id) REFERENCES tb_regra_plantao_fixo(id);
ALTER TABLE tb_plantao ADD FOREIGN KEY (medico_titular_id) REFERENCES tb_medico(id);
ALTER TABLE tb_plantao ADD FOREIGN KEY (medico_responsavel_atual_id) REFERENCES tb_medico(id);
ALTER TABLE tb_plantao ADD FOREIGN KEY (criado_por_escalista_id) REFERENCES tb_escalista(id);

CREATE TABLE tb_pedido_cobertura (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plantao_id BIGINT,
    hospital_id BIGINT,
    setor_id BIGINT,
    medico_solicitante_id BIGINT,
    medico_cobridor_id BIGINT,
    status VARCHAR(50),
    motivo VARCHAR(500),
    aberto_em TIMESTAMP,
    assumido_em TIMESTAMP,
    cancelado_em TIMESTAMP,
    expirado_em TIMESTAMP,
    atualizado_em TIMESTAMP,
    FOREIGN KEY (plantao_id) REFERENCES tb_plantao(id),
    FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id),
    FOREIGN KEY (setor_id) REFERENCES tb_setor(id),
    FOREIGN KEY (medico_solicitante_id) REFERENCES tb_medico(id),
    FOREIGN KEY (medico_cobridor_id) REFERENCES tb_medico(id)
);

CREATE TABLE tb_notificacao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_destino_id BIGINT,
    pedido_cobertura_id BIGINT,
    plantao_id BIGINT,
    tipo VARCHAR(50),
    titulo VARCHAR(255),
    mensagem VARCHAR(1000),
    lida_em TIMESTAMP,
    criado_em TIMESTAMP,
    FOREIGN KEY (usuario_destino_id) REFERENCES tb_usuario(id),
    FOREIGN KEY (pedido_cobertura_id) REFERENCES tb_pedido_cobertura(id),
    FOREIGN KEY (plantao_id) REFERENCES tb_plantao(id)
);
