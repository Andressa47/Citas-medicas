package com.umg.citasmedicas.service;

import com.umg.citasmedicas.entity.Especialidad;
import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.repository.EspecialidadRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    public EspecialidadService(
            EspecialidadRepository especialidadRepository) {

        this.especialidadRepository = especialidadRepository;
    }


    // ==========================================
    // LISTAR TODAS
    // ==========================================

    public List<Especialidad> listarTodas() {

        return especialidadRepository.findAll();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    public Optional<Especialidad> buscarPorId(Long id) {

        return especialidadRepository.findById(id);
    }


    // ==========================================
    // GUARDAR / ACTUALIZAR
    // ==========================================

    public Especialidad guardar(Especialidad especialidad) {

        // Validar nombre obligatorio
        if (
            especialidad.getNombre() == null ||
            especialidad.getNombre().isBlank()
        ) {

            throw new BusinessException(
                "El nombre de la especialidad es obligatorio."
            );
        }


        // Quitar espacios al inicio y final
        String nombre =
                especialidad.getNombre().trim();

        especialidad.setNombre(nombre);


        // Buscar duplicados
        Optional<Especialidad> existente =
                especialidadRepository
                    .findByNombreIgnoreCase(nombre);


        if (existente.isPresent()) {

            Especialidad encontrada =
                    existente.get();

            /*
             * Si el ID es null estamos creando.
             *
             * Si tiene ID estamos editando.
             *
             * Solamente permitimos el mismo nombre
             * si pertenece al mismo registro.
             */
            if (
                especialidad.getId() == null ||
                !encontrada.getId()
                    .equals(especialidad.getId())
            ) {

                throw new BusinessException(
                    "Ya existe una especialidad con el nombre \""
                    + nombre
                    + "\"."
                );
            }
        }


        return especialidadRepository.save(especialidad);
    }


    // ==========================================
    // ELIMINAR
    // ==========================================

    public void eliminar(Long id) {

        especialidadRepository.deleteById(id);
    }
}