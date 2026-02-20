**Prueba Técnica Angular - Garantías Comunitarias**  

A continuación, se describen las tareas que debes realizar en el framework Angular para completar esta prueba técnica:  

---

### **Tareas a realizar**  

1. **Configuración inicial:**  
   - Instala Angular localmente en tu entorno de desarrollo.  
   - Configura las variables de entorno para definir la URL del API Restful que se utilizará en los servicios.  

2. **Solución de errores:**  
   - Identifica y corrige posibles errores que impidan la correcta ejecución del Frontend.  

3. **Funcionalidad del CRUD de entidades:**  
   - **Botón eliminar:** Implementa la funcionalidad en el toolbar para permitir el borrado múltiple de entidades seleccionadas.  
   - **Formulario reactivo:**  
     - Crea un formulario reactivo que permita **crear y editar entidades**.  
     - Muestra el formulario en un modal al hacer clic en el botón correspondiente.  
   - **Métodos del CRUD:** Completa los métodos necesarios para que el CRUD esté completamente funcional, conectando con el API de Laravel proporcionado.  

4. **CRUD de contactos:**  
   - Implementa un CRUD similar al de entidades, con tabla, formularios reactivos y servicios.  
   - Asegúrate de que los contactos estén relacionados con una entidad:  
     - En el formulario reactivo de contactos, agrega un campo de selección (combo o autocomplete) para elegir entre las entidades listadas por el servicio de entidades.  

5. **Validaciones:**  
   - Implementa validaciones con mensajes claros para los formularios reactivos de entidades y contactos.  
   - Incluye advertencias específicas que ayuden al usuario a corregir errores al completar los formularios.  

---

### **Instrucciones de entrega**  

1. **Rama para cambios:**  
   - Clonar el repositorio en tu máquina local
   - Crea una rama en el repositorio siguiendo el formato: [Tus iniciales]_[Número de identificación].
   - Realiza todos los cambios necesarios en esta rama.

2. **Sube los cambios a tu repositorio:**  
   - Una vez completadas las tareas, sube tus cambios a un repositorio publico en tu cuenta de github. 
   - Envianos un correo con la ruta del repositorio.  

3. **Entrega alternativa:**  
   - Si encuentras dificultades para publicar en tu repositorio, sigue estos pasos: 
     - Comprime la carpeta del proyecto Angular.  
     - Excluye carpetas innecesarias como `node_modules`.  
     - Sube el archivo comprimido a una plataforma de almacenamiento en la nube (OneDrive, Google Drive, etc.).  
     - Comparte el enlace de descarga en un correo dirigido a la persona que te envió esta prueba.  

4. **Formato de entrega por correo:**  
   - Incluye en el correo una descripción breve del trabajo realizado y cualquier detalle relevante sobre la prueba.  

---

Si tienes alguna pregunta o necesitas asistencia técnica durante la ejecución de esta prueba, no dudes en comunicarte con el contacto que te proporcionó esta tarea. ¡Buena suerte!



# Sistema de Gestión de Entidades y Contactos

Sistema CRUD completo desarrollado con Angular 17 + PrimeNG, conectado a una API Laravel.

## Características Implementadas

### CRUD de Entidades
- Listado de entidades con tabla interactiva (ordenamiento, filtrado, paginación)
- Crear nueva entidad con formulario reactivo en modal
- Editar entidad existente
- Eliminar entidad individual
- Eliminación múltiple de entidades seleccionadas
- Búsqueda global en tiempo real
- Validaciones completas con mensajes de error claros

### CRUD de Contactos
- Listado de contactos con información de la entidad asociada
- Crear nuevo contacto con selección de entidad
- Editar contacto existente
-  Eliminar contacto individual
- Eliminación múltiple de contactos seleccionados
- Búsqueda global en tiempo real
- Selector de fecha de nacimiento
- Dropdown con filtro para seleccionar entidad
- Validaciones completas con mensajes de error


## Validaciones Implementadas

### Entidades
- **Nombre**: Requerido, mínimo 3 caracteres, máximo 100
- **NIT**: Requerido, mínimo 5 caracteres, máximo 20
- **Dirección**: Requerido, mínimo 5 caracteres, máximo 200
- **Teléfono**: Requerido, solo números, 7-15 dígitos
- **Email**: Requerido, formato de email válido, máximo 100 caracteres

