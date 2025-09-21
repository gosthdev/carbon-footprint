const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida'),
  
  handleValidationErrors
];

const validateCarbonCalculation = [
  body('transporte_terrestre')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Transporte terrestre debe ser un número positivo'),
  
  body('transporte_aereo')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Transporte aéreo debe ser un número positivo'),
  
  body('consumo_energia')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Consumo de energía debe ser un número positivo'),
  
  body('consumo_agua')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Consumo de agua debe ser un número positivo'),
  
  body('residuos')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Residuos debe ser un número positivo'),
  
  body('alimentacion')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Alimentación debe ser un número positivo'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCarbonCalculation,
  handleValidationErrors
};