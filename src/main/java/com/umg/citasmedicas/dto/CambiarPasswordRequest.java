package com.umg.citasmedicas.dto;

import lombok.Data;

@Data
public class CambiarPasswordRequest {

    private String passwordActual;

    private String nuevaPassword;

    private String confirmarPassword;
}