package com.umg.citasmedicas.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.umg.citasmedicas.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            unique = true,
            length = 150
    )
    private String email;

    @JsonProperty(
            access = JsonProperty.Access.WRITE_ONLY
    )
    @Column(
            nullable = false,
            length = 255
    )
    private String password;

    @Column(
            name = "nombre_completo",
            nullable = false,
            length = 150
    )
    private String nombreCompleto;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private Rol rol;

    @Column(
            name = "debe_cambiar_password",
            nullable = false
    )
    private boolean debeCambiarPassword = false;
}