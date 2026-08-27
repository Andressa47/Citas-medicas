# Fase 2 - Guía

## Objetivo de esta guía

Esta sección explica **qué debe hacer cada integrante, en qué orden y cómo comprobar que terminó su parte**.

La idea es evitar que varias personas modifiquen lo mismo al mismo tiempo.

---

# Orden de trabajo recomendado

La Fase 2 se trabajará en este orden:

```text
1. DANIELA
   Base de datos y revisión de horarios
        ↓
2. VIVIAN
   Lógica de negocio + DTOs + validaciones
        ↓
3. ALEXIS
   Seguridad + manejo de errores + pruebas
        ↓
4. ANDRE
   Integración final + revisión + documentación
```

No significa que una persona tenga que esperar completamente a la otra, pero **los cambios que dependan del paso anterior deben hacerse después de que ese paso esté integrado**.

---

# PASO 0 - Todos antes de empezar

## Responsable: TODO EL EQUIPO

Antes de modificar código:

### 1. Descargar la versión actual

Cada integrante debe trabajar con la versión más reciente de `main`.

```bash
git switch main
git pull
```

Después debe ir a su rama:

```bash
git switch nombre-rama
```

Ejemplo:

```bash
git switch vivian
```

### 2. Verificar que el proyecto funcione

Antes de empezar Fase 2:

- [ ] MySQL está encendido.
- [ ] Existe `citas_medicas`.
- [ ] Spring Boot inicia.
- [ ] Login funciona.
- [ ] Postman funciona.
- [ ] Se pueden listar médicos.
- [ ] Se pueden consultar horarios.
- [ ] Se pueden listar citas.

Si algo ya está roto antes de comenzar, avisar al equipo antes de modificar código.

---

# PASO 1 - DANIELA

## Responsable de Base de Datos / DBA

### Objetivo

Daniela debe comprobar que la base de datos pueda soportar correctamente las reglas nuevas de horarios y citas.

**No necesita rehacer la base de datos.**

Debe trabajar principalmente revisando:

```text
medicos
horarios_disponibles
citas
```

---

## Tarea 1.1 - Revisar las relaciones

Comprobar en MySQL que existan correctamente:

```text
medicos.id
    ↓
horarios_disponibles.medico_id
```

y:

```text
horarios_disponibles.id
    ↓
citas.horario_id
```

También:

```text
usuarios.id
    ↓
citas.paciente_id
```

y:

```text
medicos.id
    ↓
citas.medico_id
```

### Resultado esperado

No debe haber registros que apunten a IDs inexistentes.

---

## Tarea 1.2 - Revisar estructura de horarios

La tabla:

```text
horarios_disponibles
```

debe permitir identificar como mínimo:

```text
id
medico_id
fecha_hora_inicio
fecha_hora_fin
disponible
```

Debe confirmar que:

```text
fecha_hora_inicio < fecha_hora_fin
```

será una regla manejada por el backend.

No necesita agregar otra columna si la información ya está disponible.

---

## Tarea 1.3 - Revisar estructura de citas

La tabla `citas` debe conservar:

```text
paciente_id
medico_id
horario_id
estado
motivo
diagnostico
receta
fecha_creacion
fecha_actualizacion
```

No volver a agregar campos antiguos o duplicados como:

```text
fecha_hora
```

si la fecha de la cita ya se obtiene mediante `horario_id`.

---

## Tarea 1.4 - Revisar índices

Consultar con el equipo antes de cambiar algo, pero revisar si sería útil tener índices en:

```text
horarios_disponibles.medico_id
horarios_disponibles.fecha_hora_inicio
citas.paciente_id
citas.medico_id
citas.horario_id
```

Las claves foráneas de MySQL ya pueden generar parte de estos índices, así que primero debe revisar antes de crear duplicados.

---

## Tarea 1.5 - Actualizar schema.sql

Si Daniela realiza cualquier cambio real en la estructura de MySQL:

```text
DEBE actualizar schema.sql
```

Si no cambia la estructura:

```text
NO necesita modificar schema.sql
```

---

## Tarea 1.6 - Actualizar DER

Solo si cambia una tabla o relación:

```text
actualizar DER
```

Si no cambia nada:

```text
DER actual se mantiene
```

---

## Daniela termina cuando:

- [ ] La estructura de horarios está correcta.
- [ ] La estructura de citas está correcta.
- [ ] Las FK están correctas.
- [ ] No existen columnas duplicadas innecesarias.
- [ ] `schema.sql` coincide con MySQL si hubo cambios.
- [ ] DER coincide con MySQL si hubo cambios.

