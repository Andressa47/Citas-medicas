# Medular

## Sistema de Citas Médicas y Portal de Salud

**Medular** es un sistema distribuido para la gestión de servicios médicos ambulatorios. Permite administrar usuarios, médicos, especialidades, disponibilidad y citas médicas mediante un panel web, mientras que los pacientes utilizan una aplicación móvil para consultar disponibilidad, reservar citas y acceder a sus servicios médicos.

El proyecto integra:

- Panel web administrativo y médico desarrollado con **Angular**.
- Aplicación móvil para pacientes desarrollada con **Ionic Framework**.
- API REST centralizada desarrollada con **Spring Boot**.
- Base de datos relacional **MySQL**.
- Autenticación y autorización mediante **JWT**.
- Documentación interactiva de la API mediante **Swagger / OpenAPI**.

---

# Arquitectura del sistema

```text
                         +----------------------+
                         |     Panel Web        |
                         |       Angular        |
                         | Admin / Médico       |
                         +----------+-----------+
                                    |
                                    | REST / JWT
                                    v
+----------------------+   +----------------------+   +----------------------+
| Aplicación móvil     |   |   Servidor REST      |   |   Base de datos      |
| Ionic                |-->|   Spring Boot        |-->|   MySQL              |
| Paciente             |   |   Java 21            |   |                      |
+----------------------+   +----------------------+   +----------------------+
```

Angular e Ionic no se comunican directamente entre sí. Ambos consumen la misma API REST desarrollada con Spring Boot, que contiene la lógica de negocio y centraliza el acceso a MySQL.

---

# Tecnologías utilizadas

## Backend

- Java 21
- Spring Boot 3.3.x
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Maven
- Lombok
- Springdoc OpenAPI
- Swagger UI

## Aplicación web

- Angular
- TypeScript
- RxJS
- Angular Router
- HttpClient
- Guards
- Interceptors

## Aplicación móvil

- Ionic Framework
- Angular
- Capacitor
- TypeScript

## Base de datos

- MySQL
- MySQL Workbench

## Herramientas

- Git
- GitHub
- Postman
- Swagger
- Apache NetBeans
- Visual Studio Code

---

# Roles del sistema

El sistema utiliza control de acceso basado en roles.

## ROLE_ADMIN

El administrador puede:

- Gestionar usuarios.
- Crear usuarios con contraseña temporal.
- Gestionar médicos.
- Gestionar especialidades.
- Consultar y filtrar usuarios.
- Configurar la disponibilidad semanal de los médicos.
- Definir la duración de las consultas.
- Generar automáticamente espacios disponibles.
- Consultar todas las citas.
- Filtrar citas.
- Asignar citas a pacientes.
- Cambiar su contraseña.

## ROLE_DOCTOR

El médico puede:

- Consultar su agenda.
- Visualizar citas del día.
- Consultar próximas citas.
- Atender pacientes.
- Registrar diagnósticos.
- Registrar recetas o indicaciones.
- Comunicarse con pacientes mediante chat.
- Consultar y actualizar su perfil profesional.
- Cambiar su contraseña.

## ROLE_PATIENT

El paciente utiliza principalmente la aplicación móvil y puede:

- Iniciar sesión.
- Consultar especialidades.
- Consultar médicos.
- Consultar horarios disponibles.
- Reservar citas.
- Cancelar citas.
- Consultar su historial médico.
- Consultar diagnósticos y recetas.
- Comunicarse con médicos mediante chat.

---

# Funcionalidades principales

## Autenticación y seguridad

Medular utiliza autenticación sin estado mediante JSON Web Tokens.

Después del inicio de sesión, las solicitudes protegidas utilizan:

```text
Authorization: Bearer <token>
```

El sistema implementa:

- Spring Security.
- JWT.
- BCrypt para almacenamiento seguro de contraseñas.
- Guards de Angular.
- Interceptor HTTP para adjuntar automáticamente el JWT.
- Protección de rutas según rol.
- Protección de endpoints en el backend.
- Configuración CORS.
- Validación de contraseñas seguras.
- Cambio obligatorio de contraseña temporal.
- Cambio voluntario de contraseña.

Las contraseñas seguras deben contener como mínimo:

