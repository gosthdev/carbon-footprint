const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CarbonCalculation = sequelize.define('CarbonCalculation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  transporte_terrestre: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  transporte_aereo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  consumo_energia: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  consumo_agua: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  residuos: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  alimentacion: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  resultado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'carbon_calculations',
  timestamps: false
});

// Relaciones
User.hasMany(CarbonCalculation, { foreignKey: 'user_id' });
CarbonCalculation.belongsTo(User, { foreignKey: 'user_id' });

module.exports = CarbonCalculation;