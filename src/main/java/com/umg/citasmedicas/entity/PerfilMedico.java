package com.umg.citasmedicas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "perfiles_medicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "medico_id",
            nullable = false,
            unique = true
    )
    private Medico medico;

    @Column(
            columnDefinition = "TEXT"
    )
    private String biografia;

    @Column(
            name = "telefono_profesional",
            length = 30
    )
    private String telefonoProfesional;

    @Column(
            name = "anios_experiencia",
            nullable = false
    )
    private Integer aniosExperiencia = 0;

    @Column(
            name = "formacion_academica",
            length = 500
    )
    private String formacionAcademica;

    @Column(
            length = 255
    )
    private String idiomas;

    @Column(
            name = "ubicacion_consultorio",
            length = 255
    )
    private String ubicacionConsultorio;
}