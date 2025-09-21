const errorHandler = (error, req, res, next) => {
  console.error('Error capturado:', error);

  // Error de validación de Sequelize
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: error.errors.map(err => ({
        field: err.path,
        message: err.message
      }))
    });
  }

  // Error de constraint único de Sequelize
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Este recurso ya existe',
      details: 'El email ya está registrado'
    });
  }

  // Error de conexión a la base de datos
  if (error.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Error de conexión a la base de datos'
    });
  }

  // Error JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  // Error por defecto
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl
  });
};

module.exports = { errorHandler, notFound };