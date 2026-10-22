package com.umg.citasmedicas.dto;

import lombok.Data;

@Data
public class PerfilMedicoRequest {

    private String biografia;

    private String telefonoProfesional;

    private Integer aniosExperiencia;

    private String formacionAcademica;

    private String idiomas;

    private String ubicacionConsultorio;
}