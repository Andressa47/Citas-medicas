package com.umg.citasmedicas.dto;

import com.umg.citasmedicas.entity.Cita;

public class CitaMapper {

    private CitaMapper() {
    }

    public static CitaResponse toResponse(Cita cita) {

        CitaResponse response = new CitaResponse();

        response.setId(cita.getId());

        // ==========================================
        // PACIENTE
        // ==========================================
        if (cita.getPaciente() != null) {

            response.setPacienteId(
                    cita.getPaciente().getId()
            );

            response.setPacienteNombre(
                    cita.getPaciente().getNombreCompleto()
            );
        }

        // ==========================================
        // MÉDICO
        // ==========================================
        if (cita.getMedico() != null) {

            response.setMedicoId(
                    cita.getMedico().getId()
            );

            if (cita.getMedico().getUsuario() != null) {

                response.setMedicoNombre(
                        cita.getMedico()
                                .getUsuario()
                                .getNombreCompleto()
                );
            }

            // ======================================
            // ESPECIALIDAD
            // ======================================
            if (cita.getMedico().getEspecialidad() != null) {

                response.setEspecialidadId(
                        cita.getMedico()
                                .getEspecialidad()
                                .getId()
                );

                response.setEspecialidadNombre(
                        cita.getMedico()
                                .getEspecialidad()
                                .getNombre()
                );
            }
        }

        // ==========================================
        // HORARIO
        // ==========================================
        if (cita.getHorario() != null) {

            response.setHorarioId(
                    cita.getHorario().getId()
            );

            response.setFechaHoraInicio(
                    cita.getHorario().getFechaHoraInicio()
            );

            response.setFechaHoraFin(
                    cita.getHorario().getFechaHoraFin()
            );
        }

        // ==========================================
        // DATOS DE LA CITA
        // ==========================================
        response.setEstado(cita.getEstado());
        response.setMotivo(cita.getMotivo());
        response.setDiagnostico(cita.getDiagnostico());
        response.setReceta(cita.getReceta());

        response.setFechaCreacion(
                cita.getFechaCreacion()
        );

        response.setFechaActualizacion(
                cita.getFechaActualizacion()
        );

        return response;
    }
}