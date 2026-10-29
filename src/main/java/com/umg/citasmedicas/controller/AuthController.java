package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.CambiarPasswordObligatorioRequest;
import com.umg.citasmedicas.dto.LoginRequest;
import com.umg.citasmedicas.dto.LoginResponse;
import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.repository.UsuarioRepository;
import com.umg.citasmedicas.security.JwtUtils;
import com.umg.citasmedicas.service.UsuarioService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.umg.citasmedicas.dto.CambiarPasswordRequest;

import java.security.Principal;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final JwtUtils jwtUtils;

    private final UsuarioRepository usuarioRepository;

    private final UsuarioService usuarioService;


    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils,
            UsuarioRepository usuarioRepository,
            UsuarioService usuarioService) {

        this.authenticationManager =
                authenticationManager;

        this.jwtUtils =
                jwtUtils;

        this.usuarioRepository =
                usuarioRepository;

        this.usuarioService =
                usuarioService;
    }


    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );


        UserDetails userDetails =
                (UserDetails)
                        authentication
                                .getPrincipal();


        String token =
                jwtUtils.generarToken(
                        userDetails
                );


        Usuario usuario =
                usuarioRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow();


        LoginResponse response =
                new LoginResponse(
                        token,
                        "Bearer",
                        usuario.getEmail(),
                        usuario.getRol().name(),
                        usuario.isDebeCambiarPassword()
                );


        return ResponseEntity.ok(
                response
        );
    }


    // =========================================
    // CAMBIO OBLIGATORIO DE CONTRASEÑA
    // =========================================

    @PutMapping(
            "/change-required-password"
    )
    public ResponseEntity<?> cambiarPasswordObligatoria(
            @RequestBody
            CambiarPasswordObligatorioRequest request) {

        try {

            usuarioService
                    .cambiarPasswordObligatoria(
                            request
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "mensaje",
                            "Contraseña actualizada correctamente."
                    )
            );

        } catch (
                IllegalArgumentException e
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "mensaje",
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================================
// CAMBIO VOLUNTARIO DE CONTRASEÑA
// =========================================

@PutMapping("/change-password")
public ResponseEntity<?> cambiarPassword(
        @RequestBody
        CambiarPasswordRequest request,
        Principal principal) {

    try {

        usuarioService.cambiarPassword(
                principal.getName(),
                request
        );


        return ResponseEntity.ok(
                Map.of(
                        "mensaje",
                        "Contraseña actualizada correctamente."
                )
        );

    } catch (
            IllegalArgumentException e
    ) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "mensaje",
                                e.getMessage()
                        )
                );
    }
}

}