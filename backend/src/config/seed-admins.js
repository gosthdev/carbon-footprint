const bcrypt = require('bcryptjs');
const { User } = require('../models');

const adminUsersSeed = [
  {
    nombre: 'Admin Principal',
    email: 'admin@carbon-footprint.com',
    password: 'Admin123!',
    rol: 'administrador'
  },
  {
    nombre: 'Admin Secundario',
    email: 'admin2@carbon-footprint.com',
    password: 'Admin456!',
    rol: 'administrador'
  }
];

async function seedAdmins() {
  try {
    console.log('👤 Iniciando seed de usuarios administradores...');

    for (const adminData of adminUsersSeed) {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ 
        where: { email: adminData.email } 
      });

      if (existingUser) {
        console.log(`⚠️  Admin ya existe: ${adminData.email}`);
        continue;
      }

      // Hashear contraseña
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(adminData.password, saltRounds);

      // Crear usuario administrador
      await User.create({
        nombre: adminData.nombre,
        email: adminData.email,
        password_hash,
        rol: adminData.rol
      });

      console.log(` Admin creado: ${adminData.nombre} (${adminData.email})`);
    }

    console.log('\n Credenciales de administradores:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    adminUsersSeed.forEach(admin => {
      console.log(` Email: ${admin.email}`);
      console.log(` Password: ${admin.password}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
    console.log('\n  IMPORTANTE: Guarda estas credenciales en un lugar seguro!');
    console.log(' Cambia las contraseñas después del primer login.\n');

    process.exit(0);
  } catch (error) {
    console.error(' Error durante el seed de administradores:', error);
    process.exit(1);
  }
}

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seedAdmins();
}

module.exports = seedAdmins;
