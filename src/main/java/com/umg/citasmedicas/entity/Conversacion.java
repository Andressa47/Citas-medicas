package com.umg.citasmedicas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "conversaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "paciente_id",
            nullable = false
    )
    private Usuario paciente;

    @ManyToOne
    @JoinColumn(
            name = "medico_id",
            nullable = false
    )
    private Medico medico;

    @CreationTimestamp
    @Column(
            name = "fecha_creacion",
            nullable = false,
            updatable = false
    )
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(
            name = "fecha_actualizacion",
            nullable = false
    )
    private LocalDateTime fechaActualizacion;
}