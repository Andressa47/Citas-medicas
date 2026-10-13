package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.CitaMapper;
import com.umg.citasmedicas.dto.CitaRequest;
import com.umg.citasmedicas.dto.CitaResponse;
import com.umg.citasmedicas.dto.DiagnosticoRequest;
import com.umg.citasmedicas.entity.Cita;
import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.exception.ResourceNotFoundException;
import com.umg.citasmedicas.repository.UsuarioRepository;
import com.umg.citasmedicas.service.CitaService;

import jakarta.validation.Valid;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/appointments")
public class CitaController {

    private final CitaService citaService;
    private final UsuarioRepository usuarioRepository;

    public CitaController(
            CitaService citaService,
            UsuarioRepository usuarioRepository) {

        this.citaService = citaService;
        this.usuarioRepository = usuarioRepository;
    }

    // ==========================================
    // CREAR CITA
    // El paciente se obtiene del JWT
    // ==========================================
    @PostMapping
    public ResponseEntity<CitaResponse> crear(
            @Valid @RequestBody CitaRequest request,
            Principal principal) {

        String email = principal.getName();

        Usuario paciente = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario autenticado no encontrado."
                        )
                );

        Cita cita = citaService.crearCita(
                paciente.getId(),
                request.getHorarioId(),
                request.getMotivo()
        );

        return ResponseEntity
                .status(201)
                .body(CitaMapper.toResponse(cita));
    }

    // ==========================================
    // LISTAR TODAS LAS CITAS
    // ==========================================
    @GetMapping
    public List<CitaResponse> listarTodas() {

        return citaService.listarTodas()
                .stream()
                .map(CitaMapper::toResponse)
                .toList();
    }

    // ==========================================
    // MI HISTORIAL
    // El paciente se obtiene del JWT
    // ==========================================
    @GetMapping("/my-history")
    public ResponseEntity<List<CitaResponse>> miHistorial(
            Principal principal) {

        String email = principal.getName();

        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario autenticado no encontrado."
                        )
                );

        List<CitaResponse> historial = citaService
                .listarPorPaciente(usuario.getId())
                .stream()
                .map(CitaMapper::toResponse)
                .toList();

        return ResponseEntity.ok(historial);
    }

    // ==========================================
    // HISTORIAL DE UN PACIENTE
    // ==========================================
    @GetMapping("/patient/{pacienteId}")
    public List<CitaResponse> historialPaciente(
            @PathVariable Long pacienteId) {

        return citaService.listarPorPaciente(pacienteId)
                .stream()
                .map(CitaMapper::toResponse)
                .toList();
    }

    // ==========================================
    // CITAS DE UN MÉDICO
    // ==========================================
    @GetMapping("/doctor/{medicoId}")
    public List<CitaResponse> citasMedico(
            @PathVariable Long medicoId) {

        return citaService.listarPorMedico(medicoId)
                .stream()
                .map(CitaMapper::toResponse)
                .toList();
    }

    // ==========================================
    // REGISTRAR DIAGNÓSTICO
    // Solo el médico asignado puede diagnosticar
    // ==========================================
    @PutMapping("/{id}/diagnosis")
    public ResponseEntity<CitaResponse> registrarDiagnostico(
            @PathVariable Long id,
            @Valid @RequestBody DiagnosticoRequest request,
            Principal principal) {

        String email = principal.getName();

        Usuario usuarioMedico = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario autenticado no encontrado."
                        )
                );

        Cita cita = citaService.registrarDiagnostico(
                id,
                usuarioMedico.getId(),
                request.getDiagnostico(),
                request.getReceta()
        );

        return ResponseEntity.ok(
                CitaMapper.toResponse(cita)
        );
    }

    // ==========================================
    // CANCELAR CITA
    // Solo el paciente dueño puede cancelar
    // ==========================================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<CitaResponse> cancelar(
            @PathVariable Long id,
            Principal principal) {

        String email = principal.getName();

        Usuario paciente = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario autenticado no encontrado."
                        )
                );

        Cita cita = citaService.cancelarCita(
                id,
                paciente.getId()
        );

        return ResponseEntity.ok(
                CitaMapper.toResponse(cita)
        );
    }

    // ==========================================
    // BUSCAR CITA POR ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<CitaResponse> buscarPorId(
            @PathVariable Long id) {

        return citaService.buscarPorId(id)
                .map(CitaMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }
}