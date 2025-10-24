const { User, ContentView, CarbonCalculation } = require('../models');
const { Op } = require('sequelize');

class MetricsController {
  static async getActiveUsers(req, res) {
    try {
      const now = new Date();
            
      // Usuarios activos último mes
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const monthlyActiveUsers = await User.count({
        include: [{
          model: CarbonCalculation,
          where: {
            fecha: {
              [Op.gte]: oneMonthAgo
            }
          },
          required: true
        }]
      });

      // Total de usuarios registrados
      const totalUsers = await User.count();

          // Usuarios que se registraron este mes
      const newUsersThisMonth = await User.count({
        where: {
          fecha_registro: {
            [Op.gte]: oneMonthAgo
          }
        }
      });

      // --- LÓGICA DE PORCENTAJE DE REDUCCIÓN DE HUELLA ---

      // 1. Obtener solo los usuarios que tienen 2 o más cálculos
      const usersWithMultipleCalcs = await CarbonCalculation.findAll({
        attributes: [
            'user_id',
            [CarbonCalculation.sequelize.fn('COUNT', CarbonCalculation.sequelize.col('id')), 'total_calcs']
        ],
        group: ['user_id'],
        having: CarbonCalculation.sequelize.literal('COUNT(id) >= 2') // Filtra solo si hay 2 o más
      });

      // Contar usuarios que redujeron su huella
      let usersReducedCount = 0;

      // 2. Iterar y comparar: Último cálculo vs. Primer cálculo
      for (const user of usersWithMultipleCalcs) {
          const userId = user.user_id;
          
          // El primer cálculo (orden ascendente por fecha)
          const firstCalc = await CarbonCalculation.findOne({
              where: { user_id: userId },
              order: [['fecha', 'ASC']],
              attributes: ['resultado']
          });

          // El último cálculo (orden descendente por fecha)
          const lastCalc = await CarbonCalculation.findOne({
              where: { user_id: userId },
              order: [['fecha', 'DESC']],
              attributes: ['resultado']
          });

          // Comparar resultados (usamos parseFloat para asegurar comparación numérica)
          if (parseFloat(lastCalc.resultado) < parseFloat(firstCalc.resultado)) {
              usersReducedCount++;
          }
      }
      
      // El porcentaje se calcula sobre el total de usuarios registrados (totalUsers)
      const percentageReducedFootprint = totalUsers > 0 
          ? ((usersReducedCount / totalUsers) * 100).toFixed(2) 
          : 0;

      res.json({
        metrics: {
          total_users: totalUsers,
          monthly_active_users: monthlyActiveUsers, 
          new_users_this_month: newUsersThisMonth,  
          percentage_reduced_footprint: parseFloat(percentageReducedFootprint),
        }
      });
    } catch (error) {
      console.error('Error obteniendo métricas de usuarios activos:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getContentMetrics(req, res) {
    try {
      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      
      // Contenido más visto en los últimos 6 meses
      const topContent = await ContentView.findAll({
        where: {
          fecha: {
            [Op.gte]: sixMonthsAgo
          }
        },
        attributes: [
          'content_id',
          [ContentView.sequelize.fn('COUNT', ContentView.sequelize.col('ContentView.id')), 'views']
        ],
        include: [{
          model: require('../models').EducationalContent,
          attributes: ['titulo', 'categoria']
        }],
        group: ['content_id', 'EducationalContent.id', 'EducationalContent.titulo', 'EducationalContent.categoria'],
        order: [[ContentView.sequelize.fn('COUNT', ContentView.sequelize.col('ContentView.id')), 'DESC']],
        limit: 5
      });

      // Métrica: Proporción de usuarios que consultan contenido
      const totalUsers = await User.count();
      
      const viewersCount = await ContentView.count({
        distinct: true,
        col: 'user_id'
      });

      const proportionContentUsers = totalUsers > 0
          ? ((viewersCount / totalUsers) * 100).toFixed(2)
          : 0;

      res.json({
        content_metrics: {
          // total_content_views_6_months ELIMINADO
          top_content: topContent.map(item => ({
            content_id: item.content_id,
            titulo: item.EducationalContent.titulo,
            categoria: item.EducationalContent.categoria,
            views: parseInt(item.dataValues.views)
          })),
          proportion_content_users: parseFloat(proportionContentUsers)
        }
      });
    } catch (error) {
      console.error('Error obteniendo métricas de contenido:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getDashboardMetrics(req, res) {
    try {
      const now = new Date();

      // Total de cálculos realizados
      const totalCalculations = await CarbonCalculation.count();
            
      // Promedio general de huella de carbono
      const avgFootprint = await CarbonCalculation.findOne({
        attributes: [
          [CarbonCalculation.sequelize.fn('AVG', CarbonCalculation.sequelize.col('resultado')), 'promedio']
        ]
      });

      res.json({
        dashboard_metrics: {
          total_calculations: totalCalculations,
          average_footprint: avgFootprint ? parseFloat(avgFootprint.dataValues.promedio).toFixed(2) : 0
        }
      });
    } catch (error) {
      console.error('Error obteniendo métricas del dashboard:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}

module.exports = MetricsController;