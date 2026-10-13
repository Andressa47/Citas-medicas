package com.umg.citasmedicas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DiagnosticoRequest {

    @NotBlank(message = "El diagnóstico es obligatorio.")
    @Size(
        max = 2000,
        message = "El diagnóstico no puede superar los 2000 caracteres."
    )
    private String diagnostico;

    @Size(
        max = 2000,
        message = "La receta no puede superar los 2000 caracteres."
    )
    private String receta;
}