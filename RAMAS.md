# Antes de empezar: ¿Qué significa trabajar con ramas?

Antes de utilizar los comandos de esta guía es importante entender qué significa trabajar con ramas en Git y GitHub.

## ¿Qué es una rama?

Una **rama (branch)** es una copia o línea de trabajo independiente del proyecto.

En nuestro repositorio existe una rama principal llamada:

```text
main
```

`main` contiene la versión estable y funcional del proyecto.

A partir de `main` se crearon ramas individuales para cada integrante:

```text
main
│
├── andre
├── daniela
├── vivian
└── alexis
```

Esto permite que cada integrante pueda modificar el proyecto sin cambiar directamente la versión principal.

---

# ¿Para qué usamos ramas?

Supongamos que todos modificamos directamente `main`.

Mientras Vivian está cambiando `CitaService`, Alexis podría estar modificando `SecurityConfig`, Daniela podría actualizar la base de datos y Andre podría estar integrando otros cambios.

Si alguno sube código con un error, podría afectar inmediatamente el proyecto de todos.

Las ramas evitan este problema.

Cada integrante tiene su propio espacio de trabajo:

```text
                 main
            Proyecto estable
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
    vivian     daniela     alexis
    Backend       BD       Seguridad
```

Cada persona puede trabajar, guardar cambios y subirlos a GitHub sin modificar `main`.

---

# ¿Una rama contiene todo el proyecto?

Sí.

Por ejemplo, la rama:

```text
vivian
```

no contiene únicamente los archivos de Backend.

Contiene **todo el proyecto**, igual que `main`.

La diferencia es que Vivian puede modificar los archivos que necesita sin que esos cambios aparezcan inmediatamente en `main`.

Por ejemplo:

```text
main
│
├── Usuario.java
├── Cita.java
├── CitaService.java
├── SecurityConfig.java
└── schema.sql


vivian
│
├── Usuario.java
├── Cita.java
├── CitaService.java   ← Vivian modifica esto
├── SecurityConfig.java
└── schema.sql
```

Mientras Vivian trabaja, `main` sigue teniendo la versión anterior y estable de `CitaService.java`.

---

# Entonces, ¿qué significa "trabajar en mi rama"?

Significa que antes de comenzar a modificar el proyecto debes asegurarte de estar ubicado en tu rama.

Por ejemplo, Vivian debe ejecutar:

```bash
git switch vivian
```

Daniela:

```bash
git switch daniela
```

Alexis:

```bash
git switch alexis
```

Andre:

```bash
git switch andre
```

Para comprobar dónde estás:

```bash
git branch
```

Git mostrará algo como:

```text
  main
* vivian
  daniela
  alexis
```

El símbolo:

```text
*
```

indica la rama actual.

En este ejemplo:

```text
* vivian
```

significa que cualquier commit que se realice pertenece a la rama de Vivian y no directamente a `main`.

---

# Ejemplo sencillo

Supongamos que Vivian debe implementar los DTOs.

Primero cambia a:

```bash
git switch vivian
```

Después crea:

```text
CitaRequest.java
CitaResponse.java
```

y modifica:

```text
CitaController.java
CitaService.java
```

Cuando guarda los archivos, **todavía no modificó `main`**.

Los cambios están en su computadora.

Luego ejecuta:

```bash
git add .
git commit -m "Implementa DTOs para citas"
```

Ahora Git guardó una versión de esos cambios dentro de la rama `vivian`.

Después:

```bash
git push origin vivian
```

Ahora los cambios también están guardados en GitHub, pero continúan estando únicamente en:

```text
vivian
```

La rama:

```text
main
```

todavía no fue modificada.

---

# ¿Cómo llegan los cambios a main?

Mediante un:

```text
Pull Request
```

Un Pull Request significa básicamente:

> "Terminé estos cambios en mi rama y quiero que sean revisados antes de agregarlos al proyecto principal."

Por ejemplo:

```text
vivian
   │
   │ Pull Request
   ↓
 main
```

En GitHub se configura:

```text
base: main
compare: vivian
```

GitHub mostrará exactamente:

- qué archivos agregó Vivian;
- qué archivos eliminó;
- qué líneas modificó;
- qué código cambió.

El equipo puede revisar todo antes de aceptar los cambios.

