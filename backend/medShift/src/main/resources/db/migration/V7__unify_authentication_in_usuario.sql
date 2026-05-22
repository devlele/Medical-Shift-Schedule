-- Backfill tb_usuario as the single authentication source.
-- Legacy profile columns are kept only for compatibility during the transition.

INSERT INTO tb_medico (
    id,
    crm,
    uf_crm,
    telefone,
    foto_perfil_url,
    ativo,
    criado_em,
    atualizado_em,
    specialty,
    role,
    hospital_id,
    setor_id,
    name,
    cpf,
    email,
    birthday,
    password
)
SELECT
    d.id,
    d.crm,
    d.uf,
    d.telefone,
    d.foto_perfil_url,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    d.specialty,
    'MEDICO',
    d.hospital_id,
    d.setor_id,
    d.name,
    d.cpf,
    d.email,
    d.birthday,
    d.password
FROM tb_doctor d
WHERE NOT EXISTS (SELECT 1 FROM tb_medico m WHERE m.id = d.id)
  AND NOT EXISTS (SELECT 1 FROM tb_medico m WHERE m.crm = d.crm)
  AND NOT EXISTS (SELECT 1 FROM tb_medico m WHERE m.email = d.email)
  AND NOT EXISTS (SELECT 1 FROM tb_medico m WHERE m.cpf = d.cpf);

INSERT INTO tb_escalista (
    id,
    cargo,
    ativo,
    criado_em,
    atualizado_em,
    role,
    hospital_id,
    setor_id,
    name,
    cpf,
    email,
    birthday,
    password
)
SELECT
    m.id,
    m.department,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'ESCALISTA',
    m.hospital_id,
    m.setor_id,
    m.name,
    m.cpf,
    m.email,
    m.birthday,
    m.password
FROM tb_manager m
WHERE NOT EXISTS (SELECT 1 FROM tb_escalista e WHERE e.id = m.id)
  AND NOT EXISTS (SELECT 1 FROM tb_escalista e WHERE e.email = m.email)
  AND NOT EXISTS (SELECT 1 FROM tb_escalista e WHERE e.cpf = m.cpf);

INSERT INTO tb_usuario (
    nome,
    email,
    senha_hash,
    cpf,
    data_nascimento,
    telefone,
    role,
    ativo,
    criado_em,
    atualizado_em
)
SELECT
    COALESCE(h.nome_gestor, h.nome_fantasia),
    h.email,
    h.password,
    NULL,
    NULL,
    h.telefone,
    'HOSPITAL',
    COALESCE(h.ativo, TRUE),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tb_hospital h
WHERE h.usuario_id IS NULL
  AND h.email IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM tb_usuario u WHERE u.email = h.email);

INSERT INTO tb_usuario (
    nome,
    email,
    senha_hash,
    cpf,
    data_nascimento,
    telefone,
    role,
    ativo,
    criado_em,
    atualizado_em
)
SELECT
    m.name,
    m.email,
    m.password,
    m.cpf,
    m.birthday,
    m.telefone,
    'MEDICO',
    COALESCE(m.ativo, TRUE),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tb_medico m
WHERE m.usuario_id IS NULL
  AND m.email IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM tb_usuario u WHERE u.email = m.email);

INSERT INTO tb_usuario (
    nome,
    email,
    senha_hash,
    cpf,
    data_nascimento,
    telefone,
    role,
    ativo,
    criado_em,
    atualizado_em
)
SELECT
    e.name,
    e.email,
    e.password,
    e.cpf,
    e.birthday,
    NULL,
    'ESCALISTA',
    COALESCE(e.ativo, TRUE),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tb_escalista e
WHERE e.usuario_id IS NULL
  AND e.email IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM tb_usuario u WHERE u.email = e.email);

UPDATE tb_hospital h
SET usuario_id = (SELECT u.id FROM tb_usuario u WHERE u.email = h.email)
WHERE h.usuario_id IS NULL
  AND h.email IS NOT NULL;

UPDATE tb_medico m
SET usuario_id = (SELECT u.id FROM tb_usuario u WHERE u.email = m.email)
WHERE m.usuario_id IS NULL
  AND m.email IS NOT NULL;

UPDATE tb_escalista e
SET usuario_id = (SELECT u.id FROM tb_usuario u WHERE u.email = e.email)
WHERE e.usuario_id IS NULL
  AND e.email IS NOT NULL;

UPDATE tb_plantao p
SET hospital_id = (SELECT s.hospital_id FROM tb_setor s WHERE s.id = p.setor_id)
WHERE p.hospital_id IS NULL
  AND p.setor_id IS NOT NULL;

UPDATE tb_plantao p
SET medico_titular_id = p.doctor_assignado_id
WHERE p.medico_titular_id IS NULL
  AND p.doctor_assignado_id IS NOT NULL;

UPDATE tb_plantao p
SET medico_responsavel_atual_id = p.doctor_assignado_id
WHERE p.medico_responsavel_atual_id IS NULL
  AND p.doctor_assignado_id IS NOT NULL;

UPDATE tb_plantao
SET tipo = 'AVULSO'
WHERE tipo IS NULL;
