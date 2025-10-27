/**
 * Middleware de autorización basado en roles
 */

const requireAdmin = (req, res, next) => {
  try {
    // Verificar si el usuario está autenticado (debe pasar por auth.js primero)
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado. Se requiere inicio de sesión.' 
      });
    }

    // Verificar si el usuario tiene rol de administrador
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({ 
        error: 'Acceso denegado. Se requieren privilegios de administrador.',
        mensaje: 'Esta sección es solo para administradores.'
      });
    }

    // Usuario es administrador, continuar
    next();
  } catch (error) {
    console.error('Error en middleware de autorización:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

// Middleware para verificar si es usuario normal (opcional)
const requireUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado' 
      });
    }

    // Cualquier usuario autenticado puede pasar
    next();
  } catch (error) {
    console.error('Error en middleware de autorización:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  requireAdmin,
  requireUser
};
