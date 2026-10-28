package com.umg.citasmedicas.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuraciones_horario_medico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionHorarioMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "medico_id", nullable = false, unique = true)
    private Medico medico;

    @Column(name = "duracion_consulta_minutos", nullable = false)
    private Integer duracionConsultaMinutos = 30;
}
