package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.Medico;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicoRepository
        extends JpaRepository<Medico, Long> {

    List<Medico> findByEspecialidadId(Long especialidadId);

    Optional<Medico> findByUsuarioId(Long usuarioId);

    Optional<Medico> findByNumeroColegiadoIgnoreCase(
            String numeroColegiado
    );
}