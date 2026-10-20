package com.umg.citasmedicas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "mensajes_chat")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensajeChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "conversacion_id",
            nullable = false
    )
    private Conversacion conversacion;

    @ManyToOne
    @JoinColumn(
            name = "remitente_id",
            nullable = false
    )
    private Usuario remitente;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String contenido;

    @CreationTimestamp
    @Column(
            name = "fecha_envio",
            nullable = false,
            updatable = false
    )
    private LocalDateTime fechaEnvio;

    @Column(
            name = "leido",
            nullable = false
    )
    private boolean leido = false;
}