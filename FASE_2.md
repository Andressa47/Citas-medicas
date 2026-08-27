# Fase 2 - Lógica de Negocio y Servicios REST

**Periodo:** Semanas 3 - 4  
**Fecha de entrega:** 05/09

## Objetivo de la Fase 2

La Fase 2 tiene como objetivo fortalecer la lógica de negocio del backend y completar los servicios REST necesarios para garantizar que el proceso de agendamiento de citas sea seguro, consistente y correctamente validado.

Los requerimientos principales de esta fase son:

- Implementación del motor de disponibilidad de citas.
- Reglas de negocio para evitar cruces de horarios.
- Implementación y utilización de DTOs.
- Validación de datos de entrada mediante `@Valid`.
- Manejo global de excepciones mediante `@ControllerAdvice`.
- Revisión de los servicios REST desarrollados durante la Fase 1.
- Fortalecimiento del control de acceso según roles.

---

# Estado inicial de la Fase 2

Parte de la lógica necesaria para esta fase fue adelantada durante el desarrollo de la Fase 1.

Actualmente el backend ya permite:

- Crear bloques de horarios para médicos.
- Consultar horarios disponibles.
- Reservar una cita utilizando un horario.
- Verificar si un horario está disponible.
- Evitar reservar nuevamente un horario que ya fue utilizado.
- Cambiar automáticamente un horario a `disponible = false` después de crear una cita.
- Asociar automáticamente la cita con el médico correspondiente al horario.
- Consultar citas por paciente.
- Consultar citas por médico.
- Consultar el historial del paciente autenticado.
- Registrar diagnóstico y receta.
- Cambiar una cita a estado `COMPLETADA`.

Por lo tanto, durante la Fase 2 esta lógica deberá ser revisada, ampliada y validada para cumplir completamente los requisitos del proyecto.

---

# Distribución de responsabilidades - Fase 2

| Integrante | Rol | Responsabilidades principales durante Fase 2 |
|---|---|---|
| **Andre** | **Líder del proyecto / Integración** | Coordinar el desarrollo de la fase, revisar integración entre módulos, apoyar las pruebas generales, revisar Pull Requests y verificar que los servicios REST queden preparados para ser consumidos posteriormente por Angular e Ionic. |
| **Daniela** | **Base de Datos / DBA** | Revisar integridad de horarios y citas, restricciones de base de datos, relaciones, índices y consultas necesarias para detectar disponibilidad y cruces de horarios. Mantener actualizado el modelo de datos si se realizan cambios. |
| **Vivian** | **Backend / API REST** | Implementar y mejorar la lógica de disponibilidad, reglas para evitar cruces de horarios, DTOs, validaciones con `@Valid`, servicios y endpoints necesarios para completar la lógica de negocio. |
| **Alexis** | **Seguridad / QA y pruebas de API** | Implementar/revisar RBAC, manejo global de excepciones, pruebas de casos válidos e inválidos, actualización de Postman y verificación de respuestas HTTP y seguridad de los endpoints. |

> Aunque existen responsables principales, los cambios que involucren varias capas deben revisarse de manera colaborativa antes de integrarse a `main`.

---

# 1. Motor de disponibilidad de citas

## Objetivo

El sistema debe determinar correctamente qué horarios se encuentran disponibles para un médico en una fecha determinada.

Endpoint mínimo requerido:

```http
GET /api/v1/schedules/available
```

La consulta debe permitir utilizar como mínimo:

```text
medicoId
fecha
```

Ejemplo conceptual:

```http
GET /api/v1/schedules/available?medicoId=4&fecha=2026-09-05
```

El backend debe devolver únicamente los bloques que puedan ser reservados.

## Reglas mínimas

Un horario podrá considerarse disponible cuando:

```text
El horario existe
        +
Pertenece al médico solicitado
        +
Corresponde a la fecha solicitada
        +
disponible = true
        +
No existe una cita activa que ocupe el bloque
```

---

# 2. Prevención de cruces de horarios

Uno de los requisitos principales de esta fase es impedir conflictos de horarios.

## Regla general de solapamiento

Para dos intervalos:

```text
Horario existente:
[inicioExistente, finExistente)

Horario nuevo:
[inicioNuevo, finNuevo)
```

existe un cruce cuando:

```text
inicioNuevo < finExistente
Y
finNuevo > inicioExistente
```

Por ejemplo:

```text
Horario existente: 09:00 - 10:00
Horario nuevo:      09:30 - 10:30

Resultado: CONFLICTO
```

