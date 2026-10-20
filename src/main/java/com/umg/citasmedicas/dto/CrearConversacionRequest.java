package com.umg.citasmedicas.dto;

import lombok.Data;

@Data
public class CrearConversacionRequest {

    private Long pacienteId;

    private Long medicoId;
}