- 8 caracteres.
- Una letra mayúscula.
- Una letra minúscula.
- Un número.
- Un carácter especial.

---

# Gestión de usuarios

El administrador puede crear y consultar usuarios del sistema.

La gestión incluye:

- Búsqueda por nombre.
- Búsqueda por correo electrónico.
- Búsqueda por ID.
- Filtro por rol.
- Contraseña temporal para nuevos usuarios.
- Cambio obligatorio de contraseña en el primer ingreso cuando corresponda.

---

# Gestión de médicos

El administrador puede registrar médicos y asociarlos con una especialidad.

El sistema permite almacenar información profesional adicional del médico, como:

- Biografía.
- Teléfono profesional.
- Años de experiencia.
- Formación académica.
- Idiomas.
- Ubicación del consultorio.

---

# Gestión automática de disponibilidad médica

Medular evita que el administrador tenga que crear manualmente cada horario de atención.

Para cada médico se puede configurar:

- Duración estándar de cada consulta.
- Día de la semana.
- Hora de inicio.
- Hora de finalización.
- Múltiples bloques de atención para un mismo día.

Ejemplo:

```text
Dra. Laura Méndez
Duración: 30 minutos

Lunes
08:00 - 12:00
13:00 - 17:00

Martes
08:00 - 12:00
```

El sistema genera automáticamente espacios como:

```text
08:00 - 08:30
08:30 - 09:00
09:00 - 09:30
09:30 - 10:00
```

Cuando un espacio es reservado deja de aparecer como disponible.

Cuando una cita es cancelada, el horario vuelve a quedar disponible.

El backend también evita reservar horarios cuya fecha ya pasó.

---

# Gestión de citas

Las citas manejan los estados:

```text
PENDIENTE
COMPLETADA
CANCELADA
```

Cada cita contiene información relacionada con:

- Paciente.
- Médico.
- Especialidad.
- Fecha.
- Hora.
- Motivo de consulta.
- Estado.
- Diagnóstico.
- Receta o indicaciones.

El administrador puede asignar una cita directamente a un paciente utilizando la misma disponibilidad que utiliza la aplicación móvil.

---

# Agenda médica

El médico dispone de un panel desde el cual puede consultar:

- Citas del día.
- Próximas citas.
- Datos del paciente.
- Fecha y horario.
- Motivo de consulta.

Al atender una cita, el médico puede registrar:

- Diagnóstico.
- Receta.
- Indicaciones médicas.

Una vez finalizada la consulta, la cita puede cambiar al estado `COMPLETADA`.

---

# Chat médico-paciente

El sistema incorpora comunicación entre médicos y pacientes.

La comunicación utiliza la API REST:

```text
Paciente en Ionic
        ↓
   Spring Boot
        ↑
Médico en Angular
```

Los mensajes son almacenados en MySQL y ambas interfaces consultan la misma conversación.

---

# Estructura principal del repositorio