### Contactos
- **Nombre**: Requerido, mínimo 3 caracteres, máximo 100
- **Identificación**: Requerido, mínimo 5 caracteres, máximo 50
- **Email**: Requerido, formato de email válido, máximo 100 caracteres
- **Teléfono**: Requerido, solo números, 7-15 dígitos
- **Dirección**: Requerido, mínimo 5 caracteres, máximo 200
- **Notas**: Opcional, máximo 500 caracteres
- **Fecha de Nacimiento**: Requerido, formato fecha
- **Entidad**: Requerido, debe existir en el sistema

## Conexión con API Laravel

El sistema está configurado para conectarse a la API Laravel mediante variables de entorno definidas en `src/environments/`.

**Configuración por defecto**: `http://localhost:8000/api/`

Para cambiar la URL del API, modifica los archivos en `src/environments/` según el entorno que necesites.

### Endpoints utilizados:

#### Entidades
- `GET /entidades` - Listar todas las entidades
- `GET /entidades/{id}` - Obtener una entidad
- `POST /entidades` - Crear nueva entidad
- `PUT /entidades/{id}` - Actualizar entidad
- `DELETE /entidades/{id}` - Eliminar entidad

#### Contactos
- `GET /contactos` - Listar todos los contactos
- `GET /contactos/{id}` - Obtener un contacto
- `POST /contactos` - Crear nuevo contacto
- `PUT /contactos/{id}` - Actualizar contacto
- `DELETE /contactos/{id}` - Eliminar contacto

## Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- Angular CLI (v17)
- API Laravel ejecutándose en http://127.0.0.1:8000

### Pasos de instalación

1. **Clonar el repositorio**
```bash
cd prueba_candidato_angular
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
El proyecto utiliza archivos de configuración de entorno para gestionar la URL del API.

Carpeta: `src/environments/`

**environment.ts** (Producción):
```typescript
export const environment = {
  production: true,
  apiURL: 'http://localhost:8000/api/',
};
```

**environment.development.ts** (Desarrollo):
```typescript
export const environment = {
  production: false,
  apiURL: 'http://localhost:8000/api/',
};
```

> **Nota**: Ajusta la `apiURL` según tu configuración. Los servicios importan automáticamente el environment correcto según el modo de compilación.

4. **Iniciar el servidor de desarrollo**
```bash
npm start
```
O
```bash
ng serve
```

5. **Abrir en el navegador**
```
http://localhost:4200
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── entidades/
│   │   ├── interfaces/
│   │   │   ├── entidad.ts           # Interfaces de Entidad y ApiResponse
│   │   │   └── state-entidad.ts     # Interface de estado
│   │   ├── services/
│   │   │   └── entidades.service.ts # Servicio con métodos CRUD
│   │   ├── entidades.component.ts   # Componente principal
│   │   ├── entidades.component.html # Template con tabla y modal
│   │   └── entidades.component.css
│   │
│   ├── contactos/
│   │   ├── interfaces/
│   │   │   ├── contacto.ts          # Interfaces de Contacto y ApiResponse
│   │   │   └── state-contacto.ts    # Interface de estado
│   │   ├── services/
│   │   │   └── contactos.service.ts # Servicio con métodos CRUD
│   │   ├── contactos.component.ts   # Componente principal
│   │   ├── contactos.component.html # Template con tabla y modal
│   │   └── contactos.component.css
│   │
│   ├── utils/
│   │   └── alert.service.ts         # Servicio de alertas con SweetAlert2
│   │
│   ├── app.component.ts             # Componente raíz con navegación
│   ├── app.component.html           # Template del layout principal
│   ├── app.config.ts                # Configuración de la aplicación
│   └── app.routes.ts                # Definición de rutas
│
└── environments/
    ├── environment.ts               # Variables de entorno - Producción
    └── environment.development.ts   # Variables de entorno - Desarrollo
```

## Manejo de Errores

### Errores de Validación del API
El sistema muestra automáticamente los errores de validación del backend:
```typescript
{
    "status": "error",
    "message": "La validación ha fallado.",
    "errors": {
        "nombre": ["El nombre ya existe"],
        "email": ["El email ya existe"]
    }
}
