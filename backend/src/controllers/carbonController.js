const { CarbonCalculation } = require('../models');
const CarbonService = require('../services/carbonService');
const { Op } = require('sequelize');

class CarbonController {
  static async calculate(req, res) {
    try {
      const userId = req.user.id;
      const inputData = req.body;

      // Calcular huella de carbono
      const calculation = CarbonService.calculateCarbonFootprint(inputData);

      // Guardar en base de datos
      const savedCalculation = await CarbonCalculation.create({
        user_id: userId,
        transporte_terrestre_data: inputData.transporte_terrestre_data,         
        consumo_energia: inputData.consumo_energia || 0,
        consumo_agua: inputData.consumo_agua || 0,
        residuos: inputData.residuos || 0,
        resultado: calculation.total
      });

      // Obtener categoría y recomendaciones
      const category = CarbonService.getFootprintCategory(calculation.total);
      const recommendations = CarbonService.generateRecommendations(calculation);

      res.status(201).json({
        message: 'Cálculo realizado exitosamente',
        calculation: {
          id: savedCalculation.id,
          desglose: calculation,
          categoria: category,
          recomendaciones: recommendations,
          fecha: savedCalculation.fecha
        }
      });
    } catch (error) {
      console.error('Error en cálculo:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await CarbonCalculation.findAndCountAll({
        where: { user_id: userId },
        order: [['fecha', 'DESC']],
        limit,
        offset,
        attributes: ['id', 'resultado', 'fecha', 'transporte_terrestre_data', 
                     'consumo_energia', 'consumo_agua', 'residuos']
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        calculations: rows.map(calc => ({
          ...calc.dataValues,
          // Calcular el desglose de emisiones anualizadas (aunque no se guarde)
          desglose: CarbonService.calculateCarbonFootprint({ 
              transporte_terrestre_data: calc.transporte_terrestre_data,
              consumo_energia: calc.consumo_energia,
              consumo_agua: calc.consumo_agua,
              residuos: calc.residuos
          }),
          categoria: CarbonService.getFootprintCategory(calc.resultado)
        })),
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: count,
          items_per_page: limit
        }
      });
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getProgress(req, res) {
    try {
      const userId = req.user.id;

      // Obtener los dos últimos cálculos
      const lastCalculations = await CarbonCalculation.findAll({
        where: { user_id: userId },
        order: [['fecha', 'DESC']],
        limit: 2,
        attributes: ['resultado', 'fecha']
      });

      if (lastCalculations.length < 2) {
        return res.json({
          message: 'Necesitas al menos 2 cálculos para ver el progreso',
          progress: null
        });
      }

      const [current, previous] = lastCalculations;
      const difference = current.resultado - previous.resultado;
      const percentageChange = ((difference / previous.resultado) * 100).toFixed(1);

      let status, message;
      if (difference < 0) {
        status = 'improved';
        message = `¡Excelente! Tu huella se redujo en ${Math.abs(difference).toFixed(2)} kg CO2e (${Math.abs(percentageChange)}%)`;
      } else if (difference > 0) {
        status = 'increased';
        message = `Tu huella aumentó en ${difference.toFixed(2)} kg CO2e (${percentageChange}%)`;
      } else {
        status = 'unchanged';
        message = 'Tu huella se mantiene igual';
      }

      res.json({
        progress: {
          current_footprint: current.resultado,
          previous_footprint: previous.resultado,
          difference: parseFloat(difference.toFixed(2)),
          percentage_change: parseFloat(percentageChange),
          status,
          message,
          current_date: current.fecha,
          previous_date: previous.fecha
        }
      });
    } catch (error) {
      console.error('Error obteniendo progreso:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getStats(req, res) {
    try {
      const userId = req.user.id;

      // Estadísticas del usuario
      const totalCalculations = await CarbonCalculation.count({
        where: { user_id: userId }
      });

      const avgFootprint = await CarbonCalculation.findOne({
        where: { user_id: userId },
        attributes: [
          [CarbonCalculation.sequelize.fn('AVG', CarbonCalculation.sequelize.col('resultado')), 'promedio']
        ]
      });

      const minFootprint = await CarbonCalculation.min('resultado', {
        where: { user_id: userId }
      });

      const maxFootprint = await CarbonCalculation.max('resultado', {
        where: { user_id: userId }
      });

      res.json({
        stats: {
          total_calculations: totalCalculations,
          average_footprint: avgFootprint ? parseFloat(avgFootprint.dataValues.promedio).toFixed(2) : 0,
          min_footprint: minFootprint || 0,
          max_footprint: maxFootprint || 0
        }
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}

module.exports = CarbonController;