Mientras que:

```text
Horario existente: 09:00 - 10:00
Horario nuevo:      10:00 - 11:00

Resultado: PERMITIDO
```

Esto permite crear bloques consecutivos sin considerarlos un cruce.

## Validaciones necesarias

Antes de crear un horario:

- [ ] El médico debe existir.
- [ ] La fecha/hora de inicio debe existir.
- [ ] La fecha/hora de fin debe existir.
- [ ] La hora final debe ser posterior a la hora inicial.
- [ ] El médico no debe tener otro horario que se cruce con el nuevo bloque.

Antes de crear una cita:

- [ ] El paciente debe existir.
- [ ] El horario debe existir.
- [ ] El horario debe estar disponible.
- [ ] El horario no debe estar reservado por otra cita activa.
- [ ] El médico debe corresponder al horario seleccionado.
- [ ] La cita debe crearse inicialmente con un estado válido.

---

# 3. Cancelación de citas

El enunciado general establece que `ROLE_PATIENT` debe poder cancelar citas.

Por lo tanto, durante esta fase debe revisarse o implementarse la cancelación.

El estado correspondiente es:

```text
CANCELADA
```

Al cancelar una cita, se debe determinar según las reglas de negocio del proyecto si el horario vuelve a estar disponible.

Flujo esperado:

```text
Cita PENDIENTE
      ↓
Paciente cancela
      ↓
Cita CANCELADA
      ↓
Horario nuevamente disponible
```

La cancelación no debería eliminar físicamente la cita de la base de datos, ya que conservarla permite mantener trazabilidad e historial.

---

# 4. DTOs

Durante la Fase 1 algunos endpoints pueden trabajar directamente con entidades JPA.

En la Fase 2 se debe mejorar esta arquitectura utilizando DTOs.

## Objetivo

Evitar utilizar las entidades directamente como contratos de entrada y salida de la API cuando no sea necesario.

Estructura recomendada:

```text
dto/
│
├── LoginRequest.java
├── LoginResponse.java
├── UsuarioRequest.java
├── UsuarioResponse.java
├── MedicoRequest.java
├── MedicoResponse.java
├── HorarioRequest.java
├── HorarioResponse.java
├── CitaRequest.java
├── CitaResponse.java
└── DiagnosticoRequest.java
```

Los nombres pueden adaptarse a la estructura actual del proyecto.

## Ventajas

Los DTOs permiten:

- Evitar exponer información sensible.
- Controlar los campos que recibe el cliente.
- Controlar los campos que devuelve la API.
- Aplicar validaciones.
- Evitar enviar estructuras JPA innecesariamente grandes.
- Facilitar posteriormente el consumo desde Angular e Ionic.

Por ejemplo, nunca se debe devolver:

```text
password
```

en una respuesta de usuario.

---

# 5. Validaciones con @Valid

Los datos enviados por el cliente deben validarse antes de ejecutar la lógica de negocio.

Ejemplo:

```java
@PostMapping
public ResponseEntity<?> crear(
        @Valid @RequestBody CitaRequest request) {
    // lógica
}
```

Las validaciones se colocarán principalmente en los DTOs.

Ejemplo:

```java
@NotNull(message = "El paciente es obligatorio")
private Long pacienteId;

@NotNull(message = "El horario es obligatorio")
private Long horarioId;

@NotBlank(message = "El motivo de la cita es obligatorio")
@Size(max = 500, message = "El motivo no puede superar los 500 caracteres")
private String motivo;
```

Otras anotaciones que pueden utilizarse según corresponda:

```java
@NotNull
@NotBlank
@Email
@Size
@Future
@FutureOrPresent
@Positive
```

No se deben agregar validaciones únicamente por agregarlas; deben corresponder a las reglas reales del sistema.

---

# 6. Manejo global de excepciones

El proyecto debe implementar un controlador global mediante:

```java
@RestControllerAdvice
```

o:

```java
@ControllerAdvice
```

Estructura recomendada:

```text
exception/
│
├── GlobalExceptionHandler.java
├── ResourceNotFoundException.java
├── BusinessException.java
└── ScheduleConflictException.java
```

Los nombres pueden adaptarse a la arquitectura definitiva.

## Objetivo

Actualmente una excepción sin manejar puede producir una respuesta genérica como:

```json
{
  "status": 500,
  "error": "Internal Server Error"
}
```

Durante la Fase 2 se deben producir respuestas más claras y controladas.

