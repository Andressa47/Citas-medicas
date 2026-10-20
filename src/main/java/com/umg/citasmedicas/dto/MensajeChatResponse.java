package com.umg.citasmedicas.dto;

import com.umg.citasmedicas.enums.Rol;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MensajeChatResponse {

    private Long id;

    private Long conversacionId;

    private Long remitenteId;

    private String remitenteNombre;

    private Rol remitenteRol;

    private String contenido;

    private LocalDateTime fechaEnvio;

    private boolean leido;

    private boolean enviadoPorMi;
}