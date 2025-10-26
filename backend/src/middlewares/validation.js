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
  // Nueva validación para el objeto de transporte_terrestre_data
  body('transporte_terrestre_data')
    .isObject()
    .withMessage('El transporte terrestre debe ser un objeto'),
  
  // Tipos Públicos (deben ser numéricos y opcionales)
  body('transporte_terrestre_data.tipos_publicos.custer')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cúster debe ser un número positivo'),
  body('transporte_terrestre_data.tipos_publicos.combi')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Combi debe ser un número positivo'),
  body('transporte_terrestre_data.tipos_publicos.bus')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Bus debe ser un número positivo'),
  body('transporte_terrestre_data.tipos_publicos.taxi')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Taxi debe ser un número positivo'),

  // Transporte Personal (tipo y km)
  body('transporte_terrestre_data.personal.tipo')
    .isIn(['moto_mototaxi', 'auto_db5', 'auto_gasohol', 'auto_glp', 'auto_gnv', 'ninguno'])
    .withMessage('Tipo de vehículo personal inválido'),
  
  body('transporte_terrestre_data.personal.km')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Kilometraje personal debe ser un número positivo'),

  // Consumos directos (mantienen la estructura)
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
  
  // Eliminados: transporte_terrestre (antiguo), transporte_aereo, alimentacion
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCarbonCalculation,
  handleValidationErrors
};