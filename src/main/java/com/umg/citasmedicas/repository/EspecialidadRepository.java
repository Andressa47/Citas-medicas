package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.Especialidad;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EspecialidadRepository
        extends JpaRepository<Especialidad, Long> {

    Optional<Especialidad> findByNombreIgnoreCase(String nombre);
}