
package com.umg.citasmedicas;

import com.umg.citasmedicas.entity.Usuario;
import com.umg.citasmedicas.enums.Rol;
import com.umg.citasmedicas.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String adminPassword = System.getenv("MEDULAR_ADMIN_PASSWORD");

        if (adminPassword == null || adminPassword.isBlank()) {
            System.out.println(
                    "Inicializacion de administrador omitida: " +
                    "MEDULAR_ADMIN_PASSWORD no configurada."
            );
            return;
        }

        if (!usuarioRepository.existsByEmail("admin@citas.com")) {

            Usuario admin = new Usuario();

            admin.setNombreCompleto("Administrador General");
            admin.setEmail("admin@citas.com");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRol(Rol.ROLE_ADMIN);

            usuarioRepository.save(admin);

            System.out.println(
                    "Usuario administrador creado correctamente."
            );
        }
    }
}
