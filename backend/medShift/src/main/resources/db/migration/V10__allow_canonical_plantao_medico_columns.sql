-- Plantao now uses medico_titular_id and medico_responsavel_atual_id.
-- Keep the legacy doctor_assignado_id column only for old data compatibility.

ALTER TABLE tb_plantao ALTER COLUMN doctor_assignado_id DROP NOT NULL;
