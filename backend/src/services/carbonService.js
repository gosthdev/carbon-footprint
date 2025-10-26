// Factores de emisión en kg CO2e
const EMISSION_FACTORS = {
  // Transporte Público (kg CO2e por km*persona, ANUALIZADO implícito en el factor km/mes -> km/año)
  transporte_publico: {
    custer: 0.10017,
    combi: 0.10017,
    bus: 0.11907,
    taxi: 0.15211
  },
  // Transporte Personal (kg CO2e por km, ANUALIZADO implícito en el factor km/mes -> km/año)
  transporte_personal: {
    moto_mototaxi: 0.08248,
    auto_db5: 0.19311,
    auto_gasohol: 0.17167,
    auto_glp: 0.1816,
    auto_gnv: 0.16107,
    ninguno: 0 // Para cuando elige 'ninguno' en el auto propio/moto
  },
  
  // Consumo energía (kWh/mes) - Factor ANUALIZADO: 2.079027 kg CO2e por kWh/mes
  consumo_energia: 2.079027, 
  
  // Consumo agua (m3/mes) - Factor ANUALIZADO: 4.128 kg CO2e por m3/mes
  consumo_agua: 4.128, 
  
  // Residuos (kg/semana) - Factor ANUALIZADO: 32.76 kg CO2e por kg/semana
  residuos: 32.76, 
};

// CONSTANTE PARA CONVERTIR ENTRADAS MENSUALES/SEMANALES A ANUALES
// Las entradas de Energía y Agua son mensuales, las de Residuos son semanales.
const MONTHS_PER_YEAR = 12;
const WEEKS_PER_YEAR = 52;

class CarbonService {
  static calculateCarbonFootprint(data) {
    const {
      transporte_terrestre_data, // Nuevo campo de transporte
      consumo_energia = 0,
      consumo_agua = 0,
      residuos = 0
      // Eliminados: transporte_aereo, alimentacion
    } = data;

    // --- 1. CÁLCULO DE TRANSPORTE TERRESTRE ---
    let transporteTerrestreAnual = 0;
    const desgloseTransporte = {
        publico: 0,
        personal: 0
    };

    // A. Transporte Público (Mensual a Anual: * 12)
    const tiposPublicos = transporte_terrestre_data?.tipos_publicos || {};
    for (const [key, kmMensual] of Object.entries(tiposPublicos)) {
        const factor = EMISSION_FACTORS.transporte_publico[key] || 0;
        const kmAnual = (parseFloat(kmMensual) || 0) * MONTHS_PER_YEAR;
        const emision = kmAnual * factor;
        transporteTerrestreAnual += emision;
        desgloseTransporte.publico += emision;
    }

    // B. Transporte Personal (Mensual a Anual: * 12)
    const personal = transporte_terrestre_data?.personal || { tipo: 'ninguno', km: 0 };
    const factorPersonal = EMISSION_FACTORS.transporte_personal[personal.tipo] || 0;
    const kmMensualPersonal = parseFloat(personal.km) || 0;
    const kmAnualPersonal = kmMensualPersonal * MONTHS_PER_YEAR;
    const emisionPersonal = kmAnualPersonal * factorPersonal;
    transporteTerrestreAnual += emisionPersonal;
    desgloseTransporte.personal += emisionPersonal;

    // --- 2. CÁLCULOS DIRECTOS (YA ANUALIZADOS EN LOS FACTORES) ---
    // Multiplicamos el input MENSUAL/SEMANAL por el factor ANUALIZADO
    const energiaAnual = consumo_energia * EMISSION_FACTORS.consumo_energia;
    const aguaAnual = consumo_agua * EMISSION_FACTORS.consumo_agua;
    const residuosAnual = residuos * EMISSION_FACTORS.residuos;

    // --- 3. TOTAL ---
    const total = transporteTerrestreAnual + energiaAnual + aguaAnual + residuosAnual;

    return {
      transporte_terrestre: parseFloat(transporteTerrestreAnual.toFixed(2)),
      consumo_energia: parseFloat(energiaAnual.toFixed(2)),
      consumo_agua: parseFloat(aguaAnual.toFixed(2)),
      residuos: parseFloat(residuosAnual.toFixed(2)),
      
      // Desglose de inputs para el frontend
      desglose_transporte: {
          ...desgloseTransporte,
          data_input: transporte_terrestre_data
      },

      // Eliminar transporte aereo y alimentación del resultado
      total: parseFloat(total.toFixed(2))
    };
  }

  static getFootprintCategory(totalCO2) {
    if (totalCO2 < 2000) return { categoria: 'Muy Bajo', color: '#22c55e' };
    if (totalCO2 < 4000) return { categoria: 'Bajo', color: '#84cc16' };
    if (totalCO2 < 8000) return { categoria: 'Promedio', color: '#eab308' };
    if (totalCO2 < 15000) return { categoria: 'Alto', color: '#f97316' };
    return { categoria: 'Muy Alto', color: '#ef4444' };
  }

  static generateRecommendations(calculation) {
    const recommendations = [];
    const publico = calculation.desglose_transporte.publico;
    const personal = calculation.desglose_transporte.personal;
    
    if (publico > 2500 || personal > 2500) {
      recommendations.push('Evalúa el uso de medios de transporte no motorizados (bicicleta, caminar) o transporte eléctrico.');
    } else if (personal > publico && personal > 1000) {
        recommendations.push('Considera cambiar el tipo de combustible de tu vehículo personal por uno con menor factor de emisión (ej: GNV o eléctrico).');
    }
    
    if (calculation.consumo_energia > 4000) {
      recommendations.push('Reduce el consumo energético con electrodomésticos eficientes y apagando luces innecesarias.');
    }
    
    if (calculation.residuos > 1500) {
      recommendations.push('Implementa o mejora la separación de residuos (reciclaje, compostaje) para reducir tu huella.');
    }

    if (recommendations.length === 0) {
      recommendations.push('¡Excelente! Tu huella es baja, mantén y mejora estos hábitos sostenibles.');
    }
    
    return recommendations;
  }
}

module.exports = CarbonService;