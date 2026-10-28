package com.umg.citasmedicas.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.Data;

@Data
public class BloqueHorarioSemanalResponse {
    private Long id;
    private DayOfWeek diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
