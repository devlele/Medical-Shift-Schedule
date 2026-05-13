-- Migration V4: Create Plantao table
CREATE TABLE tb_plantao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setor_id BIGINT NOT NULL,
    doctor_assignado_id BIGINT NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    FOREIGN KEY (setor_id) REFERENCES tb_setor(id),
    FOREIGN KEY (doctor_assignado_id) REFERENCES tb_doctor(id)
);

-- Migration V5: Create Plantao Interest table
CREATE TABLE tb_plantao_interest (
    plantao_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    PRIMARY KEY (plantao_id, doctor_id),
    FOREIGN KEY (plantao_id) REFERENCES tb_plantao(id),
    FOREIGN KEY (doctor_id) REFERENCES tb_doctor(id)
);
