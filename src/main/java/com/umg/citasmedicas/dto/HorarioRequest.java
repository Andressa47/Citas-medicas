package com.umg.citasmedicas.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class HorarioRequest {

    @NotNull(message = "El médico es obligatorio.")
    private Long medicoId;

    @NotNull(message = "La fecha y hora de inicio son obligatorias.")
    private LocalDateTime fechaHoraInicio;

    @NotNull(message = "La fecha y hora de fin son obligatorias.")
    private LocalDateTime fechaHoraFin;

    private Boolean disponible = true;
}