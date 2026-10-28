package com.umg.citasmedicas.service;

import com.umg.citasmedicas.entity.Cita;
import com.umg.citasmedicas.entity.HorarioDisponible;
import com.umg.citasmedicas.entity.Usuario;

import com.umg.citasmedicas.enums.EstadoCita;
import com.umg.citasmedicas.enums.Rol;

import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;
import com.umg.citasmedicas.exception.ScheduleConflictException;

import com.umg.citasmedicas.repository.CitaRepository;
import com.umg.citasmedicas.repository.HorarioDisponibleRepository;
import com.umg.citasmedicas.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final HorarioDisponibleRepository horarioRepository;
    private final UsuarioRepository usuarioRepository;

    public CitaService(
            CitaRepository citaRepository,
            HorarioDisponibleRepository horarioRepository,
            UsuarioRepository usuarioRepository) {

        this.citaRepository = citaRepository;
        this.horarioRepository = horarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // ==========================================
    // LISTAR TODAS
    // ==========================================
    public List<Cita> listarTodas() {
        return citaRepository.findAll();
    }

    // ==========================================
    // BUSCAR POR ID
    // ==========================================
    public Optional<Cita> buscarPorId(Long id) {
        return citaRepository.findById(id);
    }

    // ==========================================
    // LISTAR POR PACIENTE
    // ==========================================
    public List<Cita> listarPorPaciente(Long pacienteId) {
        return citaRepository.findByPacienteId(pacienteId);
    }

    // ==========================================
    // LISTAR POR MÉDICO
    // ==========================================
    public List<Cita> listarPorMedico(Long medicoId) {
        return citaRepository.findByMedicoId(medicoId);
    }

    // ==========================================
    // CREAR CITA
    // ==========================================
    @Transactional
    public Cita crearCita(
            Long pacienteId,
            Long horarioId,
            String motivo) {

        Usuario paciente = usuarioRepository
                .findById(pacienteId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe un paciente con el ID "
                                + pacienteId + "."
                        )
                );

        if (paciente.getRol() != Rol.ROLE_PATIENT) {
            throw new BusinessException(
                    "El usuario seleccionado no tiene rol de paciente."
            );
        }

        HorarioDisponible horario = horarioRepository
                .findById(horarioId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe un horario con el ID "
                                + horarioId + "."
                        )
                );

        if (!horario.isDisponible()) {
            throw new ScheduleConflictException(
                    "El horario seleccionado no está disponible."
            );
        }

        if (!horario.getFechaHoraInicio().isAfter(LocalDateTime.now())) {
            throw new BusinessException(
                    "No se puede reservar una cita en una fecha u hora que ya pasó."
            );
        }

        if (citaRepository.existsByHorarioIdAndEstadoNot(
        horarioId,
        EstadoCita.CANCELADA)) {

    throw new ScheduleConflictException(
            "El horario ya fue reservado."
    );
}

        Cita cita = new Cita();

        cita.setPaciente(paciente);
        cita.setHorario(horario);
        cita.setMedico(horario.getMedico());
        cita.setMotivo(motivo);
        cita.setEstado(EstadoCita.PENDIENTE);

        horario.setDisponible(false);
        horarioRepository.save(horario);

        return citaRepository.save(cita);
    }

    // ==========================================
    // GUARDAR
    // ==========================================
    public Cita guardar(Cita cita) {
        return citaRepository.save(cita);
    }

    // ==========================================
    // REGISTRAR DIAGNÓSTICO
    // Solo el médico asignado puede diagnosticar
    // ==========================================
    @Transactional
    public Cita registrarDiagnostico(
            Long citaId,
            Long usuarioMedicoId,
            String diagnostico,
            String receta) {

        Cita cita = citaRepository
                .findById(citaId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe una cita con el ID "
                                + citaId + "."
                        )
                );

        if (cita.getMedico() == null
                || cita.getMedico().getUsuario() == null
                || !cita.getMedico()
                        .getUsuario()
                        .getId()
                        .equals(usuarioMedicoId)) {

            throw new BusinessException(
                    "No puede registrar un diagnóstico en una cita asignada a otro médico."
            );
        }

        if (cita.getEstado() == EstadoCita.CANCELADA) {
            throw new BusinessException(
                    "No se puede registrar un diagnóstico en una cita cancelada."
            );
        }

        cita.setDiagnostico(diagnostico);
        cita.setReceta(receta);
        cita.setEstado(EstadoCita.COMPLETADA);

        return citaRepository.save(cita);
    }

    // ==========================================
    // CANCELAR CITA
    // Solo el paciente dueño puede cancelar
    // ==========================================
    @Transactional
    public Cita cancelarCita(
            Long citaId,
            Long pacienteId) {

        Cita cita = citaRepository
                .findById(citaId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe una cita con el ID "
                                + citaId + "."
                        )
                );

        if (cita.getPaciente() == null
                || !cita.getPaciente()
                        .getId()
                        .equals(pacienteId)) {

            throw new BusinessException(
                    "No puede cancelar una cita que pertenece a otro paciente."
            );
        }

        if (cita.getEstado() == EstadoCita.CANCELADA) {
            throw new BusinessException(
                    "La cita ya se encuentra cancelada."
            );
        }

        if (cita.getEstado() == EstadoCita.COMPLETADA) {
            throw new BusinessException(
                    "No se puede cancelar una cita completada."
            );
        }

        HorarioDisponible horario = cita.getHorario();

        cita.setEstado(EstadoCita.CANCELADA);

        if (horario != null) {
            horario.setDisponible(true);
            horarioRepository.save(horario);
        }

        return citaRepository.save(cita);
    }
}