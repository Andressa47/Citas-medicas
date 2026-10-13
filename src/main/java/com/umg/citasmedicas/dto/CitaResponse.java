package com.umg.citasmedicas.dto;

import com.umg.citasmedicas.enums.EstadoCita;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class CitaResponse {

    private Long id;

    private Long pacienteId;
    private String pacienteNombre;

    private Long medicoId;
    private String medicoNombre;

    private Long especialidadId;
    private String especialidadNombre;

    private Long horarioId;
    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;

    private EstadoCita estado;

    private String motivo;
    private String diagnostico;
    private String receta;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}