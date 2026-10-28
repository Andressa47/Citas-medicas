package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.HorarioSemanal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorarioSemanalRepository
        extends JpaRepository<HorarioSemanal, Long> {

    List<HorarioSemanal> findByMedicoId(Long medicoId);

    void deleteByMedicoId(Long medicoId);
}
