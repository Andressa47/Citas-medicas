USE citas_medicas;

ALTER TABLE horarios_disponibles
ADD COLUMN generado_automaticamente BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE configuraciones_horario_medico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medico_id BIGINT NOT NULL UNIQUE,
    duracion_consulta_minutos INT NOT NULL DEFAULT 30,

    CONSTRAINT fk_config_horario_medico
        FOREIGN KEY (medico_id)
        REFERENCES medicos(id)
);

CREATE TABLE horarios_semanales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medico_id BIGINT NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,

    CONSTRAINT fk_horario_semanal_medico
        FOREIGN KEY (medico_id)
        REFERENCES medicos(id)
);

CREATE INDEX idx_horario_semanal_medico
ON horarios_semanales (medico_id);

CREATE INDEX idx_horario_disponible_medico_inicio
ON horarios_disponibles (medico_id, fecha_hora_inicio);
