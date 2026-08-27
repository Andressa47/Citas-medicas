# Sistema de Citas Médicas y Portal de Salud

Sistema distribuido para la gestión de servicios médicos ambulatorios.

La arquitectura general del proyecto contempla:

- Panel web administrativo desarrollado con Angular.
- Aplicación móvil para pacientes desarrollada con Ionic Framework.
- Backend REST desarrollado con Spring Boot.
- Base de datos relacional MySQL.

> **Estado actual del proyecto: Fase 1 completada.**  
> En esta fase se desarrolló el backend, la base de datos, la seguridad mediante JWT y las pruebas de los servicios REST.

---

## Equipo de desarrollo

- Andre
- Vivian
- Alexis
- Daniela

---

# Fase 1 - Backend y Base de Datos

Durante la primera fase se implementó la estructura principal del backend del Sistema de Citas Médicas.

Se desarrollaron las entidades del sistema, persistencia de datos, servicios REST, autenticación mediante JWT y pruebas de los endpoints utilizando Postman.

## Funcionalidades implementadas

- Autenticación de usuarios.
- Autorización mediante JWT.
- Gestión de usuarios.
- Gestión de especialidades médicas.
- Gestión de médicos.
- Asociación de médicos con especialidades.
- Filtrado de médicos por especialidad.
- Creación y consulta de horarios disponibles.
- Creación y consulta de citas médicas.
- Consulta del historial de citas del paciente autenticado.
- Registro de diagnóstico.
- Registro de receta.
- Cambio de estado de una cita a completada.
- Control automático de disponibilidad de horarios después de reservar una cita.

---

# Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Java 21 | Lenguaje de programación |
| Spring Boot 3.3.5 | Framework principal del backend |
| Spring Web | Desarrollo de servicios REST |
| Spring Data JPA | Persistencia y acceso a datos |
| Spring Security | Seguridad y autorización |
| JWT | Autenticación basada en tokens |
| Hibernate | ORM |
| MySQL | Base de datos |
| Maven | Gestión de dependencias |
| Postman | Pruebas de servicios REST |
| Lombok | Reducción de código repetitivo |

---

# Arquitectura del sistema

```text
                                  +-------------------+
                                  |  Panel Web        |
                                  |  Angular          |
                                  +---------+---------+
                                            |
                                            | REST / HTTPS
                                            v
+-------------------+             +-------------------+             +-------------------+
|  App Móvil        | ----------->|  Servidor REST    | ----------->|  Base de Datos    |
|  Ionic            | REST / HTTPS|  Spring Boot      |    JDBC     |  MySQL            |
+-------------------+             +-------------------+             +-------------------+
```

Durante la **Fase 1**, el desarrollo se concentra principalmente en:

```text
Spring Boot + MySQL + API REST + Spring Security + JWT
```

Angular e Ionic serán integrados en las siguientes fases.

---

# Estructura del backend

El código principal se encuentra en:

```text
src/main/java/com/umg/citasmedicas/
```

La estructura utilizada es:

```text
citasmedicas/
│
├── controller/
├── dto/
├── entity/
├── enums/
├── repository/
├── security/
├── service/
│
└── CitasmedicasApplication.java
```

## Controller

Contiene los controladores REST encargados de recibir las solicitudes HTTP.

Ejemplos:

```java
@GetMapping
@PostMapping
@PutMapping
@DeleteMapping
```

## Service

Contiene la lógica de negocio.

Aquí se realizan operaciones como:

- Validar disponibilidad.
- Verificar registros.
- Cambiar estados.
- Crear citas.
- Registrar diagnósticos.
- Coordinar operaciones entre diferentes repositorios.

## Repository

Contiene las interfaces de Spring Data JPA utilizadas para consultar y modificar la base de datos.

## Entity

Contiene las entidades JPA que representan las tablas de MySQL.

## Security

Contiene la configuración relacionada con:

- Spring Security.
- JWT.
- Filtros de autenticación.
- PasswordEncoder.
- AuthenticationManager.

## DTO

Contiene objetos utilizados para transferir información entre el cliente y el servidor sin necesidad de exponer siempre una entidad completa.

## Enums

Contiene enumeraciones utilizadas por el sistema, incluyendo roles y estados de las citas.

---

# Flujo recomendado del backend

Al desarrollar nuevas funcionalidades se debe respetar, cuando corresponda, la siguiente estructura:

```text
REQUEST
   ↓
CONTROLLER
   ↓
SERVICE
   ↓
REPOSITORY
   ↓
ENTITY
   ↓
MYSQL
```

