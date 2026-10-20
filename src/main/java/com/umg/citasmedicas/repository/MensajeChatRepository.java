package com.umg.citasmedicas.repository;

import com.umg.citasmedicas.entity.MensajeChat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MensajeChatRepository
        extends JpaRepository<MensajeChat, Long> {

    List<MensajeChat> findByConversacionIdOrderByFechaEnvioAsc(
            Long conversacionId
    );
}