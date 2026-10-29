package com.umg.citasmedicas.service;

import com.umg.citasmedicas.dto.CambiarPasswordObligatorioRequest;
import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.umg.citasmedicas.dto.CambiarPasswordRequest;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository =
                usuarioRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    // =========================================
    // LISTAR
    // =========================================

    public List<Usuario> listarTodos() {

        return usuarioRepository.findAll();
    }


    // =========================================
    // BUSCAR POR ID
    // =========================================

    public Optional<Usuario> buscarPorId(
            Long id) {

        return usuarioRepository.findById(id);
    }


    // =========================================
    // BUSCAR POR EMAIL
    // =========================================

    public Optional<Usuario> buscarPorEmail(
            String email) {

        return usuarioRepository.findByEmail(
                email
        );
    }


    // =========================================
    // CREAR USUARIO
    // =========================================

    public Usuario guardar(
            Usuario usuario) {

        if (
                usuarioRepository
                        .existsByEmail(
                                usuario.getEmail()
                        )
        ) {

            throw new RuntimeException(
                    "Ya existe un usuario con ese email."
            );
        }


        if (
                usuario.getPassword() == null ||
                usuario.getPassword()
                        .trim()
                        .length() < 8
        ) {

            throw new IllegalArgumentException(
                    "La contraseña temporal debe tener al menos 8 caracteres."
            );
        }


        usuario.setPassword(
                passwordEncoder.encode(
                        usuario.getPassword()
                )
        );


        /*
         * Todo usuario creado por el
         * administrador deberá cambiar
         * su contraseña al iniciar sesión.
         */
        usuario.setDebeCambiarPassword(
                true
        );


        return usuarioRepository.save(
                usuario
        );
    }


    // =========================================
    // CAMBIO OBLIGATORIO DE CONTRASEÑA
    // =========================================

    public void cambiarPasswordObligatoria(
            CambiarPasswordObligatorioRequest request) {

        if (
                request.getEmail() == null ||
                request.getEmail().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "El correo es obligatorio."
            );
        }


        Usuario usuario =
                usuarioRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Usuario no encontrado."
                                        )
                        );


        if (
                !usuario.isDebeCambiarPassword()
        ) {

            throw new IllegalArgumentException(
                    "Este usuario no tiene un cambio de contraseña pendiente."
            );
        }


        if (
                request.getPasswordActual() == null ||
                !passwordEncoder.matches(
                        request.getPasswordActual(),
                        usuario.getPassword()
                )
        ) {

            throw new IllegalArgumentException(
                    "La contraseña temporal es incorrecta."
            );
        }


        if (
                request.getNuevaPassword() == null ||
                request.getConfirmarPassword() == null
        ) {

            throw new IllegalArgumentException(
                    "Debes ingresar y confirmar la nueva contraseña."
            );
        }


        if (
                !request.getNuevaPassword()
                        .equals(
                                request.getConfirmarPassword()
                        )
        ) {

            throw new IllegalArgumentException(
                    "Las contraseñas no coinciden."
            );
        }


        validarPasswordSegura(
                request.getNuevaPassword()
        );


        if (
                passwordEncoder.matches(
                        request.getNuevaPassword(),
                        usuario.getPassword()
                )
        ) {

            throw new IllegalArgumentException(
                    "La nueva contraseña debe ser diferente a la contraseña temporal."
            );
        }


        usuario.setPassword(
                passwordEncoder.encode(
                        request.getNuevaPassword()
                )
        );


        usuario.setDebeCambiarPassword(
                false
        );


        usuarioRepository.save(
                usuario
        );
    }

// =========================================
// CAMBIO VOLUNTARIO DE CONTRASEÑA
// =========================================

public void cambiarPassword(
        String email,
        CambiarPasswordRequest request) {

    if (
            email == null ||
            email.isBlank()
    ) {

        throw new IllegalArgumentException(
                "No se pudo identificar al usuario autenticado."
        );
    }


    Usuario usuario =
            usuarioRepository
                    .findByEmail(
                            email
                    )
                    .orElseThrow(
                            () ->
                                    new IllegalArgumentException(
                                            "Usuario no encontrado."
                                    )
                    );


    if (
            request.getPasswordActual() == null ||
            request.getPasswordActual().isBlank()
    ) {

        throw new IllegalArgumentException(
                "Debes ingresar tu contraseña actual."
        );
    }


    if (
            !passwordEncoder.matches(
                    request.getPasswordActual(),
                    usuario.getPassword()
            )
    ) {

        throw new IllegalArgumentException(
                "La contraseña actual es incorrecta."
        );
    }


    if (
            request.getNuevaPassword() == null ||
            request.getConfirmarPassword() == null
    ) {

        throw new IllegalArgumentException(
                "Debes ingresar y confirmar la nueva contraseña."
        );
    }


    if (
            !request.getNuevaPassword()
                    .equals(
                            request.getConfirmarPassword()
                    )
    ) {

        throw new IllegalArgumentException(
                "Las nuevas contraseñas no coinciden."
        );
    }


    validarPasswordSegura(
            request.getNuevaPassword()
    );


    if (
            passwordEncoder.matches(
                    request.getNuevaPassword(),
                    usuario.getPassword()
            )
    ) {

        throw new IllegalArgumentException(
                "La nueva contraseña debe ser diferente a la contraseña actual."
        );
    }


    usuario.setPassword(
            passwordEncoder.encode(
                    request.getNuevaPassword()
            )
    );


    usuario.setDebeCambiarPassword(
            false
    );


    usuarioRepository.save(
            usuario
    );
}
    // =========================================
    // VALIDAR CONTRASEÑA SEGURA
    // =========================================

    private void validarPasswordSegura(
            String password) {

        if (
                password.length() < 8
        ) {

            throw new IllegalArgumentException(
                    "La nueva contraseña debe tener al menos 8 caracteres."
            );
        }


        if (
                !password.matches(
                        ".*[A-Z].*"
                )
        ) {

            throw new IllegalArgumentException(
                    "La contraseña debe incluir al menos una letra mayúscula."
            );
        }


        if (
                !password.matches(
                        ".*[a-z].*"
                )
        ) {

            throw new IllegalArgumentException(
                    "La contraseña debe incluir al menos una letra minúscula."
            );
        }


        if (
                !password.matches(
                        ".*\\d.*"
                )
        ) {

            throw new IllegalArgumentException(
                    "La contraseña debe incluir al menos un número."
            );
        }


        if (
                !password.matches(
                        ".*[@$!%*?&._#-].*"
                )
        ) {

            throw new IllegalArgumentException(
                    "La contraseña debe incluir al menos un carácter especial."
            );
        }
    }


    // =========================================
    // ELIMINAR
    // =========================================

    public void eliminar(
            Long id) {

        usuarioRepository.deleteById(
                id
        );
    }
}