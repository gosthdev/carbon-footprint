const { EducationalContent, ContentView } = require('../models');

class EducationController {
  static async getContent(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const categoria = req.query.categoria;
      const offset = (page - 1) * limit;

      const whereClause = { activo: true };
      if (categoria) {
        whereClause.categoria = categoria;
      }

      const { count, rows } = await EducationalContent.findAndCountAll({
        where: whereClause,
        order: [['fecha_publicacion', 'DESC']],
        limit,
        offset,
        attributes: ['id', 'titulo', 'texto', 'categoria', 'fecha_publicacion']
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        content: rows,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: count,
          items_per_page: limit
        }
      });
    } catch (error) {
      console.error('Error obteniendo contenido educativo:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getContentById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const content = await EducationalContent.findOne({
        where: { id, activo: true },
        attributes: ['id', 'titulo', 'texto', 'categoria', 'fecha_publicacion']
      });

      if (!content) {
        return res.status(404).json({ 
          error: 'Contenido no encontrado' 
        });
      }

      // Registrar visualización (sin duplicados)
      await ContentView.findOrCreate({
        where: {
          user_id: userId,
          content_id: id
        },
        defaults: {
          user_id: userId,
          content_id: id
        }
      });

      res.json({ content });
    } catch (error) {
      console.error('Error obteniendo contenido:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await EducationalContent.findAll({
        where: { activo: true },
        attributes: ['categoria'],
        group: ['categoria'],
        order: [['categoria', 'ASC']]
      });

      res.json({
        categories: categories.map(c => c.categoria)
      });
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}

module.exports = EducationController;