### Daniela debe avisar al equipo:

```text
"Base de datos revisada. Vivian puede trabajar sobre horarios y citas."
```

---

# PASO 2 - VIVIAN

## Responsable de Backend / API REST

Esta es la parte más grande de la Fase 2.

Vivian trabajará principalmente en:

```text
service/
controller/
dto/
repository/
```

---

# Tarea 2.1 - Evitar cruces de horarios

Actualmente se pueden crear horarios.

Ahora debe impedirse que un médico tenga bloques que se traslapen.

Ejemplo:

```text
Horario existente:
09:00 - 10:00
```

Debe rechazarse:

```text
09:30 - 10:30
```

Pero debe permitirse:

```text
10:00 - 11:00
```

---

## Regla para detectar cruces

Existe conflicto cuando:

```text
inicioNuevo < finExistente
Y
finNuevo > inicioExistente
```

Vivian debe implementar esta lógica en el backend.

El lugar recomendado es:

```text
HorarioDisponibleService
```

No poner toda la validación directamente en el Controller.

---

## Tarea 2.2 - Validar inicio y fin

Antes de guardar un horario:

```text
fechaHoraInicio debe ser menor que fechaHoraFin
```

Debe rechazarse algo como:

```text
inicio: 15:00
fin:    14:00
```

---

## Tarea 2.3 - Crear consulta para detectar cruce

Probablemente se necesitará agregar una consulta en:

```text
HorarioDisponibleRepository
```

La consulta debe permitir saber si el médico ya tiene un horario que choque con el nuevo rango.

Vivian puede implementar la consulta mediante:

- métodos derivados de Spring Data, o
- `@Query`.

Debe elegir la opción que deje el código más claro.

---

# Tarea 2.4 - Revisar motor de disponibilidad

Ya existe:

```http
GET /api/v1/schedules/available
```

Vivian debe revisar que solo regrese horarios:

```text
del médico correcto
+
de la fecha correcta
+
disponible = true
```

y que no devuelva un bloque ya reservado.

---

# Tarea 2.5 - Mantener creación de citas

Actualmente `CitaService` ya hace varias validaciones.

Debe conservar:

```text
horario existe
horario disponible
horario no reservado
medico obtenido desde el horario
estado inicial PENDIENTE
horario pasa a false
```

NO eliminar:

```java
@Transactional
```

de la creación de citas.

---

# Tarea 2.6 - Implementar cancelación

El paciente debe poder cancelar una cita.

Crear un endpoint apropiado, por ejemplo:

```http
PUT /api/v1/appointments/{id}/cancel
```

Flujo:

```text
Cita PENDIENTE
     ↓
Cancelar
     ↓
Cita CANCELADA
     ↓
Horario disponible = true
```

La cita **no debe borrarse**.

Debe conservarse en el historial.

---

# Tarea 2.7 - Crear DTOs

Actualmente varios endpoints reciben entidades completas.

Se debe crear una estructura similar a:

```text
dto/
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

No necesariamente deben tener exactamente esos nombres, pero sí separar entrada/salida cuando sea útil.

---

## Primeros DTOs recomendados

Vivian debe empezar con los más importantes:

### Crear cita

```text
CitaRequest
```

Debe recibir algo simple como:

```json
{
  "pacienteId": 3,
  "horarioId": 1,
  "motivo": "Dolor de cabeza"
}
```

En lugar de:

```json
{
  "paciente": {
    "id": 3
  },
  "horario": {
    "id": 1
  }
}
```

---

### Diagnóstico

Crear:

```text
DiagnosticoRequest
```

Con:

```text
diagnostico
receta
```

---

### Usuario

Crear DTO de respuesta para nunca exponer:

```text
password
```

---

# Tarea 2.8 - Implementar @Valid

Los Controllers deben comenzar a utilizar:

```java
@Valid
```

Ejemplo:

```java
public ResponseEntity<?> crear(
        @Valid @RequestBody CitaRequest request)
