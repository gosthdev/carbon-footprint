const sequelize = require('./database');
require('../models'); // Cargar todos los modelos

async function migrateForce() {
  try {
    console.log('🔄 Iniciando migración forzada (DROP + CREATE)...');
    
    // Forzar sincronización (elimina y recrea todas las tablas)
    await sequelize.sync({ force: true });
    
    console.log('✅ Tablas recreadas exitosamente con los nuevos campos');
    console.log('⚠️  ADVERTENCIA: Todos los datos anteriores han sido eliminados');
    console.log('\n📝 Recuerda ejecutar los seeds para poblar las tablas:');
    console.log('   npm run seed        - Para contenido educativo');
    console.log('   npm run seed:admins - Para cuentas de administrador');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migrateForce();
