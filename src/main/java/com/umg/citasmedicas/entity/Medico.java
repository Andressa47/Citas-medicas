package com.umg.citasmedicas.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
        name = "usuario_id",
        nullable = false,
        unique = true
    )
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(
        name = "especialidad_id",
        nullable = false
    )
    private Especialidad especialidad;

    @Column(
        name = "numero_colegiado",
        nullable = false,
        unique = true,
        length = 50
    )
    private String numeroColegiado;
}