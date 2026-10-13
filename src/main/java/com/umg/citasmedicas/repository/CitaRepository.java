package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.Cita;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByPacienteId(Long pacienteId);

    List<Cita> findByMedicoId(Long medicoId);

    boolean existsByHorarioId(Long horarioId);
}