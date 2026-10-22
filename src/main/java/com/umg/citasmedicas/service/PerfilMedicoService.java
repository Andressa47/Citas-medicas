package com.umg.citasmedicas.service;

import com.umg.citasmedicas.dto.PerfilMedicoRequest;
import com.umg.citasmedicas.dto.PerfilMedicoResponse;
import com.umg.citasmedicas.entity.Medico;
import com.umg.citasmedicas.entity.PerfilMedico;
import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;
import com.umg.citasmedicas.repository.MedicoRepository;
import com.umg.citasmedicas.repository.PerfilMedicoRepository;
import com.umg.citasmedicas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class PerfilMedicoService {

    private final PerfilMedicoRepository perfilMedicoRepository;

    private final MedicoRepository medicoRepository;

    private final UsuarioRepository usuarioRepository;


    public PerfilMedicoService(
            PerfilMedicoRepository perfilMedicoRepository,
            MedicoRepository medicoRepository,
            UsuarioRepository usuarioRepository) {

        this.perfilMedicoRepository =
                perfilMedicoRepository;

        this.medicoRepository =
                medicoRepository;

        this.usuarioRepository =
                usuarioRepository;
    }


    // ==========================================
    // OBTENER PERFIL DEL MÉDICO AUTENTICADO
    // ==========================================

    public PerfilMedicoResponse obtenerMiPerfil(
            String email) {

        Medico medico =
                obtenerMedicoPorEmail(
                        email
                );


        PerfilMedico perfil =
                perfilMedicoRepository
                        .findByMedicoId(
                                medico.getId()
                        )
                        .orElse(null);


        return convertirAResponse(
                medico,
                perfil
        );
    }


    // ==========================================
    // ACTUALIZAR PERFIL
    // ==========================================

    public PerfilMedicoResponse actualizarMiPerfil(
            String email,
            PerfilMedicoRequest request) {

        Medico medico =
                obtenerMedicoPorEmail(
                        email
                );


        PerfilMedico perfil =
                perfilMedicoRepository
                        .findByMedicoId(
                                medico.getId()
                        )
                        .orElseGet(
                                PerfilMedico::new
                        );


        Integer experiencia =
                request.getAniosExperiencia();


        if (experiencia == null) {

            experiencia = 0;

        }


        if (
                experiencia < 0 ||
                experiencia > 80
        ) {

            throw new BusinessException(
                    "Los años de experiencia deben estar entre 0 y 80."
            );
        }


        perfil.setMedico(
                medico
        );


        perfil.setBiografia(
                normalizarTexto(
                        request.getBiografia(),
                        2000,
                        "La biografía"
                )
        );


        perfil.setTelefonoProfesional(
                normalizarTexto(
                        request.getTelefonoProfesional(),
                        30,
                        "El teléfono profesional"
                )
        );


        perfil.setAniosExperiencia(
                experiencia
        );


        perfil.setFormacionAcademica(
                normalizarTexto(
                        request.getFormacionAcademica(),
                        500,
                        "La formación académica"
                )
        );


        perfil.setIdiomas(
                normalizarTexto(
                        request.getIdiomas(),
                        255,
                        "Los idiomas"
                )
        );


        perfil.setUbicacionConsultorio(
                normalizarTexto(
                        request.getUbicacionConsultorio(),
                        255,
                        "La ubicación del consultorio"
                )
        );


        PerfilMedico guardado =
                perfilMedicoRepository
                        .save(
                                perfil
                        );


        return convertirAResponse(
                medico,
                guardado
        );
    }


    // ==========================================
    // OBTENER MÉDICO DESDE EL JWT
    // ==========================================

    private Medico obtenerMedicoPorEmail(
            String email) {

        Usuario usuario =
                usuarioRepository
                        .findByEmail(
                                email
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Usuario autenticado no encontrado."
                                        )
                        );


        return medicoRepository
                .findByUsuarioId(
                        usuario.getId()
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "No se encontró el perfil médico del usuario autenticado."
                                )
                );
    }


    // ==========================================
    // NORMALIZAR TEXTO
    // ==========================================

    private String normalizarTexto(
            String texto,
            int maximo,
            String campo) {

        if (texto == null) {

            return null;

        }


        String valor =
                texto.trim();


        if (valor.isEmpty()) {

            return null;

        }


        if (
                valor.length() > maximo
        ) {

            throw new BusinessException(
                    campo +
                    " no puede superar " +
                    maximo +
                    " caracteres."
            );
        }


        return valor;
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    private PerfilMedicoResponse convertirAResponse(
            Medico medico,
            PerfilMedico perfil) {

        PerfilMedicoResponse response =
                new PerfilMedicoResponse();


        response.setMedicoId(
                medico.getId()
        );


        response.setNombreCompleto(
                medico.getUsuario()
                        .getNombreCompleto()
        );


        response.setEmail(
                medico.getUsuario()
                        .getEmail()
        );


        response.setEspecialidadId(
                medico.getEspecialidad()
                        .getId()
        );


        response.setEspecialidadNombre(
                medico.getEspecialidad()
                        .getNombre()
        );


        response.setNumeroColegiado(
                medico.getNumeroColegiado()
        );


        if (perfil != null) {

            response.setBiografia(
                    perfil.getBiografia()
            );


            response.setTelefonoProfesional(
                    perfil.getTelefonoProfesional()
            );


            response.setAniosExperiencia(
                    perfil.getAniosExperiencia()
            );


            response.setFormacionAcademica(
                    perfil.getFormacionAcademica()
            );


            response.setIdiomas(
                    perfil.getIdiomas()
            );


            response.setUbicacionConsultorio(
                    perfil.getUbicacionConsultorio()
            );

        } else {

            response.setAniosExperiencia(
                    0
            );

        }


        return response;
    }
}