Ejemplo:

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "El horario seleccionado ya se encuentra reservado",
  "path": "/api/v1/appointments"
}
```

---

# 7. Códigos HTTP

Los endpoints deben utilizar códigos HTTP adecuados.

| Código | Uso |
|---|---|
| `200 OK` | Consulta o actualización exitosa |
| `201 Created` | Recurso creado correctamente |
| `400 Bad Request` | Datos inválidos |
| `401 Unauthorized` | Usuario no autenticado |
| `403 Forbidden` | Usuario autenticado sin permisos |
| `404 Not Found` | Recurso inexistente |
| `409 Conflict` | Conflicto de horario o recurso |
| `500 Internal Server Error` | Error interno no controlado |

Los errores de negocio esperados no deberían terminar como `500`.

---

# 8. Control de acceso por roles (RBAC)

Durante esta fase también se debe comprobar que los permisos establecidos en el enunciado se respeten.

## ROLE_ADMIN

Debe tener acceso a:

- CRUD de usuarios.
- CRUD de médicos.
- CRUD de especialidades.
- Reporterías generales.

## ROLE_DOCTOR

Debe poder:

- Definir horarios de atención.
- Consultar su agenda.
- Consultar citas correspondientes.
- Registrar diagnósticos.
- Registrar recetas.

## ROLE_PATIENT

Debe poder:

- Consultar médicos.
- Buscar disponibilidad.
- Reservar citas.
- Cancelar citas.
- Consultar su historial.

Debe evitarse depender únicamente de que un endpoint tenga un JWT válido. También debe comprobarse que el **rol tenga autorización para ejecutar la operación correspondiente**.

---

# 9. Configuración CORS

El enunciado general requiere una configuración explícita de CORS para permitir posteriormente la comunicación con Angular e Ionic.

Durante esta fase se debe dejar preparada la configuración para los orígenes de desarrollo que utilizarán las interfaces.

No se recomienda dejar permanentemente:

```text
*
```

como origen permitido cuando la configuración definitiva de desarrollo ya sea conocida.

Esta configuración será especialmente importante durante las Fases 3 y 4.

---

# 10. Transacciones

Las operaciones que modifican varios registros relacionados deben utilizar transacciones cuando corresponda.

Ejemplo importante:

```text
Crear cita
    ↓
Guardar cita
    +
