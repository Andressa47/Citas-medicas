package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.PerfilMedico;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerfilMedicoRepository
        extends JpaRepository<PerfilMedico, Long> {

    Optional<PerfilMedico> findByMedicoId(
            Long medicoId
    );
}