No se recomienda colocar toda la lógica de negocio directamente dentro de los Controllers.

---

# Base de Datos

La base de datos utilizada es:

```text
citas_medicas
```

Las tablas principales implementadas durante la Fase 1 son:

```text
usuarios
especialidades
medicos
horarios_disponibles
citas
```

## Relaciones principales

```text
usuarios.id
    ↓
medicos.usuario_id

especialidades.id
    ↓
medicos.especialidad_id

medicos.id
    ↓
horarios_disponibles.medico_id

usuarios.id
    ↓
citas.paciente_id

medicos.id
    ↓
citas.medico_id

horarios_disponibles.id
    ↓
citas.horario_id
```

---

# Diagrama Entidad-Relación

El proyecto incluye un Diagrama Entidad-Relación basado en la estructura real de MySQL.

El DER representa las relaciones entre:

- Usuarios.
- Especialidades.
- Médicos.
- Horarios disponibles.
- Citas.

Se recomienda guardar la documentación del proyecto dentro de:

```text
docs/
```

Por ejemplo:

```text
docs/DER_Sistema_Citas_Medicas.png
```

---

# Configuración del proyecto

La configuración principal se encuentra en:

```text
src/main/resources/application.properties
```

La configuración utilizada durante el desarrollo es similar a:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/citas_medicas?useSSL=false&serverTimezone=UTC
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

jwt.secret=${JWT_SECRET:CLAVE_DE_DESARROLLO}
jwt.expiration=86400000
```

Para otros entornos se recomienda utilizar variables de entorno:

```text
DB_USER
DB_PASSWORD
JWT_SECRET
```

## Importante

No subir al repositorio:

- Contraseñas personales.
- Tokens JWT generados.
- Claves privadas.
- Credenciales reales.
- Archivos con información sensible.

---

# Requisitos para ejecutar el proyecto

Cada integrante debe contar con:

- Java 21.
- MySQL.
- Git.
- Postman.
- Un IDE compatible con Maven y Spring Boot.

Ejemplos:

- NetBeans.
- IntelliJ IDEA.
- Visual Studio Code con las extensiones correspondientes.

---

# Configuración de MySQL

Antes de ejecutar Spring Boot debe estar iniciado el servidor MySQL.

Debe existir la base de datos:

```text
citas_medicas
```

Configuración local utilizada durante el desarrollo:

```text
Host: localhost
Port: 3306
Database: citas_medicas
Usuario: root
```

Cada integrante puede configurar su contraseña local mediante `DB_PASSWORD`.

---

# Ejecutar Spring Boot

Desde la raíz del proyecto, en Windows:

```bash
mvnw.cmd spring-boot:run
```

También puede ejecutarse directamente desde el IDE.

Cuando Spring Boot inicia correctamente deben aparecer mensajes similares a:

```text
Tomcat started on port 8080
Started CitasmedicasApplication
```

La API estará disponible en:

```text
http://localhost:8080
```

---

# Seguridad y JWT

El backend utiliza:

- Spring Security.
- JWT.
- BCrypt.
- Autenticación Stateless.

El endpoint de autenticación es público:

```http
POST /api/v1/auth/login
```

Los demás recursos principales requieren autenticación.

## Roles

Actualmente se contemplan roles como:

```text
ROLE_ADMIN
ROLE_DOCTOR
ROLE_PATIENT
```

---

# Endpoints principales

## Autenticación

### Login

```http
POST /api/v1/auth/login
```

Permite iniciar sesión y obtener un JWT.

---

## Usuarios

### Crear usuario

```http
POST /api/v1/users
```

### Listar usuarios

```http
GET /api/v1/users
```

---

## Especialidades

### Crear especialidad

```http
POST /api/v1/specialties
```

### Listar especialidades

```http
GET /api/v1/specialties
```

---

## Médicos

### Crear médico

```http
POST /api/v1/doctors
```

### Listar médicos

```http
GET /api/v1/doctors
```

### Buscar médico por ID

```http
GET /api/v1/doctors/{id}
```

### Filtrar médicos por especialidad

```http
GET /api/v1/doctors?especialidadId={id}
```

Ejemplo:

```http
GET /api/v1/doctors?especialidadId=27
```

### Actualizar médico

```http
PUT /api/v1/doctors/{id}
```

### Eliminar médico

```http
DELETE /api/v1/doctors/{id}
```

---

# Horarios

Los horarios permiten registrar la disponibilidad de los médicos.

### Crear horario

```http
POST /api/v1/schedules
```

La colección Postman contiene también la consulta de horarios disponibles utilizando los parámetros implementados en el backend.

---

# Citas

### Crear cita

```http
POST /api/v1/appointments
```

### Listar citas

```http
GET /api/v1/appointments
```

### Buscar cita por ID

```http
GET /api/v1/appointments/{id}
```

### Historial por paciente

```http
GET /api/v1/appointments/patient/{pacienteId}
```

### Citas por médico

```http
GET /api/v1/appointments/doctor/{medicoId}
```

### Historial del paciente autenticado

```http
GET /api/v1/appointments/my-history
```

Este endpoint obtiene el paciente directamente a partir del usuario autenticado mediante JWT.

### Registrar diagnóstico y receta

```http
PUT /api/v1/appointments/{id}/diagnosis
```

---

# Flujo principal probado durante la Fase 1

Durante las pruebas se verificó el siguiente flujo:

```text
1. Iniciar sesión
        ↓
