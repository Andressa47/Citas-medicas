package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.Cita;
import com.umg.citasmedicas.enums.EstadoCita;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CitaRepository
        extends JpaRepository<Cita, Long> {

    List<Cita> findByPacienteId(
            Long pacienteId
    );

    List<Cita> findByMedicoId(
            Long medicoId
    );

    boolean existsByHorarioIdAndEstadoNot(
            Long horarioId,
            EstadoCita estado
    );

    boolean existsByPacienteIdAndMedicoId(
            Long pacienteId,
            Long medicoId
    );
}