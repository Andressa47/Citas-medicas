package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.PerfilMedicoRequest;
import com.umg.citasmedicas.dto.PerfilMedicoResponse;
import com.umg.citasmedicas.service.PerfilMedicoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctor-profile")
@PreAuthorize(
        "hasAnyAuthority('DOCTOR', 'ROLE_DOCTOR')"
)
public class PerfilMedicoController {

    private final PerfilMedicoService perfilMedicoService;


    public PerfilMedicoController(
            PerfilMedicoService perfilMedicoService) {

        this.perfilMedicoService =
                perfilMedicoService;
    }


    // ==========================================
    // MI PERFIL
    // ==========================================

    @GetMapping("/me")
    public PerfilMedicoResponse obtenerMiPerfil(
            Authentication authentication) {

        return perfilMedicoService
                .obtenerMiPerfil(
                        authentication.getName()
                );
    }


    // ==========================================
    // ACTUALIZAR MI PERFIL
    // ==========================================

    @PutMapping("/me")
    public PerfilMedicoResponse actualizarMiPerfil(
            Authentication authentication,
            @RequestBody
            PerfilMedicoRequest request) {

        return perfilMedicoService
                .actualizarMiPerfil(
                        authentication.getName(),
                        request
                );
    }
}