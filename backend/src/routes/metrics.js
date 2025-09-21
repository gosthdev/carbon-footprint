const express = require('express');
const MetricsController = require('../controllers/metricsController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación (para admin básico)
router.use(authenticateToken);

// Métricas de usuarios activos
router.get('/active-users', MetricsController.getActiveUsers);

// Métricas de contenido educativo
router.get('/content-users', MetricsController.getContentMetrics);

// Métricas generales del dashboard
router.get('/dashboard', MetricsController.getDashboardMetrics);

module.exports = router;