2. Obtener JWT
        ↓
3. Crear usuario
        ↓
4. Crear especialidad
        ↓
5. Crear médico
        ↓
6. Asociar médico con especialidad
        ↓
7. Crear horario disponible
        ↓
8. Crear cita
        ↓
9. El horario cambia a no disponible
        ↓
10. Consultar historial del paciente
        ↓
11. Registrar diagnóstico y receta
        ↓
12. La cita cambia a COMPLETADA
```

---

# Lógica importante de las citas

Esta sección es especialmente importante para futuros cambios en `CitaService`.

Cuando se crea una cita:

1. Se verifica que se haya seleccionado un horario.
2. Se verifica que el horario exista.
3. Se verifica que el horario esté disponible.
4. Se verifica que el horario no haya sido reservado anteriormente.
5. El médico se obtiene a partir del horario seleccionado.
6. La cita se crea inicialmente con estado `PENDIENTE`.
7. El horario cambia automáticamente a:

```text
disponible = false
```

El flujo es:

```text
Horario disponible
        ↓
Crear cita
        ↓
Horario reservado
        ↓
disponible = false
```

**No eliminar estas validaciones al modificar la lógica de citas.**

---

# Diagnóstico y receta

Cuando se registra un diagnóstico:

- Se almacena el diagnóstico.
- Se almacena la receta.
- La cita cambia al estado:

```text
COMPLETADA
```

Los estados deben manejarse utilizando el enum `EstadoCita`.

No se recomienda guardar estados mediante Strings arbitrarios.

---

# Pruebas con Postman

Los servicios REST desarrollados durante la Fase 1 fueron probados utilizando Postman.

La colección se encuentra en:

```text
Sistema_Citas_Medicas.postman_collection.json
```

## Importar la colección

1. Abrir Postman.
2. Seleccionar **Import**.
3. Seleccionar el archivo:
   ```text
   Sistema_Citas_Medicas.postman_collection.json
   ```
4. Ejecutar Login.
5. Obtener el JWT.
6. Utilizar el token para acceder a los endpoints protegidos.

Para:

```http
GET /api/v1/appointments/my-history
```

se debe utilizar el JWT correspondiente a un paciente.

---

# Importante al modificar Spring Security

Los endpoints protegidos están configurados en `SecurityConfig`.

Durante el desarrollo puede ser necesario utilizar temporalmente:

```java
.permitAll()
```

para identificar problemas.

Sin embargo, **no se debe subir a `main` un endpoint como público si originalmente debe requerir autenticación**.

Después de realizar pruebas se debe restaurar:

```java
.authenticated()
```

cuando corresponda.

---

# Guía para continuar el desarrollo

Esta sección sirve como referencia para Andre, Vivian, Alexis y Daniela durante las siguientes fases.

Antes de modificar una funcionalidad existente:

1. Probar el endpoint actual en Postman.
2. Revisar su Controller.
3. Revisar su Service.
4. Revisar su Repository.
5. Revisar la Entity relacionada.
6. Revisar las relaciones correspondientes en MySQL.
7. Realizar el cambio.
8. Ejecutar nuevamente Spring Boot.
9. Volver a probar los endpoints relacionados.

Esto ayuda a identificar rápidamente si un error fue introducido por una modificación reciente.

---

# Agregar una funcionalidad nueva

Se recomienda seguir este orden:

```text
1. Definir qué necesita la funcionalidad
        ↓
2. Revisar/crear Entity
        ↓
3. Revisar/crear Repository
        ↓
4. Implementar Service
        ↓
