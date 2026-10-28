package com.umg.citasmedicas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
public class ConfiguracionHorarioRequest {

    @NotNull(message = "La duración de la consulta es obligatoria.")
    @Min(value = 10, message = "La duración mínima de una consulta es de 10 minutos.")
    @Max(value = 240, message = "La duración máxima de una consulta es de 240 minutos.")
    private Integer duracionConsultaMinutos;

    @Valid
    @NotEmpty(message = "Debe agregar al menos un bloque de atención semanal.")
    private List<BloqueHorarioSemanalRequest> bloques;
}
