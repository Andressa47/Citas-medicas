package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.HorarioRequest;
import com.umg.citasmedicas.entity.HorarioDisponible;
import com.umg.citasmedicas.service.HorarioDisponibleService;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/schedules")
public class HorarioDisponibleController {

    private final HorarioDisponibleService horarioService;

    public HorarioDisponibleController(
            HorarioDisponibleService horarioService) {

        this.horarioService = horarioService;
    }   

    // ==========================================
    // CONSULTAR HORARIOS DISPONIBLES
    // ==========================================
    @GetMapping("/available")
    public List<HorarioDisponible> listarDisponibles(
            @RequestParam Long medicoId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha) {

        if (fecha != null) {

            return horarioService
                    .listarDisponiblesPorMedicoYFecha(
                            medicoId,
                            fecha
                    );
        }

        return horarioService
                .listarDisponiblesPorMedico(medicoId);
    }

    // ==========================================
    // CREAR HORARIO
    // ==========================================
    @PostMapping
    public ResponseEntity<HorarioDisponible> crear(
            @Valid @RequestBody HorarioRequest request) {

        HorarioDisponible horario = horarioService.crear(
                request.getMedicoId(),
                request.getFechaHoraInicio(),
                request.getFechaHoraFin(),
                request.getDisponible()
        );

        return ResponseEntity
                .status(201)
                .body(horario);
    }

    // ==========================================
    // ELIMINAR HORARIO
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        if (horarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        horarioService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}