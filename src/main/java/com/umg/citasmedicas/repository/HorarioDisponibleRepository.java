package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.HorarioDisponible;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HorarioDisponibleRepository
        extends JpaRepository<HorarioDisponible, Long> {

    // ==========================================
    // HORARIOS DISPONIBLES POR MÉDICO
    // ==========================================
    List<HorarioDisponible> findByMedicoIdAndDisponibleTrue(
            Long medicoId
    );

    // ==========================================
    // HORARIOS DISPONIBLES POR MÉDICO Y FECHA
    // ==========================================
    List<HorarioDisponible>
            findByMedicoIdAndFechaHoraInicioBetweenAndDisponibleTrue(
                    Long medicoId,
                    LocalDateTime inicio,
                    LocalDateTime fin
            );

    // ==========================================
    // DETECTAR CRUCE DE HORARIOS
    // ==========================================
    @Query("""
        SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END
        FROM HorarioDisponible h
        WHERE h.medico.id = :medicoId
        AND h.fechaHoraInicio < :finNuevo
        AND h.fechaHoraFin > :inicioNuevo
        AND (:horarioId IS NULL OR h.id <> :horarioId)
    """)
    boolean existeCruceHorario(
            @Param("medicoId") Long medicoId,
            @Param("inicioNuevo") LocalDateTime inicioNuevo,
            @Param("finNuevo") LocalDateTime finNuevo,
            @Param("horarioId") Long horarioId
    );
}