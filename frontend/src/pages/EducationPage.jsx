import React, { useState, useEffect } from 'react';
import { educationAPI } from '../api/api';
import { BookOpen, Filter, Eye, Calendar } from 'lucide-react';

export default function EducationPage() {
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchContent();
  }, [currentPage, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await educationAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await educationAPI.getContent(currentPage, 6, selectedCategory);
      setContent(response.data.content);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Error al cargar contenido educativo');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSelectedContent(null);
  };

  const handleContentClick = async (contentItem) => {
    try {
      const response = await educationAPI.getContentById(contentItem.id);
      setSelectedContent(response.data.content);
    } catch (error) {
      console.error('Error cargando contenido:', error);
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'conceptos_basicos': 'Conceptos Básicos',
      'transporte': 'Transporte',
      'energia': 'Energía',
      'alimentacion': 'Alimentación',
      'residuos': 'Residuos',
      'compensacion': 'Compensación',
      'general': 'General'
    };
    return categoryMap[category] || category;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedContent) {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseURL = API_BASE_URL.replace('/api', '');
    
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Botón volver */}
        <button
          onClick={() => setSelectedContent(null)}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <span>←</span>
          <span>Volver al listado</span>
        </button>

        {/* Imagen infografía - Full size */}
        {selectedContent.imagen_url && (
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={`${baseURL}${selectedContent.imagen_url}`}
              alt={selectedContent.titulo}
              className="w-full h-auto object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contenido Educativo</h1>
        <p className="text-gray-600">
          Aprende sobre sostenibilidad y cómo reducir tu huella de carbono
        </p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filtrar por categoría:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === '' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Grid de contenido */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const baseURL = API_BASE_URL.replace('/api', '');
            
            return (
              <div
                key={item.id}
                onClick={() => handleContentClick(item)}
                className="card hover:shadow-md transition-shadow cursor-pointer group overflow-hidden flex flex-col h-full"
              >
                {/* Imagen si existe */}
                {item.imagen_url && (
                  <div className="mb-4 -mx-4 -mt-4 h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={`${baseURL}${item.imagen_url}`}
                      alt={item.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full mb-3">
                      {getCategoryDisplayName(item.categoria)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.titulo}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {item.texto.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.fecha_publicacion)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-primary-600 group-hover:text-primary-700 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Leer más</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {pagination.total_pages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
            disabled={currentPage === pagination.total_pages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}