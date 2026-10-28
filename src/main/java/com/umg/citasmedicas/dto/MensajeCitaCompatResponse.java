package com.umg.citasmedicas.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MensajeCitaCompatResponse {

    private Long id;

    private Long citaId;

    private Long remitenteId;

    private String remitenteNombre;

    private String contenido;

    private LocalDateTime fechaHora;

    private boolean leido;
}