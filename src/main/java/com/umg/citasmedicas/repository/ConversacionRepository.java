package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.Conversacion;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversacionRepository
        extends JpaRepository<Conversacion, Long> {

    Optional<Conversacion> findByPacienteIdAndMedicoId(
            Long pacienteId,
            Long medicoId
    );

    List<Conversacion> findByPacienteIdOrderByFechaActualizacionDesc(
            Long pacienteId
    );

    List<Conversacion> findByMedicoIdOrderByFechaActualizacionDesc(
            Long medicoId
    );
}