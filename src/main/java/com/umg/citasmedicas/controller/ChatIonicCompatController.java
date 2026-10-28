package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.MensajeChatRequest;
import com.umg.citasmedicas.dto.MensajeCitaCompatResponse;
import com.umg.citasmedicas.service.ChatIonicCompatService;

import jakarta.validation.Valid;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/appointments")
@PreAuthorize(
        "hasAnyAuthority('PATIENT', 'ROLE_PATIENT')"
)
public class ChatIonicCompatController {

    private final ChatIonicCompatService
            chatIonicCompatService;


    public ChatIonicCompatController(
            ChatIonicCompatService
                    chatIonicCompatService) {

        this.chatIonicCompatService =
                chatIonicCompatService;
    }


    // ==========================================
    // LISTAR MENSAJES
    // ==========================================

    @GetMapping(
            "/{citaId}/messages"
    )
    public ResponseEntity<
            List<MensajeCitaCompatResponse>>
            listarMensajes(
                    @PathVariable
                    Long citaId,
                    Principal principal) {

        return ResponseEntity.ok(
                chatIonicCompatService
                        .listarMensajes(
                                citaId,
                                principal.getName()
                        )
        );
    }


    // ==========================================
    // ENVIAR MENSAJE
    // ==========================================

    @PostMapping(
            "/{citaId}/messages"
    )
    public ResponseEntity<
            MensajeCitaCompatResponse>
            enviarMensaje(
                    @PathVariable
                    Long citaId,
                    @Valid
                    @RequestBody
                    MensajeChatRequest request,
                    Principal principal) {

        MensajeCitaCompatResponse response =
                chatIonicCompatService
                        .enviarMensaje(
                                citaId,
                                request,
                                principal.getName()
                        );


        return ResponseEntity
                .status(201)
                .body(response);
    }


    // ==========================================
    // MENSAJES NO LEÍDOS
    // ==========================================

    @GetMapping(
            "/{citaId}/messages/unread-count"
    )
    public ResponseEntity<Long>
            contarNoLeidos(
                    @PathVariable
                    Long citaId,
                    Principal principal) {

        return ResponseEntity.ok(
                chatIonicCompatService
                        .contarMensajesNoLeidos(
                                citaId,
                                principal.getName()
                        )
        );
    }
}