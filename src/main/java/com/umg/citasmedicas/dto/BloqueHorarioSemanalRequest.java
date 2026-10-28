package com.umg.citasmedicas.dto;

import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.Data;

@Data
public class BloqueHorarioSemanalRequest {

    @NotNull(message = "El día de la semana es obligatorio.")
    private DayOfWeek diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria.")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria.")
    private LocalTime horaFin;
}
