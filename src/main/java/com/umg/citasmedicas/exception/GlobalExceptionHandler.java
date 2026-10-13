package com.umg.citasmedicas.exception;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==========================================
    // CONFLICTO DE HORARIOS -> 409
    // ==========================================
    @ExceptionHandler(ScheduleConflictException.class)
    public ResponseEntity<Map<String, Object>> manejarConflictoHorario(
            ScheduleConflictException ex,
            HttpServletRequest request) {

        return construirRespuesta(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    // ==========================================
    // VALIDACIONES @VALID -> 400
    // ==========================================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidaciones(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errores.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> respuesta = new LinkedHashMap<>();

        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("status", HttpStatus.BAD_REQUEST.value());
        respuesta.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        respuesta.put("message", "Hay errores de validación.");
        respuesta.put("errors", errores);
        respuesta.put("path", request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(respuesta);
    }

    // ==========================================
    // REGLA DE NEGOCIO INVÁLIDA -> 400
    // ==========================================
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> manejarReglaNegocio(
            BusinessException ex,
            HttpServletRequest request) {

        return construirRespuesta(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    // ==========================================
    // RECURSO NO ENCONTRADO -> 404
    // ==========================================
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> manejarNoEncontrado(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        return construirRespuesta(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    // ==========================================
    // CONSTRUIR RESPUESTA
    // ==========================================
    private ResponseEntity<Map<String, Object>> construirRespuesta(
            HttpStatus status,
            String mensaje,
            String path) {

        Map<String, Object> respuesta = new LinkedHashMap<>();

        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("status", status.value());
        respuesta.put("error", status.getReasonPhrase());
        respuesta.put("message", mensaje);
        respuesta.put("path", path);

        return ResponseEntity
                .status(status)
                .body(respuesta);
    }
}