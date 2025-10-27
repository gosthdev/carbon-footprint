const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const carbonRoutes = require('./routes/carbon');
const educationRoutes = require('./routes/education');
const metricsRoutes = require('./routes/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
// Permitir múltiples orígenes: desarrollo local y producción
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL // URL de Netlify desde variable de entorno
].filter(Boolean); // Remover valores undefined

app.use(cors({
  origin: (origin, callback) => {
    // Si no hay origin (herramientas como curl, Postman), permitir
    if (!origin) return callback(null, true);

    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Permitir orígenes de Docker (desarrollo)
    if (origin.startsWith('http://172.')) return callback(null, true);

    // Rechazar otros orígenes
    return callback(new Error('Origin not allowed by CORS'), false);
  },
  credentials: true
}));

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para permitir CORS en archivos estáticos educativos
app.use('/educative', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Servir archivos estáticos educativos (imágenes)
app.use('/educative', express.static(path.join(__dirname, 'educative')));

// Logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/metrics', metricsRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Huella de Carbono',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      carbon: '/api/carbon',
      education: '/api/education',
      metrics: '/api/metrics',
      health: '/api/health'
    }
  });
});

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV}`);
      console.log(`PI disponible en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

startServer();

module.exports = app;