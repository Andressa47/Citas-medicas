CREATE DATABASE IF NOT EXISTS citas_medicas;

USE citas_medicas;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    debe_cambiar_password BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS especialidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS medicos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    especialidad_id BIGINT NOT NULL,
    numero_colegiado VARCHAR(50) NOT NULL UNIQUE,

    CONSTRAINT fk_medico_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_medico_especialidad
        FOREIGN KEY (especialidad_id)
        REFERENCES especialidades(id)
);

CREATE TABLE IF NOT EXISTS horarios_disponibles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medico_id BIGINT NOT NULL,
    fecha_hora_inicio DATETIME NOT NULL,
    fecha_hora_fin DATETIME NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_horario_medico
        FOREIGN KEY (medico_id)
        REFERENCES medicos(id)
);

CREATE TABLE IF NOT EXISTS citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medico_id BIGINT NOT NULL,
    horario_id BIGINT NOT NULL,
    estado VARCHAR(20) NOT NULL,
    motivo VARCHAR(500),
    diagnostico TEXT,
    receta TEXT,
    fecha_creacion DATETIME,
    fecha_actualizacion DATETIME,

    CONSTRAINT fk_cita_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_cita_medico
        FOREIGN KEY (medico_id)
        REFERENCES medicos(id),

    CONSTRAINT fk_cita_horario
        FOREIGN KEY (horario_id)
        REFERENCES horarios_disponibles(id)
    -- ==========================================
-- CONVERSACIONES DE CHAT
-- ==========================================

CREATE TABLE IF NOT EXISTS conversaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medico_id BIGINT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_conversacion_paciente
        FOREIGN KEY (paciente_id)
        REFERENCES usuarios(id),

    CONSTRAINT fk_conversacion_medico
        FOREIGN KEY (medico_id)
        REFERENCES medicos(id),

    CONSTRAINT uk_conversacion_paciente_medico
        UNIQUE (paciente_id, medico_id)
);


-- ==========================================
-- MENSAJES DEL CHAT
-- ==========================================

CREATE TABLE IF NOT EXISTS mensajes_chat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversacion_id BIGINT NOT NULL,
    remitente_id BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_mensaje_conversacion
        FOREIGN KEY (conversacion_id)
        REFERENCES conversaciones(id),

    CONSTRAINT fk_mensaje_remitente
        FOREIGN KEY (remitente_id)
        REFERENCES usuarios(id)
);


CREATE INDEX idx_mensaje_conversacion
ON mensajes_chat (conversacion_id);


CREATE INDEX idx_mensaje_fecha
ON mensajes_chat (fecha_envio);
);