```

---

## Validaciones recomendadas

### Usuario

```java
@NotBlank
@Email
```

para email.

```java
@NotBlank
@Size(min = 6)
```

para password.

### Cita

```java
@NotNull
```

para:

```text
pacienteId
horarioId
```

y:

```java
@NotBlank
```

para motivo si el proyecto decide hacerlo obligatorio.

### Horario

```java
@NotNull
```

para inicio, fin y médico.

---

# Vivian termina cuando:

- [ ] No se pueden crear horarios cruzados.
- [ ] No se permite fin anterior al inicio.
- [ ] Disponibilidad funciona.
- [ ] Reserva duplicada continúa bloqueada.
- [ ] Cancelación funciona.
- [ ] El horario vuelve a estar disponible al cancelar.
- [ ] Los DTOs principales están implementados.
- [ ] Los endpoints principales utilizan DTOs.
- [ ] `@Valid` funciona.
- [ ] `@Transactional` continúa protegiendo creación/cancelación.

Después debe hacer Pull Request.

---

# PASO 3 - ALEXIS

## Responsable de Seguridad / QA

Alexis trabaja después de que las reglas principales de Vivian estén listas.

Trabajará principalmente en:

```text
security/
exception/
controller/
Postman
```

---

# Tarea 3.1 - Crear manejo global de excepciones

Crear paquete:

```text
exception/
```

y como mínimo:

```text
GlobalExceptionHandler.java
```

Debe utilizar:

```java
@RestControllerAdvice
```

---

# Tarea 3.2 - Crear excepciones de negocio

Por ejemplo:

```text
ResourceNotFoundException
BusinessException
ScheduleConflictException
```

No es obligatorio usar exactamente estos nombres.

El objetivo es reemplazar:

```java
throw new RuntimeException(...)
```

por errores más claros.

---

# Tarea 3.3 - Respuestas HTTP correctas

Debe comprobar que:

```text
400 → datos inválidos
401 → sin autenticación
403 → sin permisos
404 → recurso no encontrado
409 → conflicto
```

Los errores normales del usuario no deberían producir:

```text
500 Internal Server Error
```

---

# Tarea 3.4 - Manejar errores de @Valid

Cuando falte un campo, la API debería regresar algo entendible.

Ejemplo:

```json
{
  "status": 400,
  "errors": {
    "horarioId": "El horario es obligatorio",
    "motivo": "El motivo es obligatorio"
  }
}
```

---

# Tarea 3.5 - Configurar permisos por rol

Actualmente varios endpoints únicamente requieren:

```java
authenticated()
```

Alexis debe empezar a separar permisos.

## ADMIN

Debe administrar:

```text
usuarios
medicos
especialidades
```

## DOCTOR

Debe poder:

```text
crear horarios
ver agenda
registrar diagnóstico
```

## PATIENT

Debe poder:

```text
consultar disponibilidad
crear citas
cancelar citas
ver my-history
```

---

## Puede utilizar

```java
@PreAuthorize(...)
```

o reglas dentro de:

```text
SecurityConfig
```

La decisión debe mantenerse consistente en el proyecto.

---

# Tarea 3.6 - Probar acceso incorrecto

Debe comprobar por ejemplo:

```text
PATIENT intentando crear especialidad → 403
PATIENT intentando registrar diagnóstico → 403

DOCTOR intentando crear otro usuario → 403

