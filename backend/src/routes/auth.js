const express = require('express');
const AuthController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', validateRegister, AuthController.register);

// Login de usuario
router.post('/login', validateLogin, AuthController.login);

// Obtener perfil (requiere autenticación)
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;