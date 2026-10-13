package com.umg.citasmedicas.controller;

import com.umg.citasmedicas.entity.Especialidad;
import com.umg.citasmedicas.service.EspecialidadService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/specialties")
public class EspecialidadController {

    private final EspecialidadService especialidadService;

    public EspecialidadController(EspecialidadService especialidadService) {
        this.especialidadService = especialidadService;
    }

    @GetMapping
    public List<Especialidad> listarTodas() {
        return especialidadService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Especialidad> buscarPorId(@PathVariable Long id) {
        return especialidadService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Especialidad crear(@RequestBody Especialidad especialidad) {
        return especialidadService.guardar(especialidad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Especialidad> actualizar(
            @PathVariable Long id,
            @RequestBody Especialidad especialidad) {

        if (especialidadService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        especialidad.setId(id);

        return ResponseEntity.ok(
                especialidadService.guardar(especialidad)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (especialidadService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        especialidadService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}