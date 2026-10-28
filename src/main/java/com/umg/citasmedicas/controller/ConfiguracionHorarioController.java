package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.ConfiguracionHorarioRequest;
import com.umg.citasmedicas.dto.ConfiguracionHorarioResponse;
import com.umg.citasmedicas.service.ConfiguracionHorarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/schedule-config")
@PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
public class ConfiguracionHorarioController {

    private final ConfiguracionHorarioService configuracionHorarioService;

    public ConfiguracionHorarioController(
            ConfiguracionHorarioService configuracionHorarioService) {
        this.configuracionHorarioService = configuracionHorarioService;
    }

    @GetMapping("/{medicoId}")
    public ResponseEntity<ConfiguracionHorarioResponse> obtener(
            @PathVariable Long medicoId) {

        return ResponseEntity.ok(
                configuracionHorarioService.obtener(medicoId)
        );
    }

    @PutMapping("/{medicoId}")
    public ResponseEntity<ConfiguracionHorarioResponse> guardar(
            @PathVariable Long medicoId,
            @Valid @RequestBody ConfiguracionHorarioRequest request) {

        return ResponseEntity.ok(
                configuracionHorarioService.guardar(medicoId, request)
        );
    }
}