Sin JWT consultando citas → 401/403 según configuración
```

---

# Tarea 3.7 - Configurar CORS explícito

Actualmente CORS no debe quedar como configuración vacía indefinidamente.

Debe prepararse para los futuros clientes:

```text
Angular
Ionic
```

Durante desarrollo puede permitirse el origen local correspondiente.

Ejemplo futuro de Angular:

```text
http://localhost:4200
```

Los orígenes definitivos pueden ajustarse cuando comiencen Fase 3 y Fase 4.

---

# Tarea 3.8 - Actualizar Postman

Alexis debe ampliar la colección.

Agregar pruebas para:

```text
Horarios cruzados
Horario inválido
Cita duplicada
Cancelación
@Valid
401
403
404
409
```

NO guardar JWT reales en la colección.

---

# Alexis termina cuando:

- [ ] Existe `GlobalExceptionHandler`.
- [ ] Los errores esperados no producen 500.
- [ ] Las validaciones producen 400.
- [ ] Los conflictos producen 409.
- [ ] Los recursos inexistentes producen 404.
- [ ] Los roles están protegidos.
- [ ] Los accesos incorrectos producen 403.
- [ ] CORS está explícitamente configurado.
- [ ] Postman tiene pruebas positivas y negativas.

Después debe hacer Pull Request.

---

# PASO 4 - ANDRE

## Responsable de Liderazgo / Integración

Andre no debe rehacer el código de todos.

Su responsabilidad principal es **integrar y comprobar que todo funcione junto**.

---

# Tarea 4.1 - Revisar Pull Request de Daniela

Verificar:

```text
¿Cambió tablas?
¿Actualizó schema.sql?
¿Actualizó DER si era necesario?
¿La BD sigue funcionando?
```

Si todo está bien:

```text
Merge
```

---

# Tarea 4.2 - Revisar Pull Request de Vivian

Probar:

```text
crear horario normal
crear horario cruzado
consultar disponibilidad
crear cita
intentar reservar nuevamente
cancelar cita
volver a consultar disponibilidad
```

También revisar los DTOs.

---

# Tarea 4.3 - Revisar Pull Request de Alexis

Probar:

```text
sin JWT
JWT ADMIN
JWT DOCTOR
JWT PATIENT
```

Comprobar:

```text
400
401
403
404
409
```

---

# Tarea 4.4 - Revisar formatos JSON

Como Andre desarrollará posteriormente el frontend, debe comprobar que las respuestas sean sencillas de consumir desde Angular e Ionic.

Evitar respuestas innecesariamente gigantes o estructuras anidadas repetidas.

Ejemplo:

En lugar de responder una cita con el médico repetido varias veces dentro del horario, posteriormente puede ser mejor utilizar un `CitaResponse`.

---

# Tarea 4.5 - Actualizar documentación

Actualizar:

```text
README.md
README_FASE_2.md
Postman
DER (si cambió)
```

---

# Tarea 4.6 - Clean and Build final

Desde `main`:

```bash
mvnw.cmd clean install
```

Debe terminar en:

```text
BUILD SUCCESS
```

Después ejecutar Spring Boot.

---

# Tarea 4.7 - Prueba final completa

Ejecutar este flujo:

```text
ADMIN LOGIN
    ↓
Crear especialidad
    ↓
Crear doctor
    ↓
DOCTOR LOGIN
    ↓
Crear horario
    ↓
Intentar crear horario cruzado
    ↓
Debe fallar
    ↓
PATIENT LOGIN
    ↓
Consultar disponibilidad
    ↓
Crear cita
    ↓
Intentar reservar el mismo horario
    ↓
Debe fallar
    ↓
Consultar my-history
    ↓
Cancelar una cita de prueba
    ↓
Verificar que horario regresa
    ↓
Crear otra cita
    ↓
DOCTOR registra diagnóstico
    ↓
Cita COMPLETADA
```

Si ese flujo funciona, la lógica principal de Fase 2 está integrada.

---

# Resumen súper corto de responsabilidades

Si alguien tiene duda sobre qué le toca, usar esta tabla:

| Persona | Qué debe entregar |
|---|---|
| **Daniela** | Revisar MySQL, relaciones, estructura de horarios/citas, `schema.sql` y DER si hay cambios. |
| **Vivian** | Cruces de horarios, disponibilidad, cancelación, DTOs, mapeos, `@Valid` y lógica de negocio. |
| **Alexis** | `@ControllerAdvice`, excepciones, códigos HTTP, RBAC, CORS y pruebas Postman. |
| **Andre** | Revisar Pull Requests, integrar ramas, probar flujo completo, revisar JSON y mantener documentación. |

---

# Orden de entrega entre integrantes

```text
DANIELA
Base de datos lista
      ↓
VIVIAN
Backend y DTOs listos
      ↓
ALEXIS
Seguridad, errores y QA listos
      ↓
ANDRE
Integración y pruebas finales
      ↓
MAIN
FASE 2 COMPLETADA
```

---

# Qué NO debe hacer cada integrante

## Daniela

No modificar Controllers o Security salvo que sea estrictamente necesario y esté coordinado.

## Vivian

No cambiar tablas de MySQL sin hablar primero con Daniela.

No desactivar Security para dejarlo así.

## Alexis

No cambiar la lógica central de reserva sin coordinar con Vivian.

No borrar endpoints para solucionar errores de permisos.

## Andre

No hacer merge sin probar la rama.

No corregir directamente en `main` un problema grande; devolver el Pull Request para que se corrija en la rama correspondiente.

---

# Fase 2 se considera terminada cuando

```text
DANIELA ✓
BD revisada

VIVIAN ✓
Lógica + DTOs + @Valid

ALEXIS ✓
Exceptions + RBAC + QA + CORS

ANDRE ✓
Integración + prueba final

        ↓

FASE 2 COMPLETADA
```
