package com.umg.citasmedicas.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class ConfiguracionHorarioResponse {
    private Long medicoId;
    private String medicoNombre;
    private Integer duracionConsultaMinutos;
    private List<BloqueHorarioSemanalResponse> bloques = new ArrayList<>();
    private Integer horariosGenerados = 0;
}