---

# ¿Qué significa hacer Merge?

Si el Pull Request está correcto, se realiza:

```text
Merge
```

Merge significa **integrar los cambios de una rama dentro de otra**.

Por ejemplo:

Antes:

```text
main
│
└── versión estable


vivian
│
└── versión estable + DTOs
```

Después del Merge:

```text
main
│
└── versión estable + DTOs
```

Ahora el trabajo de Vivian oficialmente forma parte del proyecto principal.

---

# ¿Qué pasa con las demás ramas?

Supongamos que los DTOs de Vivian ya fueron integrados:

```text
vivian
      ↓
    MERGE
      ↓
     main
```

Ahora `main` tiene código nuevo.

Pero Daniela y Alexis podrían seguir teniendo una versión anterior.

Por eso deben actualizarse.

Ejemplo para Alexis:

```bash
git switch main
git pull
```

Esto descarga la versión nueva de `main`.

Después:

```bash
git switch alexis
git merge main
```

Ahora Alexis obtiene dentro de su rama los cambios nuevos que ya fueron aprobados.

El flujo sería:

```text
Vivian termina DTOs
        ↓
Pull Request
        ↓
Merge
        ↓
main actualizado
        ↓
Alexis actualiza main
        ↓
Alexis lleva main a su rama
        ↓
Continúa trabajando
```

---

# ¿Qué significa cada comando?

Esta es una explicación sencilla de los comandos que utilizaremos durante el proyecto.

## `git clone`

```bash
git clone URL_DEL_REPOSITORIO
```

Significa:

> "Descarga el repositorio completo de GitHub a mi computadora."

Normalmente se utiliza una sola vez cuando se comienza a trabajar con el proyecto.

---

## `git branch`

```bash
git branch
```

Significa:

> "Muéstrame las ramas y dime en cuál estoy."

Ejemplo:

```text
  main
* daniela
  vivian
  alexis
```

Daniela está trabajando actualmente en su rama.

---

## `git switch`

```bash
git switch vivian
```

Significa:

> "Quiero cambiar mi espacio de trabajo a la rama `vivian`."

Los archivos de la carpeta se ajustarán a la versión que existe en esa rama.

---

## `git fetch`

```bash
git fetch
```

Significa:

> "GitHub, dime qué cosas nuevas existen en el repositorio."

Descarga información sobre cambios y ramas remotas, pero no mezcla esos cambios automáticamente con el código que estás trabajando.

---

## `git pull`

```bash
git pull
```

Significa aproximadamente:

> "Descarga los cambios nuevos de la rama remota correspondiente y actualiza mi rama local."

Por eso utilizamos:

```bash
git switch main
git pull
```

para obtener la versión más reciente de `main`.

---

## `git merge main`

```bash
git merge main
```

Si estás ubicado en tu rama, significa:

> "Trae los cambios que existen en `main` y combínalos con mi rama."

Ejemplo:

```text
main
 ↓
vivian
```

NO significa subir el trabajo de Vivian a `main`.

Significa traer `main` hacia `vivian`.

La dirección depende de **la rama en la que estés parado**.

Por eso siempre hay que comprobar:

```bash
git branch
```

antes de hacer un merge.

---

## `git status`

```bash
git status
```

Significa:

> "Dime qué he cambiado y qué está pendiente de guardar en Git."

Es uno de los comandos más útiles y se puede ejecutar todas las veces que sea necesario.

---

## `git add .`

```bash
git add .
```

Significa:

> "Prepara los cambios actuales para incluirlos en el próximo commit."

Todavía no los sube a GitHub.

---

## `git commit`

```bash
git commit -m "Implementa DTOs para citas"
```

Significa:

> "Guarda un punto de control de estos cambios en el historial de mi rama."

El commit sigue estando inicialmente en la computadora.

---

## `git push`

```bash
git push origin vivian
```

Significa:

> "Sube los commits de mi rama `vivian` desde mi computadora hacia GitHub."

Entonces:

```text
Computadora de Vivian
        ↓
      push
        ↓
GitHub → rama vivian
```

Todavía NO modifica `main`.

---

# Diferencia entre guardar, commit y push

Estas tres cosas pueden confundirse al principio.

## Guardar en NetBeans

