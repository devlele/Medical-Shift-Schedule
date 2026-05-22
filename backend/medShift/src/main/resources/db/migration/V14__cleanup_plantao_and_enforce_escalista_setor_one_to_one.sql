-- Clean legacy plantao artifacts that are no longer part of the domain.
DROP TABLE IF EXISTS tb_plantao_interest;

ALTER TABLE tb_plantao DROP COLUMN check_in_time;
ALTER TABLE tb_plantao DROP COLUMN check_out_time;

-- Escalista -> Setor is now the canonical relationship.
-- Keep only one escalista responsible for each setor before adding the unique constraint.
UPDATE tb_escalista
SET setor_id = NULL,
    atualizado_em = CURRENT_TIMESTAMP
WHERE setor_id IS NOT NULL
  AND id NOT IN (
      SELECT kept_id
      FROM (
          SELECT MIN(id) AS kept_id
          FROM tb_escalista
          WHERE setor_id IS NOT NULL
          GROUP BY setor_id
      ) kept
  );

-- Historical links must mirror the canonical responsibility.
UPDATE tb_escalista_setor
SET ativo = FALSE,
    desvinculado_em = CURRENT_TIMESTAMP
WHERE ativo = TRUE
  AND NOT EXISTS (
      SELECT 1
      FROM tb_escalista e
      WHERE e.id = tb_escalista_setor.escalista_id
        AND e.setor_id = tb_escalista_setor.setor_id
  );

INSERT INTO tb_escalista_setor (
    escalista_id,
    setor_id,
    vinculado_por_usuario_id,
    ativo,
    vinculado_em,
    desvinculado_em
)
SELECT
    e.id,
    e.setor_id,
    h.usuario_id,
    TRUE,
    CURRENT_TIMESTAMP,
    NULL
FROM tb_escalista e
JOIN tb_hospital h ON h.id = e.hospital_id
WHERE e.setor_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM tb_escalista_setor es
      WHERE es.escalista_id = e.id
        AND es.setor_id = e.setor_id
        AND es.ativo = TRUE
  );

ALTER TABLE tb_escalista ADD CONSTRAINT uk_tb_escalista_setor UNIQUE (setor_id);
