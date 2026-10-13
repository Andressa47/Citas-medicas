package com.umg.citasmedicas.service;

import com.umg.citasmedicas.entity.HorarioDisponible;
import com.umg.citasmedicas.entity.Medico;
import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;
import com.umg.citasmedicas.exception.ScheduleConflictException;
import com.umg.citasmedicas.repository.HorarioDisponibleRepository;
import com.umg.citasmedicas.repository.MedicoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
public class HorarioDisponibleService {

    private final HorarioDisponibleRepository horarioRepository;
    private final MedicoRepository medicoRepository;

    public HorarioDisponibleService(
            HorarioDisponibleRepository horarioRepository,
            MedicoRepository medicoRepository) {

        this.horarioRepository = horarioRepository;
        this.medicoRepository = medicoRepository;
    }

    // ==========================================
    // LISTAR TODOS
    // ==========================================
    public List<HorarioDisponible> listarTodos() {
        return horarioRepository.findAll();
    }

    // ==========================================
    // BUSCAR POR ID
    // ==========================================
    public Optional<HorarioDisponible> buscarPorId(Long id) {
        return horarioRepository.findById(id);
    }

    // ==========================================
    // DISPONIBLES POR MÉDICO
    // ==========================================
    public List<HorarioDisponible> listarDisponiblesPorMedico(
            Long medicoId) {

        return horarioRepository
                .findByMedicoIdAndDisponibleTrue(medicoId);
    }

    // ==========================================
    // DISPONIBLES POR MÉDICO Y FECHA
    // ==========================================
    public List<HorarioDisponible> listarDisponiblesPorMedicoYFecha(
            Long medicoId,
            LocalDate fecha) {

        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin = fecha.atTime(LocalTime.MAX);

        return horarioRepository
                .findByMedicoIdAndFechaHoraInicioBetweenAndDisponibleTrue(
                        medicoId,
                        inicio,
                        fin
                );
    }

    // ==========================================
    // CREAR HORARIO DESDE DTO
    // ==========================================
    @Transactional
    public HorarioDisponible crear(
            Long medicoId,
            LocalDateTime fechaHoraInicio,
            LocalDateTime fechaHoraFin,
            Boolean disponible) {

        // Buscar al médico real en la base de datos
        Medico medico = medicoRepository.findById(medicoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe un médico con el ID "
                                + medicoId + "."
                        )
                );

        HorarioDisponible horario = new HorarioDisponible();

        horario.setMedico(medico);
        horario.setFechaHoraInicio(fechaHoraInicio);
        horario.setFechaHoraFin(fechaHoraFin);

        if (disponible == null) {
            horario.setDisponible(true);
        } else {
            horario.setDisponible(disponible);
        }

        // Reutilizamos todas las validaciones de guardar()
        return guardar(horario);
    }

    // ==========================================
    // GUARDAR HORARIO
    // ==========================================
    @Transactional
    public HorarioDisponible guardar(
            HorarioDisponible horario) {

        // 1. Validar médico
        if (horario.getMedico() == null
                || horario.getMedico().getId() == null) {

            throw new BusinessException(
                    "Debe seleccionar un médico."
            );
        }

        // 2. Validar fecha/hora de inicio
        if (horario.getFechaHoraInicio() == null) {

            throw new BusinessException(
                    "La fecha y hora de inicio son obligatorias."
            );
        }

        // 3. Validar fecha/hora de fin
        if (horario.getFechaHoraFin() == null) {

            throw new BusinessException(
                    "La fecha y hora de fin son obligatorias."
            );
        }

        // 4. El final debe ser posterior al inicio
        if (!horario.getFechaHoraFin()
                .isAfter(horario.getFechaHoraInicio())) {

            throw new BusinessException(
                    "La hora de fin debe ser posterior a la hora de inicio."
            );
        }

        Long medicoId = horario.getMedico().getId();

        // ==========================================
        // 5. COMPROBAR CRUCE DE HORARIOS
        // ==========================================
        boolean existeCruce =
                horarioRepository.existeCruceHorario(
                        medicoId,
                        horario.getFechaHoraInicio(),
                        horario.getFechaHoraFin(),
                        horario.getId()
                );

        if (existeCruce) {

            throw new ScheduleConflictException(
                    "El médico ya tiene un horario que se cruza con este bloque."
            );
        }

        return horarioRepository.save(horario);
    }

    // ==========================================
    // ELIMINAR
    // ==========================================
    public void eliminar(Long id) {
        horarioRepository.deleteById(id);
    }
}