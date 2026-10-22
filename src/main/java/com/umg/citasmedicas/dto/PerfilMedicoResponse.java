package com.umg.citasmedicas.dto;

import lombok.Data;

@Data
public class PerfilMedicoResponse {

    private Long medicoId;

    private String nombreCompleto;

    private String email;

    private Long especialidadId;

    private String especialidadNombre;

    private String numeroColegiado;

    private String biografia;

    private String telefonoProfesional;

    private Integer aniosExperiencia;

    private String formacionAcademica;

    private String idiomas;

    private String ubicacionConsultorio;
}