Cambiar disponibilidad del horario
```

Estas operaciones deben comportarse como una unidad.

Si una operación falla, no debería quedar:

```text
horario ocupado
+
cita no creada
```

o el caso contrario.

Spring permite manejar este comportamiento mediante:

```java
@Transactional
```

La lógica existente de creación de citas debe conservar este comportamiento.

---

# Orden recomendado de desarrollo

Para evitar que diferentes integrantes trabajen sobre código dependiente al mismo tiempo, se recomienda seguir este orden.

## Etapa 1 - Revisión inicial

**Responsables: Todo el equipo**

- [ ] Descargar/actualizar `main`.
- [ ] Ejecutar Spring Boot.
- [ ] Verificar conexión con MySQL.
- [ ] Ejecutar Login.
- [ ] Probar la colección Postman de Fase 1.
- [ ] Confirmar que el proyecto funciona antes de comenzar Fase 2.

---

## Etapa 2 - Base de datos y disponibilidad

**Responsable principal: Daniela**

- [ ] Revisar tablas de horarios y citas.
- [ ] Revisar claves foráneas.
- [ ] Revisar restricciones.
- [ ] Analizar consultas necesarias para detectar cruces.
- [ ] Revisar índices de campos utilizados frecuentemente.
- [ ] Actualizar `schema.sql` si se modifica la estructura.
- [ ] Actualizar el DER si cambia el modelo.

---

## Etapa 3 - Lógica de negocio

**Responsable principal: Vivian**

- [ ] Implementar/revisar motor de disponibilidad.
- [ ] Implementar prevención de cruces.
- [ ] Revisar reserva duplicada.
- [ ] Implementar/revisar cancelación de citas.
- [ ] Implementar DTOs.
- [ ] Implementar mapeo Entity ↔ DTO.
- [ ] Implementar `@Valid`.
- [ ] Revisar Services.
- [ ] Mantener operaciones transaccionales.

---

## Etapa 4 - Seguridad y excepciones

**Responsable principal: Alexis**

- [ ] Revisar permisos `ROLE_ADMIN`.
- [ ] Revisar permisos `ROLE_DOCTOR`.
- [ ] Revisar permisos `ROLE_PATIENT`.
- [ ] Implementar/revisar `@ControllerAdvice`.
- [ ] Definir respuestas de error.
- [ ] Probar `400`.
- [ ] Probar `401`.
- [ ] Probar `403`.
- [ ] Probar `404`.
- [ ] Probar `409`.
- [ ] Actualizar pruebas de Postman.

---

## Etapa 5 - Integración

**Responsable principal: Andre**

- [ ] Revisar cambios de todas las ramas.
- [ ] Comprobar que los formatos JSON sean adecuados para Angular e Ionic.
- [ ] Revisar consistencia de nombres de endpoints.
- [ ] Revisar CORS.
- [ ] Ejecutar pruebas completas.
- [ ] Revisar Pull Requests.
- [ ] Integrar los cambios estables a `main`.
- [ ] Actualizar documentación.

---

# Casos de prueba obligatorios

La colección Postman de Fase 2 debería comprobar al menos los siguientes escenarios.

## Casos exitosos

- [ ] Login correcto.
- [ ] Consulta de médicos.
- [ ] Filtro de médicos por especialidad.
- [ ] Creación de horario válido.
- [ ] Consulta de disponibilidad.
- [ ] Creación de cita.
- [ ] Consulta de historial.
- [ ] Registro de diagnóstico.
- [ ] Cancelación de cita.

## Casos inválidos

- [ ] Login incorrecto.
- [ ] Request sin JWT.
- [ ] Usuario sin el rol requerido.
- [ ] Crear horario con hora final anterior a la inicial.
- [ ] Crear dos horarios que se cruzan.
- [ ] Reservar un horario ocupado.
- [ ] Reservar un horario inexistente.
- [ ] Enviar campos obligatorios vacíos.
- [ ] Consultar un recurso inexistente.
- [ ] Registrar diagnóstico sobre una cita inexistente.
- [ ] Intentar cancelar una cita no permitida por las reglas definidas.

---

# Colección Postman - Fase 2

No es necesario eliminar la colección de Fase 1.

Se debe ampliar:

```text
Sistema_Citas_Medicas.postman_collection.json
```

agregando las nuevas pruebas correspondientes a:

```text
Disponibilidad
Cruces de horarios
Validaciones
Cancelación
Roles
Excepciones
```

Antes de subirla al repositorio se debe verificar nuevamente que no contenga tokens JWT reales ni credenciales.

---

# Git durante la Fase 2

Cada integrante continuará trabajando en su rama:

```text
main
│
├── andre
├── daniela
├── vivian
└── alexis
```

La rama:

```text
main
```

debe mantenerse estable.

El flujo recomendado es:

```text
Rama individual
      ↓
Desarrollo
      ↓
Pruebas
      ↓
Commit
      ↓
Push
      ↓
Pull Request
      ↓
Revisión
      ↓
Merge a main
```

No realizar cambios grandes directamente sobre `main`.

---

# Definición de terminado - Fase 2

La Fase 2 podrá considerarse terminada cuando:

- [ ] Los horarios no puedan cruzarse para un mismo médico.
- [ ] La consulta de disponibilidad devuelva únicamente horarios válidos.
- [ ] Un horario ocupado no pueda reservarse dos veces.
- [ ] La cancelación de citas funcione según las reglas definidas.
- [ ] Los endpoints principales utilicen DTOs donde corresponda.
- [ ] Los datos de entrada tengan validaciones mediante `@Valid`.
- [ ] Los errores sean gestionados mediante `@ControllerAdvice`.
- [ ] Los errores esperados utilicen códigos HTTP apropiados.
- [ ] Los permisos de ADMIN, DOCTOR y PATIENT hayan sido comprobados.
- [ ] Las operaciones relacionadas con citas mantengan integridad transaccional.
- [ ] CORS quede preparado para Angular e Ionic.
- [ ] La colección Postman esté actualizada.
- [ ] Todos los casos principales hayan sido probados.
- [ ] Spring Boot compile y ejecute correctamente desde `main`.
- [ ] El README esté actualizado.

---

# Resultado esperado de la Fase 2

Al finalizar esta fase, el backend debe quedar preparado para ser consumido por las interfaces del sistema.

```text
             BACKEND LISTO
                   │
          ┌────────┴────────┐
          ↓                 ↓
      FASE 3             FASE 4
      Angular              Ionic
   Panel Web          App de Pacientes
```

La **Fase 3** utilizará estos servicios para construir el panel web administrativo y médico, mientras que la **Fase 4** utilizará la misma API para implementar el flujo de agendamiento desde la aplicación móvil.
