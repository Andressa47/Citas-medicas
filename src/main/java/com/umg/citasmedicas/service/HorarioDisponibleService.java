package com.umg.citasmedicas.service;

import com.umg.citasmedicas.entity.HorarioDisponible;
import com.umg.citasmedicas.entity.Medico;
import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;
import com.umg.citasmedicas.exception.ScheduleConflictException;
import com.umg.citasmedicas.repository.CitaRepository;
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
    private final CitaRepository citaRepository;
    private final ConfiguracionHorarioService configuracionHorarioService;

    public HorarioDisponibleService(
            HorarioDisponibleRepository horarioRepository,
            MedicoRepository medicoRepository,
            CitaRepository citaRepository,
            ConfiguracionHorarioService configuracionHorarioService) {

        this.horarioRepository = horarioRepository;
        this.medicoRepository = medicoRepository;
        this.citaRepository = citaRepository;
        this.configuracionHorarioService = configuracionHorarioService;
    }

    public List<HorarioDisponible> listarTodos() {
        return horarioRepository.findAll();
    }

    public Optional<HorarioDisponible> buscarPorId(Long id) {
        return horarioRepository.findById(id);
    }

    @Transactional
    public List<HorarioDisponible> listarDisponiblesPorMedico(Long medicoId) {

        configuracionHorarioService.asegurarDisponibilidad(medicoId);

        return horarioRepository
                .findByMedicoIdAndDisponibleTrueAndFechaHoraInicioAfterOrderByFechaHoraInicioAsc(
                        medicoId,
                        LocalDateTime.now()
                );
    }

    @Transactional
    public List<HorarioDisponible> listarDisponiblesPorMedicoYFecha(
            Long medicoId,
            LocalDate fecha) {

        configuracionHorarioService.asegurarDisponibilidad(medicoId);

        if (fecha.isBefore(LocalDate.now())) {
            return List.of();
        }

        LocalDateTime inicio = fecha.atStartOfDay();
        LocalDateTime fin = fecha.atTime(LocalTime.MAX);

        List<HorarioDisponible> horarios = horarioRepository
                .findByMedicoIdAndFechaHoraInicioBetweenAndDisponibleTrueOrderByFechaHoraInicioAsc(
                        medicoId,
                        inicio,
                        fin
                );

        LocalDateTime ahora = LocalDateTime.now();

        return horarios.stream()
                .filter(horario -> horario.getFechaHoraInicio().isAfter(ahora))
                .toList();
    }

    @Transactional
    public HorarioDisponible crear(
            Long medicoId,
            LocalDateTime fechaHoraInicio,
            LocalDateTime fechaHoraFin,
            Boolean disponible) {

        Medico medico = medicoRepository.findById(medicoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe un médico con el ID " + medicoId + "."
                ));

        HorarioDisponible horario = new HorarioDisponible();
        horario.setMedico(medico);
        horario.setFechaHoraInicio(fechaHoraInicio);
        horario.setFechaHoraFin(fechaHoraFin);
        horario.setDisponible(disponible == null || disponible);
        horario.setGeneradoAutomaticamente(false);

        return guardar(horario);
    }

    @Transactional
    public HorarioDisponible guardar(HorarioDisponible horario) {

        if (horario.getMedico() == null
                || horario.getMedico().getId() == null) {
            throw new BusinessException("Debe seleccionar un médico.");
        }

        if (horario.getFechaHoraInicio() == null) {
            throw new BusinessException(
                    "La fecha y hora de inicio son obligatorias."
            );
        }

        if (horario.getFechaHoraFin() == null) {
            throw new BusinessException(
                    "La fecha y hora de fin son obligatorias."
            );
        }

        if (!horario.getFechaHoraFin().isAfter(horario.getFechaHoraInicio())) {
            throw new BusinessException(
                    "La hora de fin debe ser posterior a la hora de inicio."
            );
        }

        if (!horario.getFechaHoraInicio().isAfter(LocalDateTime.now())) {
            throw new BusinessException(
                    "No se pueden crear horarios en una fecha u hora que ya pasó."
            );
        }

        boolean existeCruce = horarioRepository.existeCruceHorario(
                horario.getMedico().getId(),
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

    @Transactional
    public void eliminar(Long id) {

        HorarioDisponible horario = horarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe un horario con el ID " + id + "."
                ));

        if (citaRepository.existsByHorarioId(id)) {
            throw new BusinessException(
                    "No se puede eliminar un horario que ya tiene una cita asociada."
            );
        }

        horarioRepository.delete(horario);
    }
}
