package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.ConfiguracionHorarioMedico;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracionHorarioMedicoRepository
        extends JpaRepository<ConfiguracionHorarioMedico, Long> {

    Optional<ConfiguracionHorarioMedico> findByMedicoId(Long medicoId);
}
