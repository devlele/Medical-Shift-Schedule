-- Migration V3: Create Hospital table
CREATE TABLE tb_hospital (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_fantasia VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    endereco VARCHAR(500),
    nome_gestor VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

-- Migration V4: Create Setor table
CREATE TABLE tb_setor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(500),
    hospital_id BIGINT NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id)
);

-- Migration V5: Add hospital_id and setor_id to tb_doctor
ALTER TABLE tb_doctor ADD COLUMN hospital_id BIGINT;
ALTER TABLE tb_doctor ADD COLUMN setor_id BIGINT;
ALTER TABLE tb_doctor ADD FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id);
ALTER TABLE tb_doctor ADD FOREIGN KEY (setor_id) REFERENCES tb_setor(id);

-- Migration V6: Add hospital_id and setor_id to tb_manager
ALTER TABLE tb_manager ADD COLUMN hospital_id BIGINT;
ALTER TABLE tb_manager ADD COLUMN setor_id BIGINT;
ALTER TABLE tb_manager ADD FOREIGN KEY (hospital_id) REFERENCES tb_hospital(id);
ALTER TABLE tb_manager ADD FOREIGN KEY (setor_id) REFERENCES tb_setor(id);
