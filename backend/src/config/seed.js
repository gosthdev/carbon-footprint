const { EducationalContent } = require('../models');

const educationalContentSeed = [
  {
    titulo: "¿Qué es la Huella de Carbono?",
    texto: "La huella de carbono es la cantidad total de gases de efecto invernadero que son emitidos directa o indirectamente por una persona, organización, evento o producto. Se mide en toneladas de dióxido de carbono equivalente (CO2e). Incluye emisiones de CO2, metano, óxido nitroso y otros gases que contribuyen al calentamiento global. Comprender tu huella de carbono es el primer paso para reducir tu impacto ambiental.",
    categoria: "conceptos_basicos"
  },
  {
    titulo: "Transporte Sostenible: Reduciendo Emisiones",
    texto: "El transporte representa aproximadamente el 24% de las emisiones globales de CO2. Para reducir tu huella: usa transporte público, camina o usa bicicleta para distancias cortas, considera vehículos eléctricos o híbridos, planifica viajes eficientes y evita vuelos innecesarios. Cada km en auto genera aproximadamente 120g de CO2, mientras que el transporte público puede reducir esto hasta en un 80%.",
    categoria: "transporte"
  },
  {
    titulo: "Eficiencia Energética en el Hogar",
    texto: "El consumo de energía doméstica contribuye significativamente a la huella de carbono. Medidas efectivas incluyen: usar electrodomésticos eficientes (clase A+++), cambiar a iluminación LED, mejorar el aislamiento térmico, usar termostatos programables, y aprovechar energías renovables como paneles solares. Un hogar promedio puede reducir su consumo energético hasta en un 30% con estas medidas.",
    categoria: "energia"
  },
  {
    titulo: "Alimentación y Huella de Carbono",
    texto: "La producción de alimentos genera el 26% de las emisiones globales. Para reducir tu impacto: consume más alimentos de origen vegetal, reduce el desperdicio alimentario, compra productos locales y de temporada, y modera el consumo de carne (especialmente carne roja). Una dieta principalmente vegetariana puede reducir tu huella alimentaria hasta en un 70%.",
    categoria: "alimentacion"
  },
  {
    titulo: "Gestión de Residuos y Economía Circular",
    texto: "La gestión incorrecta de residuos contribuye al cambio climático. Estrategias efectivas: reduce el consumo innecesario, reutiliza productos cuando sea posible, recicla correctamente, compostea residuos orgánicos, y evita productos de un solo uso. La regla de las 3R (Reducir, Reutilizar, Reciclar) puede disminuir tu huella de residuos en más del 50%.",
    categoria: "residuos"
  },
  {
    titulo: "Compensación de Carbono: ¿Cómo Funciona?",
    texto: "La compensación de carbono permite neutralizar emisiones inevitables financiando proyectos que reducen o capturan CO2. Incluye reforestación, energías renovables, y tecnologías de captura de carbono. Sin embargo, la compensación no debe ser la primera opción: primero reduce tus emisiones, luego compensa lo restante. Busca proyectos certificados y transparentes para asegurar su efectividad real.",
    categoria: "compensacion"
  }
];

async function seed() {
  try {
    console.log('🌱 Iniciando seed de contenido educativo...');

    // Verificar si ya existe contenido
    const existingContent = await EducationalContent.count();
    
    if (existingContent > 0) {
      console.log('ℹ️ Ya existe contenido educativo en la base de datos.');
      console.log(`📊 Total de contenidos existentes: ${existingContent}`);
      process.exit(0);
    }

    // Insertar contenido educativo
    await EducationalContent.bulkCreate(educationalContentSeed);
    
    console.log('Contenido educativo insertado exitosamente!');
    console.log(`Total de contenidos creados: ${educationalContentSeed.length}`);
    
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