package com.umg.citasmedicas.service;

import com.umg.citasmedicas.dto.*;
import com.umg.citasmedicas.entity.*;
import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;
import com.umg.citasmedicas.repository.*;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfiguracionHorarioService {

    private static final int SEMANAS_A_GENERAR = 8;

    private final ConfiguracionHorarioMedicoRepository configuracionRepository;
    private final HorarioSemanalRepository horarioSemanalRepository;
    private final HorarioDisponibleRepository horarioDisponibleRepository;
    private final CitaRepository citaRepository;
    private final MedicoRepository medicoRepository;

    public ConfiguracionHorarioService(
            ConfiguracionHorarioMedicoRepository configuracionRepository,
            HorarioSemanalRepository horarioSemanalRepository,
            HorarioDisponibleRepository horarioDisponibleRepository,
            CitaRepository citaRepository,
            MedicoRepository medicoRepository) {

        this.configuracionRepository = configuracionRepository;
        this.horarioSemanalRepository = horarioSemanalRepository;
        this.horarioDisponibleRepository = horarioDisponibleRepository;
        this.citaRepository = citaRepository;
        this.medicoRepository = medicoRepository;
    }

    @Transactional(readOnly = true)
    public ConfiguracionHorarioResponse obtener(Long medicoId) {

        Medico medico = buscarMedico(medicoId);

        ConfiguracionHorarioMedico configuracion = configuracionRepository
                .findByMedicoId(medicoId)
                .orElse(null);

        List<HorarioSemanal> bloques = horarioSemanalRepository
                .findByMedicoId(medicoId);

        return construirResponse(
                medico,
                configuracion != null
                        ? configuracion.getDuracionConsultaMinutos()
                        : 30,
                bloques,
                0
        );
    }

    @Transactional
    public ConfiguracionHorarioResponse guardar(
            Long medicoId,
            ConfiguracionHorarioRequest request) {

        Medico medico = buscarMedico(medicoId);

        validarBloques(
                request.getBloques(),
                request.getDuracionConsultaMinutos()
        );

        ConfiguracionHorarioMedico configuracion = configuracionRepository
                .findByMedicoId(medicoId)
                .orElseGet(ConfiguracionHorarioMedico::new);

        configuracion.setMedico(medico);
        configuracion.setDuracionConsultaMinutos(
                request.getDuracionConsultaMinutos()
        );

        configuracionRepository.save(configuracion);

        horarioSemanalRepository.deleteByMedicoId(medicoId);
        horarioSemanalRepository.flush();

        List<HorarioSemanal> nuevosBloques = request.getBloques()
                .stream()
                .map(bloque -> {
                    HorarioSemanal horario = new HorarioSemanal();
                    horario.setMedico(medico);
                    horario.setDiaSemana(bloque.getDiaSemana());
                    horario.setHoraInicio(bloque.getHoraInicio());
                    horario.setHoraFin(bloque.getHoraFin());
                    return horario;
                })
                .collect(Collectors.toList());

        nuevosBloques = horarioSemanalRepository.saveAll(nuevosBloques);

        eliminarSlotsAutomaticosFuturosSinCita(medicoId);

        int generados = generarDisponibilidad(
                medico,
                request.getDuracionConsultaMinutos(),
                nuevosBloques
        );

        return construirResponse(
                medico,
                request.getDuracionConsultaMinutos(),
                nuevosBloques,
                generados
        );
    }

    @Transactional
    public void asegurarDisponibilidad(Long medicoId) {

        ConfiguracionHorarioMedico configuracion = configuracionRepository
                .findByMedicoId(medicoId)
                .orElse(null);

        if (configuracion == null) {
            return;
        }

        List<HorarioSemanal> bloques = horarioSemanalRepository
                .findByMedicoId(medicoId);

        if (bloques.isEmpty()) {
            return;
        }

        generarDisponibilidad(
                configuracion.getMedico(),
                configuracion.getDuracionConsultaMinutos(),
                bloques
        );
    }

    private Medico buscarMedico(Long medicoId) {
        return medicoRepository.findById(medicoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe un médico con el ID " + medicoId + "."
                ));
    }

    private void validarBloques(
            List<BloqueHorarioSemanalRequest> bloques,
            Integer duracionMinutos) {

        for (BloqueHorarioSemanalRequest bloque : bloques) {

            if (!bloque.getHoraFin().isAfter(bloque.getHoraInicio())) {
                throw new BusinessException(
                        "La hora de fin debe ser posterior a la hora de inicio."
                );
            }

            long minutosDisponibles = Duration.between(
                    bloque.getHoraInicio(),
                    bloque.getHoraFin()
            ).toMinutes();

            if (minutosDisponibles < duracionMinutos) {
                throw new BusinessException(
                        "El bloque de " + bloque.getDiaSemana()
                        + " es menor que la duración configurada para una consulta."
                );
            }
        }

        Map<DayOfWeek, List<BloqueHorarioSemanalRequest>> porDia =
                bloques.stream()
                        .collect(Collectors.groupingBy(
                                BloqueHorarioSemanalRequest::getDiaSemana
                        ));

        for (Map.Entry<DayOfWeek, List<BloqueHorarioSemanalRequest>> entry
                : porDia.entrySet()) {

            List<BloqueHorarioSemanalRequest> delDia = entry.getValue()
                    .stream()
                    .sorted(Comparator.comparing(
                            BloqueHorarioSemanalRequest::getHoraInicio
                    ))
                    .toList();

            for (int i = 1; i < delDia.size(); i++) {

                BloqueHorarioSemanalRequest anterior = delDia.get(i - 1);
                BloqueHorarioSemanalRequest actual = delDia.get(i);

                if (actual.getHoraInicio().isBefore(anterior.getHoraFin())) {
                    throw new BusinessException(
                            "Existen bloques que se cruzan el día "
                            + entry.getKey() + "."
                    );
                }
            }
        }
    }

    private void eliminarSlotsAutomaticosFuturosSinCita(Long medicoId) {

        List<HorarioDisponible> candidatos = horarioDisponibleRepository
                .findByMedicoIdAndGeneradoAutomaticamenteTrueAndFechaHoraInicioAfter(
                        medicoId,
                        LocalDateTime.now()
                );

        List<HorarioDisponible> eliminables = candidatos.stream()
                .filter(horario -> !citaRepository.existsByHorarioId(horario.getId()))
                .toList();

        if (!eliminables.isEmpty()) {
            horarioDisponibleRepository.deleteAll(eliminables);
            horarioDisponibleRepository.flush();
        }
    }

    private int generarDisponibilidad(
            Medico medico,
            Integer duracionMinutos,
            List<HorarioSemanal> bloques) {

        LocalDateTime ahora = LocalDateTime.now();
        LocalDate fechaInicio = LocalDate.now();
        LocalDate fechaFin = fechaInicio.plusWeeks(SEMANAS_A_GENERAR);

        Map<DayOfWeek, List<HorarioSemanal>> bloquesPorDia = bloques.stream()
                .collect(Collectors.groupingBy(HorarioSemanal::getDiaSemana));

        int creados = 0;

        for (LocalDate fecha = fechaInicio;
             !fecha.isAfter(fechaFin);
             fecha = fecha.plusDays(1)) {

            List<HorarioSemanal> bloquesDelDia = bloquesPorDia
                    .getOrDefault(fecha.getDayOfWeek(), List.of());

            for (HorarioSemanal bloque : bloquesDelDia) {

                LocalDateTime cursor = LocalDateTime.of(
                        fecha,
                        bloque.getHoraInicio()
                );

                LocalDateTime finBloque = LocalDateTime.of(
                        fecha,
                        bloque.getHoraFin()
                );

                while (!cursor.plusMinutes(duracionMinutos).isAfter(finBloque)) {

                    LocalDateTime finSlot = cursor.plusMinutes(duracionMinutos);

                    if (cursor.isAfter(ahora)) {

                        boolean existeCruce = horarioDisponibleRepository
                                .existeCruceHorario(
                                        medico.getId(),
                                        cursor,
                                        finSlot,
                                        null
                                );

                        if (!existeCruce) {
                            HorarioDisponible slot = new HorarioDisponible();
                            slot.setMedico(medico);
                            slot.setFechaHoraInicio(cursor);
                            slot.setFechaHoraFin(finSlot);
                            slot.setDisponible(true);
                            slot.setGeneradoAutomaticamente(true);
                            horarioDisponibleRepository.save(slot);
                            creados++;
                        }
                    }

                    cursor = finSlot;
                }
            }
        }

        return creados;
    }

    private ConfiguracionHorarioResponse construirResponse(
            Medico medico,
            Integer duracion,
            List<HorarioSemanal> bloques,
            Integer generados) {

        ConfiguracionHorarioResponse response = new ConfiguracionHorarioResponse();
        response.setMedicoId(medico.getId());
        response.setMedicoNombre(
                medico.getUsuario() != null
                        ? medico.getUsuario().getNombreCompleto()
                        : "Médico " + medico.getId()
        );
        response.setDuracionConsultaMinutos(duracion);
        response.setHorariosGenerados(generados);

        List<BloqueHorarioSemanalResponse> bloquesResponse = bloques.stream()
                .sorted(
                        Comparator
                                .comparingInt((HorarioSemanal h) -> h.getDiaSemana().getValue())
                                .thenComparing(HorarioSemanal::getHoraInicio)
                )
                .map(horario -> {
                    BloqueHorarioSemanalResponse bloque =
                            new BloqueHorarioSemanalResponse();
                    bloque.setId(horario.getId());
                    bloque.setDiaSemana(horario.getDiaSemana());
                    bloque.setHoraInicio(horario.getHoraInicio());
                    bloque.setHoraFin(horario.getHoraFin());
                    return bloque;
                })
                .toList();

        response.setBloques(bloquesResponse);
        return response;
    }
}
