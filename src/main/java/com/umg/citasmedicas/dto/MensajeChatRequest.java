package com.umg.citasmedicas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MensajeChatRequest {

    @NotBlank(
        message = "El mensaje no puede estar vacío."
    )
    @Size(
        max = 1000,
        message = "El mensaje no puede superar los 1000 caracteres."
    )
    private String contenido;
}