package com.umg.citasmedicas.service;

import com.umg.citasmedicas.dto.ConversacionResponse;
import com.umg.citasmedicas.dto.CrearConversacionRequest;
import com.umg.citasmedicas.dto.MensajeChatRequest;
import com.umg.citasmedicas.dto.MensajeChatResponse;
import com.umg.citasmedicas.dto.MensajeCitaCompatResponse;

import com.umg.citasmedicas.entity.Cita;
import com.umg.citasmedicas.entity.Conversacion;
import com.umg.citasmedicas.entity.MensajeChat;
import com.umg.citasmedicas.entity.Usuario;

import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;

import com.umg.citasmedicas.repository.CitaRepository;
import com.umg.citasmedicas.repository.ConversacionRepository;
import com.umg.citasmedicas.repository.MensajeChatRepository;
import com.umg.citasmedicas.repository.UsuarioRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ChatIonicCompatService {

    private final ChatService chatService;

    private final CitaRepository citaRepository;

    private final UsuarioRepository usuarioRepository;

    private final ConversacionRepository conversacionRepository;

    private final MensajeChatRepository mensajeChatRepository;


    public ChatIonicCompatService(
            ChatService chatService,
            CitaRepository citaRepository,
            UsuarioRepository usuarioRepository,
            ConversacionRepository conversacionRepository,
            MensajeChatRepository mensajeChatRepository) {

        this.chatService =
                chatService;

        this.citaRepository =
                citaRepository;

        this.usuarioRepository =
                usuarioRepository;

        this.conversacionRepository =
                conversacionRepository;

        this.mensajeChatRepository =
                mensajeChatRepository;
    }


    // ==========================================
    // LISTAR MENSAJES DESDE UNA CITA
    // ==========================================

    @Transactional
    public List<MensajeCitaCompatResponse>
            listarMensajes(
                    Long citaId,
                    String emailPaciente) {

        Cita cita =
                obtenerCitaValidada(
                        citaId,
                        emailPaciente
                );


        Long conversacionId =
                obtenerOCrearConversacion(
                        cita,
                        emailPaciente
                );


        return chatService
                .listarMensajes(
                        conversacionId,
                        emailPaciente
                )
                .stream()
                .map(
                        mensaje ->
                                convertirMensaje(
                                        mensaje,
                                        citaId
                                )
                )
                .toList();
    }


    // ==========================================
    // ENVIAR MENSAJE DESDE UNA CITA
    // ==========================================

    @Transactional
    public MensajeCitaCompatResponse
            enviarMensaje(
                    Long citaId,
                    MensajeChatRequest request,
                    String emailPaciente) {

        Cita cita =
                obtenerCitaValidada(
                        citaId,
                        emailPaciente
                );


        Long conversacionId =
                obtenerOCrearConversacion(
                        cita,
                        emailPaciente
                );


        MensajeChatResponse mensaje =
                chatService.enviarMensaje(
                        conversacionId,
                        request,
                        emailPaciente
                );


        return convertirMensaje(
                mensaje,
                citaId
        );
    }


    // ==========================================
    // CONTAR MENSAJES NO LEÍDOS
    // ==========================================

    @Transactional(readOnly = true)
    public long contarMensajesNoLeidos(
            Long citaId,
            String emailPaciente) {

        Cita cita =
                obtenerCitaValidada(
                        citaId,
                        emailPaciente
                );


        Usuario paciente =
                cita.getPaciente();


        Conversacion conversacion =
                conversacionRepository
                        .findByPacienteIdAndMedicoId(
                                paciente.getId(),
                                cita.getMedico()
                                        .getId()
                        )
                        .orElse(null);


        if (conversacion == null) {

            return 0L;

        }


        List<MensajeChat> mensajes =
                mensajeChatRepository
                        .findByConversacionIdOrderByFechaEnvioAsc(
                                conversacion.getId()
                        );


        return mensajes
                .stream()
                .filter(
                        mensaje ->
                                !mensaje.isLeido()
                                &&
                                !mensaje
                                        .getRemitente()
                                        .getId()
                                        .equals(
                                                paciente.getId()
                                        )
                )
                .count();
    }


    // ==========================================
    // VALIDAR CITA
    // ==========================================

    private Cita obtenerCitaValidada(
            Long citaId,
            String emailPaciente) {

        Usuario usuario =
                usuarioRepository
                        .findByEmail(
                                emailPaciente
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Usuario autenticado no encontrado."
                                        )
                        );


        Cita cita =
                citaRepository
                        .findById(
                                citaId
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "La cita no existe."
                                        )
                        );


        if (
                !cita.getPaciente()
                        .getId()
                        .equals(
                                usuario.getId()
                        )
        ) {

            throw new BusinessException(
                    "No tiene permiso para acceder al chat de esta cita."
            );
        }


        return cita;
    }


    // ==========================================
    // CREAR O RECUPERAR CONVERSACIÓN
    // ==========================================

    private Long obtenerOCrearConversacion(
            Cita cita,
            String emailPaciente) {

        CrearConversacionRequest request =
                new CrearConversacionRequest();


        request.setMedicoId(
                cita.getMedico()
                        .getId()
        );


        ConversacionResponse conversacion =
                chatService
                        .crearConversacion(
                                request,
                                emailPaciente
                        );


        return conversacion.getId();
    }


    // ==========================================
    // CONVERTIR DTO
    // ==========================================

    private MensajeCitaCompatResponse
            convertirMensaje(
                    MensajeChatResponse mensaje,
                    Long citaId) {

        MensajeCitaCompatResponse response =
                new MensajeCitaCompatResponse();


        response.setId(
                mensaje.getId()
        );


        response.setCitaId(
                citaId
        );


        response.setRemitenteId(
                mensaje.getRemitenteId()
        );


        response.setRemitenteNombre(
                mensaje.getRemitenteNombre()
        );


        response.setContenido(
                mensaje.getContenido()
        );


        response.setFechaHora(
                mensaje.getFechaEnvio()
        );


        response.setLeido(
                mensaje.isLeido()
        );


        return response;
    }
}