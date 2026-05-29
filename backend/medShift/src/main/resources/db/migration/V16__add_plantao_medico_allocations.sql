CREATE TABLE tb_plantao_medico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plantao_id BIGINT NOT NULL,
    medico_titular_id BIGINT NOT NULL,
    medico_responsavel_atual_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AGENDADO',
    criado_em TIMESTAMP,
    atualizado_em TIMESTAMP,
    FOREIGN KEY (plantao_id) REFERENCES tb_plantao(id),
    FOREIGN KEY (medico_titular_id) REFERENCES tb_medico(id),
    FOREIGN KEY (medico_responsavel_atual_id) REFERENCES tb_medico(id),
    CONSTRAINT uk_tb_plantao_medico_titular UNIQUE (plantao_id, medico_titular_id)
);

INSERT INTO tb_plantao_medico (
    plantao_id,
    medico_titular_id,
    medico_responsavel_atual_id,
    status,
    criado_em,
    atualizado_em
)
SELECT
    p.id,
    COALESCE(p.medico_titular_id, p.medico_responsavel_atual_id),
    COALESCE(p.medico_responsavel_atual_id, p.medico_titular_id),
    COALESCE(p.status, 'AGENDADO'),
    p.criado_em,
    p.atualizado_em
FROM tb_plantao p
WHERE COALESCE(p.medico_titular_id, p.medico_responsavel_atual_id) IS NOT NULL
  AND COALESCE(p.medico_responsavel_atual_id, p.medico_titular_id) IS NOT NULL;

ALTER TABLE tb_pedido_cobertura ADD COLUMN plantao_medico_id BIGINT;

UPDATE tb_pedido_cobertura
SET plantao_medico_id = (
    SELECT MIN(pm.id)
    FROM tb_plantao_medico pm
    WHERE pm.plantao_id = tb_pedido_cobertura.plantao_id
      AND (
          pm.medico_titular_id = tb_pedido_cobertura.medico_solicitante_id
          OR pm.medico_responsavel_atual_id = tb_pedido_cobertura.medico_solicitante_id
      )
)
WHERE plantao_medico_id IS NULL
  AND plantao_id IS NOT NULL
  AND medico_solicitante_id IS NOT NULL;

ALTER TABLE tb_pedido_cobertura
    ADD FOREIGN KEY (plantao_medico_id) REFERENCES tb_plantao_medico(id);
