package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.dto.LoginRequest;
import com.umg.citasmedicas.dto.LoginResponse;
import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.repository.UsuarioRepository;
import com.umg.citasmedicas.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UsuarioRepository usuarioRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils,
            UsuarioRepository usuarioRepository) {

        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.usuarioRepository = usuarioRepository;
    }

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
                (UserDetails) authentication.getPrincipal();

        String token =
                jwtUtils.generarToken(userDetails);

        Usuario usuario =
                usuarioRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow();

        LoginResponse response =
                new LoginResponse(
                        token,
                        "Bearer",
                        usuario.getEmail(),
                        usuario.getRol().name()
                );

        return ResponseEntity.ok(response);
    }
}