-- Plantao no longer stores hospital_id directly.
-- The hospital is derived from tb_plantao.setor_id -> tb_setor.hospital_id.
ALTER TABLE tb_plantao DROP COLUMN hospital_id;
