package com.umg.citasmedicas.service;

import com.umg.citasmedicas.dto.ConversacionResponse;
import com.umg.citasmedicas.dto.CrearConversacionRequest;
import com.umg.citasmedicas.dto.MensajeChatRequest;
import com.umg.citasmedicas.dto.MensajeChatResponse;

import com.umg.citasmedicas.entity.Conversacion;
import com.umg.citasmedicas.entity.Medico;
import com.umg.citasmedicas.entity.MensajeChat;
import com.umg.citasmedicas.entity.Usuario;

import com.umg.citasmedicas.enums.Rol;

import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;

import com.umg.citasmedicas.repository.CitaRepository;
import com.umg.citasmedicas.repository.ConversacionRepository;
import com.umg.citasmedicas.repository.MedicoRepository;
import com.umg.citasmedicas.repository.MensajeChatRepository;
import com.umg.citasmedicas.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatService {

    private final ConversacionRepository conversacionRepository;
    private final MensajeChatRepository mensajeChatRepository;
    private final UsuarioRepository usuarioRepository;
    private final MedicoRepository medicoRepository;
    private final CitaRepository citaRepository;

    public ChatService(
            ConversacionRepository conversacionRepository,
            MensajeChatRepository mensajeChatRepository,
            UsuarioRepository usuarioRepository,
            MedicoRepository medicoRepository,
            CitaRepository citaRepository) {

        this.conversacionRepository = conversacionRepository;
        this.mensajeChatRepository = mensajeChatRepository;
        this.usuarioRepository = usuarioRepository;
        this.medicoRepository = medicoRepository;
        this.citaRepository = citaRepository;
    }


    // ==========================================
    // CREAR O RECUPERAR CONVERSACIÓN
    // ==========================================

    @Transactional
    public ConversacionResponse crearConversacion(
            CrearConversacionRequest request,
            String emailUsuario) {

        Usuario usuarioActual = obtenerUsuarioPorEmail(
                emailUsuario
        );

        Usuario paciente;
        Medico medico;


        if (usuarioActual.getRol() == Rol.ROLE_PATIENT) {

            paciente = usuarioActual;

            if (request.getMedicoId() == null) {
                throw new BusinessException(
                        "Debe indicar el médico."
                );
            }

            medico = medicoRepository
                    .findById(request.getMedicoId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "El médico seleccionado no existe."
                            )
                    );

        } else if (
                usuarioActual.getRol() == Rol.ROLE_DOCTOR
        ) {

            medico = medicoRepository
                    .findByUsuarioId(
                            usuarioActual.getId()
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "No se encontró el perfil médico del usuario autenticado."
                            )
                    );

            if (request.getPacienteId() == null) {
                throw new BusinessException(
                        "Debe indicar el paciente."
                );
            }

            paciente = usuarioRepository
                    .findById(request.getPacienteId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "El paciente seleccionado no existe."
                            )
                    );

        } else {

            throw new BusinessException(
                    "Este usuario no puede utilizar el chat médico."
            );
        }


        if (paciente.getRol() != Rol.ROLE_PATIENT) {
            throw new BusinessException(
                    "El usuario seleccionado no es un paciente."
            );
        }


        boolean existeRelacionMedica =
                citaRepository
                        .existsByPacienteIdAndMedicoId(
                                paciente.getId(),
                                medico.getId()
                        );


        if (!existeRelacionMedica) {
            throw new BusinessException(
                    "No existe una cita registrada entre el paciente y el médico."
            );
        }


        Conversacion conversacion =
                conversacionRepository
                        .findByPacienteIdAndMedicoId(
                                paciente.getId(),
                                medico.getId()
                        )
                        .orElseGet(() -> {

                            Conversacion nueva =
                                    new Conversacion();

                            nueva.setPaciente(
                                    paciente
                            );

                            nueva.setMedico(
                                    medico
                            );

                            return conversacionRepository
                                    .save(nueva);

                        });


        return convertirConversacion(
                conversacion
        );
    }


    // ==========================================
    // LISTAR MIS CONVERSACIONES
    // ==========================================

    public List<ConversacionResponse> listarMisConversaciones(
            String emailUsuario) {

        Usuario usuario =
                obtenerUsuarioPorEmail(
                        emailUsuario
                );


        List<Conversacion> conversaciones;


        if (usuario.getRol() == Rol.ROLE_PATIENT) {

            conversaciones =
                    conversacionRepository
                            .findByPacienteIdOrderByFechaActualizacionDesc(
                                    usuario.getId()
                            );

        } else if (
                usuario.getRol() == Rol.ROLE_DOCTOR
        ) {

            Medico medico =
                    medicoRepository
                            .findByUsuarioId(
                                    usuario.getId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "No se encontró el perfil médico."
                                    )
                            );


            conversaciones =
                    conversacionRepository
                            .findByMedicoIdOrderByFechaActualizacionDesc(
                                    medico.getId()
                            );

        } else {

            throw new BusinessException(
                    "Este usuario no puede utilizar el chat médico."
            );
        }


        return conversaciones
                .stream()
                .map(this::convertirConversacion)
                .toList();
    }


    // ==========================================
    // LISTAR MENSAJES
    // ==========================================

    @Transactional
    public List<MensajeChatResponse> listarMensajes(
            Long conversacionId,
            String emailUsuario) {

        Usuario usuario =
                obtenerUsuarioPorEmail(
                        emailUsuario
                );


        Conversacion conversacion =
                obtenerConversacionValidada(
                        conversacionId,
                        usuario
                );


        List<MensajeChat> mensajes =
                mensajeChatRepository
                        .findByConversacionIdOrderByFechaEnvioAsc(
                                conversacion.getId()
                        );


        boolean hayCambios = false;


        for (MensajeChat mensaje : mensajes) {

            if (
                    !mensaje.isLeido()
                    &&
                    !mensaje.getRemitente()
                            .getId()
                            .equals(usuario.getId())
            ) {

                mensaje.setLeido(true);

                hayCambios = true;
            }
        }


        if (hayCambios) {
            mensajeChatRepository.saveAll(
                    mensajes
            );
        }


        return mensajes
                .stream()
                .map(
                        mensaje ->
                                convertirMensaje(
                                        mensaje,
                                        usuario.getId()
                                )
                )
                .toList();
    }


    // ==========================================
    // ENVIAR MENSAJE
    // ==========================================

    @Transactional
    public MensajeChatResponse enviarMensaje(
            Long conversacionId,
            MensajeChatRequest request,
            String emailUsuario) {

        Usuario usuario =
                obtenerUsuarioPorEmail(
                        emailUsuario
                );


        Conversacion conversacion =
                obtenerConversacionValidada(
                        conversacionId,
                        usuario
                );


        String contenido =
                request
                        .getContenido()
                        .trim();


        if (contenido.isBlank()) {
            throw new BusinessException(
                    "El mensaje no puede estar vacío."
            );
        }


        MensajeChat mensaje =
                new MensajeChat();

        mensaje.setConversacion(
                conversacion
        );

        mensaje.setRemitente(
                usuario
        );

        mensaje.setContenido(
                contenido
        );

        mensaje.setLeido(false);


        MensajeChat guardado =
                mensajeChatRepository
                        .save(mensaje);


        // Actualizar orden de conversaciones
        conversacion.setFechaActualizacion(
                LocalDateTime.now()
        );

        conversacionRepository.save(
                conversacion
        );


        return convertirMensaje(
                guardado,
                usuario.getId()
        );
    }


    // ==========================================
    // VALIDAR PARTICIPANTE
    // ==========================================

    private Conversacion obtenerConversacionValidada(
            Long conversacionId,
            Usuario usuario) {

        Conversacion conversacion =
                conversacionRepository
                        .findById(conversacionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La conversación no existe."
                                )
                        );


        boolean perteneceAlPaciente =
                usuario.getRol() == Rol.ROLE_PATIENT
                &&
                conversacion
                        .getPaciente()
                        .getId()
                        .equals(
                                usuario.getId()
                        );


        boolean perteneceAlMedico = false;


        if (usuario.getRol() == Rol.ROLE_DOCTOR) {

            Medico medico =
                    medicoRepository
                            .findByUsuarioId(
                                    usuario.getId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "No se encontró el perfil médico."
                                    )
                            );


            perteneceAlMedico =
                    conversacion
                            .getMedico()
                            .getId()
                            .equals(
                                    medico.getId()
                            );
        }


        if (
                !perteneceAlPaciente
                &&
                !perteneceAlMedico
        ) {

            throw new BusinessException(
                    "No tiene permiso para acceder a esta conversación."
            );
        }


        return conversacion;
    }


    // ==========================================
    // USUARIO AUTENTICADO
    // ==========================================

    private Usuario obtenerUsuarioPorEmail(
            String email) {

        return usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario autenticado no encontrado."
                        )
                );
    }


    // ==========================================
    // CONVERTIR CONVERSACIÓN
    // ==========================================

    private ConversacionResponse convertirConversacion(
            Conversacion conversacion) {

        ConversacionResponse response =
                new ConversacionResponse();


        response.setId(
                conversacion.getId()
        );


        response.setPacienteId(
                conversacion
                        .getPaciente()
                        .getId()
        );


        response.setPacienteNombre(
                conversacion
                        .getPaciente()
                        .getNombreCompleto()
        );


        response.setMedicoId(
                conversacion
                        .getMedico()
                        .getId()
        );


        response.setMedicoUsuarioId(
                conversacion
                        .getMedico()
                        .getUsuario()
                        .getId()
        );


        response.setMedicoNombre(
                conversacion
                        .getMedico()
                        .getUsuario()
                        .getNombreCompleto()
        );


        if (
                conversacion
                        .getMedico()
                        .getEspecialidad()
                != null
        ) {

            response.setEspecialidadNombre(
                    conversacion
                            .getMedico()
                            .getEspecialidad()
                            .getNombre()
            );
        }


        response.setFechaCreacion(
                conversacion.getFechaCreacion()
        );


        response.setFechaActualizacion(
                conversacion
                        .getFechaActualizacion()
        );


        return response;
    }


    // ==========================================
    // CONVERTIR MENSAJE
    // ==========================================

    private MensajeChatResponse convertirMensaje(
            MensajeChat mensaje,
            Long usuarioActualId) {

        MensajeChatResponse response =
                new MensajeChatResponse();


        response.setId(
                mensaje.getId()
        );


        response.setConversacionId(
                mensaje
                        .getConversacion()
                        .getId()
        );


        response.setRemitenteId(
                mensaje
                        .getRemitente()
                        .getId()
        );


        response.setRemitenteNombre(
                mensaje
                        .getRemitente()
                        .getNombreCompleto()
        );


        response.setRemitenteRol(
                mensaje
                        .getRemitente()
                        .getRol()
        );


        response.setContenido(
                mensaje.getContenido()
        );


        response.setFechaEnvio(
                mensaje.getFechaEnvio()
        );


        response.setLeido(
                mensaje.isLeido()
        );


        response.setEnviadoPorMi(
                mensaje
                        .getRemitente()
                        .getId()
                        .equals(usuarioActualId)
        );


        return response;
    }
}