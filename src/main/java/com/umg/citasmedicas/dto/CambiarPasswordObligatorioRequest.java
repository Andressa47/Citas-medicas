package com.umg.citasmedicas.dto;

import lombok.Data;

@Data
public class CambiarPasswordObligatorioRequest {

    private String email;

    private String passwordActual;

    private String nuevaPassword;

    private String confirmarPassword;
}