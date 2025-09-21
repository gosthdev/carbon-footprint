// Factores de emisión en kg CO2e
const EMISSION_FACTORS = {
  // Transporte terrestre (km/año)
  transporte_terrestre: 0.12, // kg CO2e por km en auto promedio
  
  // Transporte aéreo (km/año)
  transporte_aereo: 0.255, // kg CO2e por km en vuelo
  
  // Consumo energía (kWh/mes)
  consumo_energia: 0.5, // kg CO2e por kWh (promedio latinoamérica)
  
  // Consumo agua (m3/mes)
  consumo_agua: 0.34, // kg CO2e por m3
  
  // Residuos (kg/semana)
  residuos: 0.5, // kg CO2e por kg de residuo
  
  // Alimentación (puntuación 1-10, donde 10 es más carne)
  alimentacion: 500 // kg CO2e base por punto en la escala
};

class CarbonService {
  static calculateCarbonFootprint(data) {
    const {
      transporte_terrestre = 0,
      transporte_aereo = 0,
      consumo_energia = 0,
      consumo_agua = 0,
      residuos = 0,
      alimentacion = 0
    } = data;

    // Cálculos anualizados
    const transporteTerrestreAnual = transporte_terrestre * EMISSION_FACTORS.transporte_terrestre;
    const transporteAereoAnual = transporte_aereo * EMISSION_FACTORS.transporte_aereo;
    const energiaAnual = consumo_energia * 12 * EMISSION_FACTORS.consumo_energia;
    const aguaAnual = consumo_agua * 12 * EMISSION_FACTORS.consumo_agua;
    const residuosAnual = residuos * 52 * EMISSION_FACTORS.residuos;
    const alimentacionAnual = alimentacion * EMISSION_FACTORS.alimentacion;

    const total = transporteTerrestreAnual + transporteAereoAnual + 
                  energiaAnual + aguaAnual + residuosAnual + alimentacionAnual;

    return {
      transporte_terrestre: parseFloat(transporteTerrestreAnual.toFixed(2)),
      transporte_aereo: parseFloat(transporteAereoAnual.toFixed(2)),
      consumo_energia: parseFloat(energiaAnual.toFixed(2)),
      consumo_agua: parseFloat(aguaAnual.toFixed(2)),
      residuos: parseFloat(residuosAnual.toFixed(2)),
      alimentacion: parseFloat(alimentacionAnual.toFixed(2)),
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
    
    if (calculation.transporte_terrestre > 2000) {
      recommendations.push('Considera usar transporte público o vehículos eléctricos');
    }
    
    if (calculation.transporte_aereo > 1000) {
      recommendations.push('Reduce los vuelos cuando sea posible o compensa las emisiones');
    }
    
    if (calculation.consumo_energia > 3000) {
      recommendations.push('Optimiza el consumo energético con electrodomésticos eficientes');
    }
    
    if (calculation.alimentacion > 2500) {
      recommendations.push('Considera reducir el consumo de carne y productos procesados');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('¡Excelente! Mantén estos hábitos sostenibles');
    }
    
    return recommendations;
  }
}

module.exports = CarbonService;