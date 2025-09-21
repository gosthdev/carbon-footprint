const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const EducationalContent = require('./EducationalContent');

const ContentView = sequelize.define('ContentView', {
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
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EducationalContent,
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'content_views',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'content_id']
    }
  ]
});

// Relaciones
User.hasMany(ContentView, { foreignKey: 'user_id' });
ContentView.belongsTo(User, { foreignKey: 'user_id' });

EducationalContent.hasMany(ContentView, { foreignKey: 'content_id' });
ContentView.belongsTo(EducationalContent, { foreignKey: 'content_id' });

module.exports = ContentView;