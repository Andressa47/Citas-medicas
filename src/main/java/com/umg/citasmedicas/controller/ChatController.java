package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.ConversacionResponse;
import com.umg.citasmedicas.dto.CrearConversacionRequest;
import com.umg.citasmedicas.dto.MensajeChatRequest;
import com.umg.citasmedicas.dto.MensajeChatResponse;

import com.umg.citasmedicas.service.ChatService;

import jakarta.validation.Valid;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;


    public ChatController(
            ChatService chatService) {

        this.chatService = chatService;
    }


    // ==========================================
    // CREAR O RECUPERAR CONVERSACIÓN
    // ==========================================

    @PostMapping("/conversations")
    public ResponseEntity<ConversacionResponse>
            crearConversacion(
                    @RequestBody
                    CrearConversacionRequest request,
                    Principal principal) {

        ConversacionResponse response =
                chatService.crearConversacion(
                        request,
                        principal.getName()
                );


        return ResponseEntity.ok(
                response
        );
    }


    // ==========================================
    // MIS CONVERSACIONES
    // ==========================================

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversacionResponse>>
            listarConversaciones(
                    Principal principal) {

        return ResponseEntity.ok(
                chatService
                        .listarMisConversaciones(
                                principal.getName()
                        )
        );
    }


    // ==========================================
    // MENSAJES DE UNA CONVERSACIÓN
    // ==========================================

    @GetMapping(
        "/conversations/{conversacionId}/messages"
    )
    public ResponseEntity<List<MensajeChatResponse>>
            listarMensajes(
                    @PathVariable
                    Long conversacionId,
                    Principal principal) {

        return ResponseEntity.ok(
                chatService.listarMensajes(
                        conversacionId,
                        principal.getName()
                )
        );
    }


    // ==========================================
    // ENVIAR MENSAJE
    // ==========================================

    @PostMapping(
        "/conversations/{conversacionId}/messages"
    )
    public ResponseEntity<MensajeChatResponse>
            enviarMensaje(
                    @PathVariable
                    Long conversacionId,
                    @Valid
                    @RequestBody
                    MensajeChatRequest request,
                    Principal principal) {

        MensajeChatResponse response =
                chatService.enviarMensaje(
                        conversacionId,
                        request,
                        principal.getName()
                );


        return ResponseEntity
                .status(201)
                .body(response);
    }
}