```text
Citas-medicas/
│
├── src/
│   └── main/
│       ├── java/com/umg/citasmedicas/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── enums/
│       │   ├── exception/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       │
│       └── resources/
│           ├── application.properties
│           ├── schema.sql
│           └── scripts de migración
│
├── fase3-frontend/
│   └── Aplicación web Angular
│
├── fase3-ionic/
│   └── Aplicación móvil Ionic
│
├── Sistema_Citas_Medicas.postman_collection.json
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

# Requisitos para ejecutar el proyecto

Se recomienda contar con:

- Java JDK 21.
- MySQL Server.
- MySQL Workbench.
- Node.js.
- npm.
- Git.
- Apache NetBeans, IntelliJ IDEA o un IDE compatible con Spring Boot.
- Visual Studio Code.

Puede comprobarse el entorno con:

```bash
java -version
node -v
npm -v
git --version
```

---

# Base de datos

La base de datos utilizada es:

```text
citas_medicas
```

Entre las entidades principales se encuentran:

- usuarios
- especialidades
- medicos
- perfiles_medicos
- configuraciones_horario_medico
- horarios_semanales
- horarios_disponibles
- citas
- conversaciones
- mensajes_chat

Las relaciones utilizan claves primarias y foráneas para mantener la integridad referencial.

---

# Configuración de MySQL

Antes de iniciar Spring Boot debe encontrarse activo MySQL Server.

El proyecto contiene:

```text
src/main/resources/schema.sql
```

y scripts adicionales de migración correspondientes a funcionalidades incorporadas durante el desarrollo.

Estos scripts deben ejecutarse en MySQL Workbench cuando correspondan.

---

# Configuración privada

Las credenciales privadas no deben almacenarse directamente en el repositorio.

Durante el desarrollo puede utilizarse:

```text
src/main/resources/application-local.properties
```

para datos locales como:

- usuario de MySQL;
- contraseña de MySQL;
- secreto JWT;
- configuraciones específicas del equipo.

El proyecto puede cargar esta configuración mediante:

```properties
spring.config.import=optional:classpath:application-local.properties
```

No deben subirse a GitHub:

- contraseñas;
- tokens JWT;
- secretos;
- credenciales de base de datos;
- archivos locales con información sensible.

---

# Ejecutar el backend

Desde la raíz del repositorio:

## Windows

```powershell
.\mvnw.cmd spring-boot:run
```

También puede ejecutarse mediante **Run Project** desde Apache NetBeans.

El backend utiliza:

```text
http://localhost:8080
```

---

# Ejecutar Angular

Entrar al directorio:

```powershell
cd fase3-frontend
```

Instalar dependencias:

```powershell
npm install
```

Ejecutar:

```powershell
npm start
```

La aplicación web estará disponible en:

```text
http://localhost:4200
```

El panel web está dirigido a:

- administradores;
- médicos.

---

# Ejecutar Ionic

Desde la raíz del proyecto:

```powershell
cd fase3-ionic
```

Instalar dependencias:

```powershell
npm install
```

Ejecutar en el puerto utilizado durante el desarrollo:

```powershell
npm start -- --port 8100
```

La aplicación estará disponible en:

```text
http://localhost:8100
```

La aplicación móvil corresponde al perfil de paciente.

---

# Puertos utilizados

| Servicio | Puerto |
|---|---:|
| Spring Boot | 8080 |
| Angular | 4200 |
| Ionic | 8100 |
| MySQL | 3306 |

---

# Swagger y documentación de la API

Medular incorpora documentación automática mediante OpenAPI y Swagger UI.

Con Spring Boot iniciado, Swagger está disponible en:

```text
http://localhost:8080/swagger-ui/index.html
```

La definición OpenAPI está disponible en:

```text
http://localhost:8080/v3/api-docs
```

Swagger permite:

- consultar endpoints;
- revisar DTOs;
- visualizar parámetros;
- ejecutar solicitudes;
- probar respuestas;
- utilizar autenticación JWT.

## Probar endpoints protegidos

1. Ejecutar:

```text
POST /api/v1/auth/login
```

2. Copiar el token JWT recibido.
3. Presionar **Authorize**.
4. Introducir el token.
5. Ejecutar el endpoint protegido deseado.

---

# Endpoints principales

## Autenticación

```text
POST /api/v1/auth/login
PUT  /api/v1/auth/change-required-password
PUT  /api/v1/auth/change-password
```

## Médicos

```text
GET /api/v1/doctors
```

El listado puede filtrarse por especialidad.

## Disponibilidad

```text
GET /api/v1/schedules/available
```

## Citas

```text
POST /api/v1/appointments
GET  /api/v1/appointments/my-history
PUT  /api/v1/appointments/{id}/cancel
PUT  /api/v1/appointments/{id}/diagnosis
```

La documentación completa y actualizada de los endpoints se encuentra disponible en Swagger.

---

# Flujo principal del sistema

El flujo principal utilizado para la demostración e integración es:

```text
1. El administrador inicia sesión.
        ↓
2. Registra o selecciona un médico.
        ↓
3. Configura su horario semanal.
        ↓
4. Define la duración de la consulta.
        ↓
5. El sistema genera automáticamente disponibilidad.
        ↓
6. El paciente inicia sesión desde Ionic.
        ↓
7. Selecciona una especialidad.
        ↓
8. Selecciona un médico.
        ↓
9. Consulta horarios disponibles.
        ↓
10. Reserva una cita.
        ↓
11. El horario deja de mostrarse como disponible.
        ↓
12. La cita aparece en la agenda del médico.
        ↓
