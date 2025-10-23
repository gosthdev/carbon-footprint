import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../api/api';
import { Users, BookOpen, TrendingUp, TrendingDown, Eye } from 'lucide-react';

const getCategoryDisplayName = (category) => {
    if (category === 'transporte') return 'Transporte';
    if (category === 'energia') return 'Energía';
    if (category === 'agua') return 'Agua';
    if (category === 'residuos') return 'Residuos';
    if (category === 'alimentacion') return 'Alimentación';
    return category;
};

export default function MetricsPage() {
  const [activeUsersMetrics, setActiveUsersMetrics] = useState(null);
  const [contentMetrics, setContentMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
    try {
      setLoading(true);
      const [activeUsersResponse, contentResponse] = await Promise.all([
        metricsAPI.getActiveUsers(),
        metricsAPI.getContentMetrics(),
      ]);

      setActiveUsersMetrics(activeUsersResponse.data.metrics);
      setContentMetrics(contentResponse.data.content_metrics);
    } catch (error) {
      setError('Error al cargar métricas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const userMetricCards = [
    {
      title: 'Cantidad de Usuarios Registrados',
      value: activeUsersMetrics?.total_users || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Cantidad de Usuarios Activos este mes',
      value: activeUsersMetrics?.monthly_active_users || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Cantidad de Usuarios Nuevos este mes',
      value: activeUsersMetrics?.new_users_this_month || 0,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: '% Usuarios que redujeron su huella (respecto al primer registro)',
      value: `${activeUsersMetrics?.percentage_reduced_footprint || 0}%`,
      icon: TrendingDown,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Métricas</h1>
        <p className="text-gray-600">
          Estadísticas de la plataforma
        </p>
      </div>

      {/* Métricas de usuarios */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Métricas de Usuarios</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userMetricCards.map(({ title, value, icon: Icon, color, bgColor }, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas de contenido educativo */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Métricas de Contenido Educativo</span>
        </h2>
    
        <div className="grid md:grid-cols-1 gap-6 mb-6"> 
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Proporción de Usuarios que consultan contenido
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {contentMetrics?.proportion_content_users || 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Top contenido */}
        {contentMetrics?.top_content && contentMetrics.top_content.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Eye className="h-5 w-5 text-green-600"/>
                <span>Contenido Más Consultado (6 meses)</span>
            </h3>
            <div className="space-y-3">
              {contentMetrics.top_content.map((item, index) => (
                <div key={item.content_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.titulo}</p>
                      <p className="text-sm text-gray-600">{getCategoryDisplayName(item.categoria)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{item.views}</p>
                    <p className="text-xs text-gray-500">visualizaciones</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      
      {/* Botón de actualización */}
      <div className="text-center">
        <button
          onClick={fetchAllMetrics}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar Métricas'}
        </button>
      </div>
    </div>
  );
}