-- Escalista now has a single responsible sector.
-- Keep only the link that matches tb_escalista.setor_id as active.

UPDATE tb_escalista
SET setor_id = (
    SELECT MIN(es.setor_id)
    FROM tb_escalista_setor es
    WHERE es.escalista_id = tb_escalista.id
      AND es.ativo = TRUE
      AND es.setor_id IS NOT NULL
)
WHERE setor_id IS NULL
  AND EXISTS (
      SELECT 1
      FROM tb_escalista_setor es
      WHERE es.escalista_id = tb_escalista.id
        AND es.ativo = TRUE
        AND es.setor_id IS NOT NULL
  );

UPDATE tb_escalista_setor
SET ativo = FALSE,
    desvinculado_em = CURRENT_TIMESTAMP
WHERE ativo = TRUE
  AND EXISTS (
      SELECT 1
      FROM tb_escalista e
      WHERE e.id = tb_escalista_setor.escalista_id
        AND e.setor_id IS NOT NULL
        AND e.setor_id <> tb_escalista_setor.setor_id
  );