13. El médico atiende al paciente.
        ↓
14. Registra diagnóstico y receta.
        ↓
15. La cita cambia a COMPLETADA.
        ↓
16. El paciente consulta posteriormente el resultado.
```

---

# Reglas de negocio verificadas

- Un horario pasado no puede reservarse.
- Un horario reservado deja de aparecer como disponible.
- Una cita cancelada libera nuevamente su horario.
- Los horarios automáticos se generan según la configuración semanal.
- La modificación del horario semanal no debe eliminar citas ya existentes.
- Los usuarios solo pueden acceder a los recursos permitidos para su rol.
- Las contraseñas se almacenan mediante BCrypt.
- Una contraseña temporal puede requerir cambio obligatorio.
- El usuario autenticado puede cambiar voluntariamente su contraseña.
- El médico solo visualiza las citas correspondientes a su perfil.

---

# Pruebas

Durante el desarrollo se realizaron pruebas relacionadas con:

- Inicio de sesión.
- JWT.
- Roles.
- Gestión de usuarios.
- Gestión de médicos.
- Gestión de especialidades.
- Configuración semanal.
- Generación automática de horarios.
- Reserva desde Ionic.
- Asignación administrativa de citas.
- Cancelación de citas.
- Liberación del horario cancelado.
- Agenda médica.
- Registro de diagnóstico.
- Registro de receta.
- Historial médico.
- Perfil médico.
- Chat médico-paciente.
- Cambio obligatorio de contraseña.
- Cambio voluntario de contraseña.
- API mediante Postman.
- API mediante Swagger.
- Integración Angular-Ionic-Spring Boot-MySQL.

El detalle de los casos de prueba se presenta en el **Reporte de Pruebas** del proyecto.

---

# Colección Postman

El repositorio incluye:

```text
Sistema_Citas_Medicas.postman_collection.json
```

Puede importarse en Postman para probar los servicios REST.

Flujo recomendado:

1. Importar la colección.
2. Ejecutar Login.
3. Obtener JWT.
4. Configurar el token.
5. Ejecutar las solicitudes correspondientes al rol utilizado.

---

# Trabajo con Git

La rama:

```text
main
```

debe utilizarse como versión estable del proyecto.

Durante el desarrollo se utilizan ramas separadas para evitar conflictos entre módulos.

Antes de integrar cambios se recomienda:

```bash
git status
git pull
```

Después de probar una funcionalidad:

```bash
git add <archivos>
git commit -m "Descripción del cambio"
git push
```

No se recomienda trabajar directamente sobre `main`.

---

# Checklist antes de integrar cambios

Antes de realizar un merge o Pull Request comprobar:

- El backend compila correctamente.
- Spring Boot inicia.
- MySQL conecta.
- Angular compila.
- Ionic compila.
- Login funciona.
- Los endpoints modificados funcionan.
- No se incluyeron contraseñas reales.
- No se incluyeron JWT reales.
- No se incluyó `target/`.
- Las funcionalidades existentes continúan funcionando.
- La documentación fue actualizada cuando corresponde.

---

# Organización del equipo

El proyecto se desarrolla de forma colaborativa.

Las responsabilidades principales se dividen entre:

- Desarrollo e integración de interfaces.
- Base de datos.
- Backend y API REST.
- Seguridad, pruebas e integración.

Aunque cada integrante posee responsabilidades principales, la integración final requiere coordinación entre todos los módulos.

---

# Estado actual

Medular cuenta actualmente con integración funcional entre:

```text
Angular
   ↓
Spring Boot
   ↓
MySQL
   ↑
Ionic
```

Los servicios utilizados durante el desarrollo se ejecutan localmente en:

```text
Angular       http://localhost:4200
Ionic         http://localhost:8100
Spring Boot   http://localhost:8080
Swagger       http://localhost:8080/swagger-ui/index.html
MySQL         localhost:3306
```

El sistema permite ejecutar el flujo completo de creación de disponibilidad, reserva de cita, consulta de agenda, atención médica y registro de resultados.

---

## Proyecto académico

Este repositorio corresponde a un proyecto académico de Ingeniería en Sistemas.

Las credenciales y configuraciones utilizadas para desarrollo local no deben considerarse configuraciones de producción.