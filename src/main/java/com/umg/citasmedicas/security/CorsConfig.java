package com.umg.citasmedicas.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

//@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // ==========================================
        // ORÍGENES PERMITIDOS
        // ==========================================
        configuration.setAllowedOrigins(List.of(
                "http://localhost:4200", // Angular
                "http://localhost:8100"  // Ionic
        ));

        // ==========================================
        // MÉTODOS HTTP PERMITIDOS
        // ==========================================
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        // ==========================================
        // HEADERS PERMITIDOS
        // ==========================================
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type"
        ));

        // Permite enviar el JWT en Authorization
        configuration.setAllowCredentials(true);

        // ==========================================
        // APLICAR CORS A TODA LA API
        // ==========================================
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/api/**",
                configuration
        );

        return source;
    }
}