🌱 CarbonTrack - Plataforma de Cálculo de Huella de Carbono

Una plataforma web completa para calcular, monitorear y reducir la huella de carbono personal, con contenido educativo, sistema de roles y métricas de uso.
🎯 Características Principales

    Registro y Autenticación: Sistema completo con JWT y roles de usuario
    Sistema de Roles: Administradores y usuarios regulares con permisos diferenciados
    Cálculo de Huella de Carbono: Algoritmo que considera transporte, energía, agua, residuos y alimentación
    Historial y Progreso: Visualización de la evolución temporal con gráficos
    Contenido Educativo: Infografías sobre sostenibilidad y reducción de huella
    Panel de Métricas: Analytics de uso de la plataforma (solo administradores)
    Responsive Design: Interfaz optimizada para móviles y desktop
    Autorización Granular: Control de acceso basado en roles

🛠️ Tecnologías
Backend

    Node.js con Express
    PostgreSQL con Sequelize ORM
    JWT para autenticación
    bcryptjs para hashing de contraseñas
    Docker para contenerización

Frontend

    React 18 con Vite
    TailwindCSS para estilos
    Recharts para gráficos
    Lucide React para iconos
    Axios para peticiones HTTP

🚀 Instalación y Configuración
Prerequisitos

    Node.js 18+
    Docker y Docker Compose
    PostgreSQL (si no usas Docker)

1. Clonar el repositorio
bash

git clone <url-del-repo>
cd carbon-footprint-platform

2. Configurar variables de entorno
Backend
bash

cd backend
cp .env.example .env
# Editar .env con tus configuraciones

Frontend
bash

cd frontend
# Crear archivo .env
echo "VITE_API_URL=http://localhost:3000/api" > .env

3. Opción A: Desarrollo con Docker (Recomendado)
bash

# Desde la raíz del proyecto
docker-compose up -d

Esto iniciará:

    PostgreSQL en puerto 5432
    Backend en puerto 3000
    Frontend en puerto 5173

4. Opción B: Desarrollo Local
Backend
bash

cd backend
npm install
npm run migrate  # Crear tablas
npm run seed     # Insertar contenido educativo inicial
npm run dev      # Modo desarrollo

Frontend
bash

cd frontend
npm install
npm run dev

5. Configurar Base de Datos

Una vez que el backend esté corriendo:
bash

# Ejecutar migraciones (crea tablas)
npm run migrate

# O migración forzada (recrea todas las tablas - ⚠️ elimina datos)
npm run migrate:force

# Insertar datos iniciales
npm run seed              # Contenido educativo (infografías)
npm run seed:admins       # Crear administradores por defecto

� Credenciales por Defecto

### Administradores
```
Email: admin@carbon-footprint.com
Password: Admin123!@#
Rol: administrador
```

```
Email: admin2@carbon-footprint.com
Password: Admin456!@#
Rol: administrador
```



⚠️ **IMPORTANTE:** Cambia estas contraseñas después del primer login en producción.

�📡 API Endpoints
Autenticación

    POST /api/auth/register - Registro de usuario
    POST /api/auth/login - Inicio de sesión
    GET /api/auth/profile - Obtener perfil del usuario

Cálculo de Carbono

    POST /api/carbon/calculate - Calcular huella de carbono
    GET /api/carbon/history - Historial de cálculos
    GET /api/carbon/progress - Progreso del usuario
    GET /api/carbon/stats - Estadísticas del usuario

Contenido Educativo

    GET /api/education/list - Listar contenido educativo
    GET /api/education/content/:id - Obtener contenido específico
    GET /api/education/categories - Obtener categorías

Métricas (🔒 Solo Administradores)

    GET /api/metrics/active-users - Usuarios activos
    GET /api/metrics/content-users - Métricas de contenido
    GET /api/metrics/dashboard - Métricas generales

🔐 Sistema de Roles

### Usuario Regular (`rol: 'usuario'`)
- ✅ Calcular y ver su propia huella de carbono
- ✅ Ver su historial y progreso
- ✅ Acceder a contenido educativo
- ❌ **NO** puede ver métricas globales
- ❌ **NO** puede acceder a `/metrics`

### Administrador (`rol: 'administrador'`)
- ✅ Todas las funciones de usuario regular
- ✅ Ver métricas globales en el dashboard
- ✅ Acceder a la página completa de Métricas
- ✅ Ver estadísticas de todos los usuarios

**Documentación completa:** Ver [`ROLES_IMPLEMENTATION.md`](./ROLES_IMPLEMENTATION.md)

🧮 Fórmula de Cálculo

La huella de carbono se calcula usando factores de emisión estándar:
javascript

// Factores de emisión (kg CO2e)
- Transporte terrestre: 0.12 kg CO2e/km
- Transporte aéreo: 0.255 kg CO2e/km  
- Energía eléctrica: 0.5 kg CO2e/kWh
- Agua: 0.34 kg CO2e/m³
- Residuos: 0.5 kg CO2e/kg
- Alimentación: 500 kg CO2e por punto en escala 1-10

📊 Estructura de Base de Datos
Tablas principales:

    users: Información de usuarios con campo `rol`
    carbon_calculations: Historial de cálculos
    educational_content: Contenido educativo (infografías)
    content_views: Registro de visualizaciones

🎨 Características del Frontend
Páginas Implementadas:

    Landing Page: Página de inicio con información del producto
    Login/Register: Autenticación con validaciones
    Dashboard: Resumen personalizado del usuario
    Calculate: Formulario de cálculo de huella de carbono
    History: Historial con gráficos de evolución
    Education: Contenido educativo categorizado
    Metrics: Panel de métricas para administradores

Características UX:

    Diseño responsive con TailwindCSS
    Validaciones en tiempo real
    Feedback visual de estados (loading, error, success)
    Navegación intuitiva con iconos
    Gráficos interactivos con Recharts

🔒 Seguridad

    Autenticación JWT con expiración
    Hashing de contraseñas con bcrypt (12 rounds)
    Validación de datos en frontend y backend
    Middlewares de seguridad (helmet, cors)
    Protección de rutas sensibles

📈 Métricas Implementadas
Métricas de Usuario:

    Usuarios activos semanales/mensuales
    Nuevos registros por período
    Retención de usuarios

Métricas de Contenido:

    Usuarios que consultan contenido educativo
    Contenido más popular
    Tasas de engagement

Métricas Generales:

    Total de cálculos realizados
    Huella promedio de la plataforma
    Actividad semanal

🚦 Estados de Desarrollo
✅ Completado

    Arquitectura backend completa
    Sistema de autenticación
    Cálculo de huella de carbono
    Historial y progreso
    Contenido educativo
    Sistema de métricas
    Frontend básico funcional
    Integración frontend-backend
    Dockerización

🔄 En Desarrollo

    Tests unitarios
    Validaciones adicionales
    Optimizaciones de rendimiento

📋 Futuras Mejoras

    Sistema de notificaciones
    Comparación con promedios globales
    Gamificación y logros
    Exportación de reportes
    API de terceros para datos reales

🧪 Testing
bash

# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

📦 Despliegue
Desarrollo
bash

docker-compose up -d

Producción
bash

docker-compose -f docker-compose.prod.yml up -d

🤝 Contribución

    Fork el proyecto
    Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
    Commit tus cambios (git commit -m 'Add some AmazingFeature')
    Push a la rama (git push origin feature/AmazingFeature)
    Abre un Pull Request


