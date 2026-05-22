-- Populate canonical medico-setor links from the transitional single setor_id.

INSERT INTO tb_medico_setor (
    medico_id,
    setor_id,
    vinculado_por_escalista_id,
    ativo,
    vinculado_em,
    desvinculado_em
)
SELECT
    m.id,
    m.setor_id,
    NULL,
    TRUE,
    CURRENT_TIMESTAMP,
    NULL
FROM tb_medico m
WHERE m.setor_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM tb_medico_setor ms
      WHERE ms.medico_id = m.id
        AND ms.setor_id = m.setor_id
  );
