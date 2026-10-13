package com.umg.citasmedicas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CitaRequest {

    @NotNull(message = "El horario es obligatorio.")
    private Long horarioId;

    @NotBlank(message = "El motivo de la cita es obligatorio.")
    @Size(
        max = 500,
        message = "El motivo no puede superar los 500 caracteres."
    )
    private String motivo;
}