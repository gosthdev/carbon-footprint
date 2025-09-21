const { User, ContentView, CarbonCalculation } = require('../models');
const { Op } = require('sequelize');

class MetricsController {
  static async getActiveUsers(req, res) {
    try {
      const now = new Date();
      
      // Usuarios activos última semana
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyActiveUsers = await User.count({
        include: [{
          model: CarbonCalculation,
          where: {
            fecha: {
              [Op.gte]: oneWeekAgo
            }
          },
          required: true
        }]
      });

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

      // Usuarios que se registraron esta semana
      const newUsersThisWeek = await User.count({
        where: {
          fecha_registro: {
            [Op.gte]: oneWeekAgo
          }
        }
      });

      // Usuarios que se registraron este mes
      const newUsersThisMonth = await User.count({
        where: {
          fecha_registro: {
            [Op.gte]: oneMonthAgo
          }
        }
      });

      res.json({
        metrics: {
          weekly_active_users: weeklyActiveUsers,
          monthly_active_users: monthlyActiveUsers,
          total_users: totalUsers,
          new_users_this_week: newUsersThisWeek,
          new_users_this_month: newUsersThisMonth
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

      // Usuarios que han consultado al menos un contenido en los últimos 6 meses
      const usersWithContentViews = await User.count({
        include: [{
          model: ContentView,
          where: {
            fecha: {
              [Op.gte]: sixMonthsAgo
            }
          },
          required: true
        }]
      });

      // Total de visualizaciones de contenido en los últimos 6 meses
      const totalContentViews = await ContentView.count({
        where: {
          fecha: {
            [Op.gte]: sixMonthsAgo
          }
        }
      });

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

      res.json({
        content_metrics: {
          users_with_content_views_6_months: usersWithContentViews,
          total_content_views_6_months: totalContentViews,
          top_content: topContent.map(item => ({
            content_id: item.content_id,
            titulo: item.EducationalContent.titulo,
            categoria: item.EducationalContent.categoria,
            views: parseInt(item.dataValues.views)
          }))
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
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total de cálculos realizados
      const totalCalculations = await CarbonCalculation.count();
      
      // Cálculos esta semana
      const calculationsThisWeek = await CarbonCalculation.count({
        where: {
          fecha: {
            [Op.gte]: oneWeekAgo
          }
        }
      });

      // Promedio general de huella de carbono
      const avgFootprint = await CarbonCalculation.findOne({
        attributes: [
          [CarbonCalculation.sequelize.fn('AVG', CarbonCalculation.sequelize.col('resultado')), 'promedio']
        ]
      });

      res.json({
        dashboard_metrics: {
          total_calculations: totalCalculations,
          calculations_this_week: calculationsThisWeek,
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