const sequelize = require('./database');
const { User, CarbonCalculation, EducationalContent, ContentView } = require('../models');

async function migrate() {
  try {
    console.log('Iniciando migración de base de datos...');
    
    // Autenticar conexión
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ force: false });
    console.log('Tablas sincronizadas correctamente.');

    console.log('Migración completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  migrate();
}

module.exports = migrate;