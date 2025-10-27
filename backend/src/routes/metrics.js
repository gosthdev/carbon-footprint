const express = require('express');
const MetricsController = require('../controllers/metricsController');
const { authenticateToken } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/authorization');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Métricas del dashboard - disponible para TODOS los usuarios autenticados
router.get('/dashboard', MetricsController.getDashboardMetrics);

// Las siguientes rutas requieren rol de administrador
router.use(requireAdmin);

// Métricas de usuarios activos (solo admin)
router.get('/active-users', MetricsController.getActiveUsers);

// Métricas de contenido educativo (solo admin)
router.get('/content-users', MetricsController.getContentMetrics);

module.exports = router;