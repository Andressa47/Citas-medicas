package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.entity.Medico;
import com.umg.citasmedicas.service.MedicoService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctors")
public class MedicoController {

    private final MedicoService medicoService;

    public MedicoController(MedicoService medicoService) {
        this.medicoService = medicoService;
    }

    @GetMapping
    public List<Medico> listar(
            @RequestParam(required = false) Long especialidadId) {

        if (especialidadId != null) {
            return medicoService.buscarPorEspecialidad(especialidadId);
        }

        return medicoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarPorId(@PathVariable Long id) {
        return medicoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medico crear(@RequestBody Medico medico) {
        return medicoService.guardar(medico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medico> actualizar(
            @PathVariable Long id,
            @RequestBody Medico medico) {

        if (medicoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        medico.setId(id);

        return ResponseEntity.ok(
                medicoService.guardar(medico)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (medicoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        medicoService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}