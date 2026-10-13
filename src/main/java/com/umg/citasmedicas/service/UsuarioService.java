package com.umg.citasmedicas.service;

import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario guardar(Usuario usuario) {

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email.");
        }

        usuario.setPassword(
                passwordEncoder.encode(usuario.getPassword())
        );

        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }
}