5. Crear endpoint en Controller
        ↓
6. Revisar SecurityConfig
        ↓
7. Probar en Postman
        ↓
8. Actualizar colección Postman
        ↓
9. Documentar cambios
```

---

# Trabajo con Git y ramas

La rama:

```text
main
```

debe conservar una versión estable del proyecto.

Cada integrante debe trabajar en su propia rama.

Estructura sugerida:

```text
main
│
├── andre
├── vivian
├── alexis
└── daniela
```

## Cambiar a una rama

```bash
git switch nombre-rama
```

## Antes de comenzar a trabajar

Actualizar los cambios correspondientes antes de comenzar nuevas modificaciones.

```bash
git pull
```

## Guardar cambios

```bash
git add .
git commit -m "Descripción clara del cambio"
git push
```

Después se debe crear un **Pull Request** hacia `main`.

Los cambios deben revisarse antes de realizar el merge.

---

# Reglas recomendadas para el equipo

1. No desarrollar directamente en `main`.
2. Mantener la rama de trabajo actualizada.
3. Realizar commits claros y descriptivos.
4. No subir contraseñas ni JWT.
5. Comunicar al equipo cambios realizados en MySQL.
6. Probar Spring Boot antes de abrir un Pull Request.
7. Probar en Postman cualquier endpoint modificado.
8. Agregar a Postman los endpoints nuevos.
9. Actualizar este README cuando cambie una configuración importante.
10. Revisar los Pull Requests antes de integrarlos a `main`.

---

# Checklist antes de hacer Pull Request

Antes de enviar cambios:

- [ ] El proyecto compila correctamente.
- [ ] Spring Boot inicia.
- [ ] MySQL conecta correctamente.
- [ ] Login continúa funcionando.
- [ ] Los endpoints existentes relacionados siguen funcionando.
- [ ] Los endpoints nuevos fueron probados en Postman.
- [ ] No se agregaron contraseñas.
- [ ] No se agregaron JWT reales.
- [ ] No se incluyó `target/`.
- [ ] Todos los archivos fueron guardados.
- [ ] El commit describe claramente los cambios.
- [ ] Se actualizó la documentación cuando fue necesario.

---

# Entregables de la Fase 1

Estado de los requerimientos correspondientes a esta fase:

- [x] Diagrama Entidad-Relación del sistema.
- [x] Backend desarrollado con Spring Boot.
- [x] Base de datos MySQL.
- [x] Entidades JPA.
- [x] Repositorios.
- [x] Servicios REST.
- [x] Controllers REST.
- [x] Spring Security.
- [x] Autenticación mediante JWT.
- [x] Gestión de usuarios.
- [x] Gestión de especialidades.
- [x] Gestión de médicos.
- [x] Gestión de horarios.
- [x] Gestión de citas.
- [x] Historial del paciente.
- [x] Registro de diagnóstico y receta.
- [x] Pruebas mediante Postman.
- [x] Colección Postman en formato JSON.

---

# Próximas fases

El backend desarrollado durante la Fase 1 servirá como API central para las interfaces del sistema.

## Panel web

```text
Angular
   ↓
REST API
   ↓
Spring Boot
   ↓
MySQL
```

## Aplicación móvil

```text
Ionic
   ↓
REST API
   ↓
Spring Boot
   ↓
MySQL
```

Antes de modificar URLs, formatos JSON o estructuras de endpoints existentes, se debe considerar que posteriormente estos endpoints serán consumidos por Angular e Ionic.

---

# Organización recomendada del repositorio

```text
Proyecto_Citas_Medicas/
│
├── src/
│
├── docs/
│   └── DER_Sistema_Citas_Medicas.png
│
├── Sistema_Citas_Medicas.postman_collection.json
├── README.md
├── pom.xml
├── mvnw
├── mvnw.cmd
└── .gitignore
```

La documentación adicional del proyecto debe almacenarse preferiblemente dentro de:

```text
docs/
```

---

# Estado del proyecto

## Fase 1: COMPLETADA

La primera fase proporciona una base funcional para continuar el desarrollo del Sistema de Citas Médicas.

Actualmente se cuenta con:

```text
Base de Datos
      +
Spring Boot
      +
API REST
      +
Spring Security
      +
JWT
      +
Postman
```

Las siguientes fases continuarán a partir de esta base con la integración de las interfaces web y móvil.

---

## Nota

Este repositorio corresponde a un proyecto académico.

Las configuraciones utilizadas durante el desarrollo local no deben considerarse configuraciones destinadas a un ambiente de producción.
