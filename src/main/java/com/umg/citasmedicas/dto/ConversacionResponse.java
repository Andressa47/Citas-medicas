package com.umg.citasmedicas.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ConversacionResponse {

    private Long id;

    private Long pacienteId;

    private String pacienteNombre;

    private Long medicoId;

    private Long medicoUsuarioId;

    private String medicoNombre;

    private String especialidadNombre;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;
}