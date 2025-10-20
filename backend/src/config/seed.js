const { EducationalContent } = require('../models');

const educationalContentSeed = [
  {
    titulo: "Huella de Carbono - Infografía",
    texto: "",
    categoria: "conceptos_basicos",
    imagen_url: "/educative/Huella_de_carbono_infografias.jpg"
  },
  {
    titulo: "De donde viene la Huella de Carbono",
    texto: "",
    categoria: "conceptos_basicos",
    imagen_url: "/educative/2.jpg"
  },
  {
    titulo: "Cambios para reducir la Huella de Carbono",
    texto: "",
    categoria: "conceptos_basicos",
    imagen_url: "/educative/3.jpg"
  }
];

async function seed() {
  try {
    console.log('🌱 Iniciando seed de contenido educativo...');

    // IMPORTANTE: En desarrollo, limpiar tabla antes de insertar nuevos datos
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log('🗑️  Limpiando contenido anterior (desarrollo)...');
      await EducationalContent.destroy({ where: {} });
    }

    // Insertar contenido educativo
    await EducationalContent.bulkCreate(educationalContentSeed);
    
    console.log('✅ Contenido educativo insertado exitosamente!');
    console.log(`📊 Total de contenidos creados: ${educationalContentSeed.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error durante el seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seed();
}

module.exports = seed;