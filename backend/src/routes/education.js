const express = require('express');
const EducationController = require('../controllers/educationController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Listar contenido educativo
router.get('/list', EducationController.getContent);

// Obtener contenido específico por ID
router.get('/content/:id', EducationController.getContentById);

// Obtener categorías disponibles
router.get('/categories', EducationController.getCategories);

module.exports = router;