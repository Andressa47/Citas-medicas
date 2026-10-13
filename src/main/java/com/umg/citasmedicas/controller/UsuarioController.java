package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.service.UsuarioService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(
            @PathVariable Long id) {

        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(
            @RequestBody Usuario usuario) {

        return ResponseEntity.ok(
                usuarioService.guardar(usuario)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        if (usuarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        usuarioService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}