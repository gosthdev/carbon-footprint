const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
  static async register(req, res) {
    try {
      const { nombre, email, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          error: 'El email ya está registrado' 
        });
      }

      // Hashear contraseña
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const user = await User.create({
        nombre,
        email,
        password_hash
      });

      // Generar token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          rol: user.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          fecha_registro: user.fecha_registro
        },
        token
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Generar token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          rol: user.rol 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login exitoso',
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        },
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'nombre', 'email', 'fecha_registro']
      });

      res.json({ user });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}

module.exports = AuthController;