Cuando presionas:

```text
Ctrl + S
```

guardas el archivo en tu computadora.

```text
Código
 ↓
Archivo en computadora
```

Git todavía no registra oficialmente una nueva versión.

---

## Commit

Cuando haces:

```bash
git add .
git commit -m "Agrega validaciones"
```

Git guarda esos cambios en el historial de tu rama **local**.

```text
Archivo
 ↓
Commit
 ↓
Historial Git local
```

---

## Push

Cuando haces:

```bash
git push origin vivian
```

envías esos commits a GitHub.

```text
Computadora
 ↓
Commit
 ↓
Push
 ↓
GitHub
```

---

# ¿Qué es origin?

Cuando aparece:

```bash
git push origin vivian
```

`origin` normalmente es el nombre que Git le da al repositorio remoto que clonamos desde GitHub.

Puedes imaginarlo como:

```text
origin = nuestro repositorio en GitHub
```

Por eso:

```bash
git push origin vivian
```

puede entenderse como:

> "Sube mis cambios a la rama `vivian` de nuestro repositorio de GitHub."

---

# ¿Qué es un conflicto?

Un conflicto ocurre cuando Git no puede decidir automáticamente cómo combinar dos cambios.

Ejemplo:

Vivian modifica:

```java
cita.setEstado(EstadoCita.PENDIENTE);
```

y al mismo tiempo otra persona modifica exactamente esa línea:

```java
cita.setEstado(EstadoCita.CONFIRMADA);
```

Git no sabe cuál versión debe conservar.

Entonces indica:

```text
CONFLICT
```

Esto **no significa que el proyecto se perdió**.

Solo significa:

> "Dos versiones modificaron la misma parte. Una persona debe decidir cuál queda."

Por eso es importante:

- trabajar en ramas;
- dividir responsabilidades;
- actualizar `main` frecuentemente;
- hacer commits pequeños;
- comunicar cambios grandes.

---

# ¿Por qué no trabajamos directamente en main?

Porque queremos que `main` represente:

```text
VERSIÓN ESTABLE DEL PROYECTO
```

El flujo correcto es:

```text
             main
        versión estable
              │
              ↓
       rama individual
              │
           trabajar
              │
           probar
              │
           commit
              │
            push
              │
       Pull Request
              │
           revisar
              │
           Merge
              ↓
             main
       nueva versión estable
```

Si algo sale mal en una rama, `main` continúa funcionando.

---

# Regla fácil para recordar

## Antes de trabajar

```text
ACTUALIZAR
```

```bash
git fetch
git switch main
git pull
git switch mi-rama
git merge main
```

Esto significa:

> "Primero obtengo la versión más reciente del proyecto y después comienzo mi trabajo."

---

## Mientras trabajo

```text
PROGRAMAR Y PROBAR
```

Guardar normalmente los archivos y comprobar:

```bash
git status
```

---

## Cuando termino

```text
GUARDAR EN GIT Y SUBIR
```

```bash
git add .
git commit -m "Descripción del cambio"
git push origin mi-rama
```

Esto significa:

> "Guardo oficialmente mi trabajo y lo subo a mi rama en GitHub."

---

## Finalmente

```text
PEDIR INTEGRACIÓN
```

Crear:

```text
Pull Request

mi-rama → main
```

Después de revisar:

```text
Merge
```

---

# En una sola frase

Trabajar con ramas significa:

> **Cada integrante trabaja y prueba sus cambios en una versión separada del proyecto; cuando termina, sube esos cambios a su rama y crea un Pull Request para que sean revisados antes de incorporarlos a `main`.**

---

# Mapa mental rápido

```text
¿Quiero empezar a trabajar?
        ↓
Actualizo main
        ↓
Voy a MI rama
        ↓
Trabajo
        ↓
Pruebo
        ↓
Hago commit
        ↓
Hago push
        ↓
Creo Pull Request
        ↓
Se revisa
        ↓
Se hace Merge
        ↓
main queda actualizado
        ↓
Todos vuelven a actualizarse
```

---

# IMPORTANTE

La regla principal del equipo será:

```text
NO PROGRAMAR DIRECTAMENTE EN MAIN
```

`main` es nuestra versión estable.

Las ramas son nuestros espacios de trabajo.
