-- Populate canonical escalista-setor links from the transitional single setor_id.

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
LEFT JOIN tb_hospital h ON h.id = e.hospital_id
WHERE e.setor_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM tb_escalista_setor es
      WHERE es.escalista_id = e.id
        AND es.setor_id = e.setor_id
  );
