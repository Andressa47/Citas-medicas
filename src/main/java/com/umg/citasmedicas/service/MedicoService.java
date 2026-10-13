package com.umg.citasmedicas.service;

import com.umg.citasmedicas.entity.Especialidad;
import com.umg.citasmedicas.entity.Medico;
import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.enums.Rol;
import com.umg.citasmedicas.exception.BusinessException;
import com.umg.citasmedicas.exception.ResourceNotFoundException;
import com.umg.citasmedicas.repository.EspecialidadRepository;
import com.umg.citasmedicas.repository.MedicoRepository;
import com.umg.citasmedicas.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class MedicoService {

    private final MedicoRepository medicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EspecialidadRepository especialidadRepository;

    public MedicoService(
            MedicoRepository medicoRepository,
            UsuarioRepository usuarioRepository,
            EspecialidadRepository especialidadRepository) {

        this.medicoRepository = medicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.especialidadRepository = especialidadRepository;
    }


    // ==========================================
    // LISTAR TODOS
    // ==========================================

    public List<Medico> listarTodos() {

        return medicoRepository.findAll();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    public Optional<Medico> buscarPorId(Long id) {

        return medicoRepository.findById(id);
    }


    // ==========================================
    // BUSCAR POR ESPECIALIDAD
    // ==========================================

    public List<Medico> buscarPorEspecialidad(
            Long especialidadId
    ) {

        return medicoRepository
                .findByEspecialidadId(especialidadId);
    }


    // ==========================================
    // GUARDAR / ACTUALIZAR
    // ==========================================

    public Medico guardar(Medico medico) {

        // --------------------------------------
        // VALIDAR USUARIO
        // --------------------------------------

        if (
            medico.getUsuario() == null ||
            medico.getUsuario().getId() == null
        ) {

            throw new BusinessException(
                "Debe seleccionar un usuario para el médico."
            );
        }


        // --------------------------------------
        // VALIDAR ESPECIALIDAD
        // --------------------------------------

        if (
            medico.getEspecialidad() == null ||
            medico.getEspecialidad().getId() == null
        ) {

            throw new BusinessException(
                "Debe seleccionar una especialidad."
            );
        }


        // --------------------------------------
        // VALIDAR COLEGIADO
        // --------------------------------------

        if (
            medico.getNumeroColegiado() == null ||
            medico.getNumeroColegiado().isBlank()
        ) {

            throw new BusinessException(
                "El número de colegiado es obligatorio."
            );
        }


        Long usuarioId =
                medico.getUsuario().getId();

        String numeroColegiado =
                medico.getNumeroColegiado().trim();


        // --------------------------------------
        // BUSCAR USUARIO REAL
        // --------------------------------------

        Usuario usuario =
                usuarioRepository
                    .findById(usuarioId)
                    .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Usuario no encontrado."
                        )
                    );


        // --------------------------------------
        // VALIDAR QUE SEA ROLE_DOCTOR
        // --------------------------------------

        if (usuario.getRol() != Rol.ROLE_DOCTOR) {

            throw new BusinessException(
                "El usuario seleccionado no tiene rol de médico."
            );
        }


        // --------------------------------------
        // EVITAR USUARIO MÉDICO DUPLICADO
        // --------------------------------------

        Optional<Medico> medicoPorUsuario =
                medicoRepository
                    .findByUsuarioId(usuarioId);


        if (medicoPorUsuario.isPresent()) {

            Medico existente =
                    medicoPorUsuario.get();

            if (
                medico.getId() == null ||
                !existente.getId()
                    .equals(medico.getId())
            ) {

                throw new BusinessException(
                    "El usuario seleccionado ya tiene un perfil médico."
                );
            }
        }


        // --------------------------------------
        // EVITAR COLEGIADO DUPLICADO
        // --------------------------------------

        Optional<Medico> medicoPorColegiado =
                medicoRepository
                    .findByNumeroColegiadoIgnoreCase(
                        numeroColegiado
                    );


        if (medicoPorColegiado.isPresent()) {

            Medico existente =
                    medicoPorColegiado.get();

            if (
                medico.getId() == null ||
                !existente.getId()
                    .equals(medico.getId())
            ) {

                throw new BusinessException(
                    "Ya existe un médico con el número de colegiado \""
                    + numeroColegiado
                    + "\"."
                );
            }
        }


        // --------------------------------------
        // BUSCAR ESPECIALIDAD REAL
        // --------------------------------------

        Especialidad especialidad =
                especialidadRepository
                    .findById(
                        medico.getEspecialidad().getId()
                    )
                    .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Especialidad no encontrada."
                        )
                    );


        // --------------------------------------
        // ASIGNAR ENTIDADES REALES
        // --------------------------------------

        medico.setUsuario(usuario);

        medico.setEspecialidad(especialidad);

        medico.setNumeroColegiado(
            numeroColegiado
        );


        // --------------------------------------
        // GUARDAR
        // --------------------------------------

        return medicoRepository.save(medico);
    }


    // ==========================================
    // ELIMINAR
    // ==========================================

    public void eliminar(Long id) {

        medicoRepository.deleteById(id);
    }
}