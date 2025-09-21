const express = require('express');
const CarbonController = require('../controllers/carbonController');
const { validateCarbonCalculation } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Calcular huella de carbono
router.post('/calculate', validateCarbonCalculation, CarbonController.calculate);

// Obtener historial de cálculos
router.get('/history', CarbonController.getHistory);

// Obtener progreso (comparación con cálculo anterior)
router.get('/progress', CarbonController.getProgress);

// Obtener estadísticas del usuario
router.get('/stats', CarbonController.getStats);

module.exports = router;