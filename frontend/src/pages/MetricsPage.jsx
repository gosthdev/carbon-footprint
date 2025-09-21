import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../api/api';
import { Users, BookOpen, BarChart3, TrendingUp, Calendar, Eye } from 'lucide-react';

export default function MetricsPage() {
  const [activeUsersMetrics, setActiveUsersMetrics] = useState(null);
  const [contentMetrics, setContentMetrics] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
    try {
      setLoading(true);
      const [activeUsersResponse, contentResponse, dashboardResponse] = await Promise.all([
        metricsAPI.getActiveUsers(),
        metricsAPI.getContentMetrics(),
        metricsAPI.getDashboardMetrics()
      ]);

      setActiveUsersMetrics(activeUsersResponse.data.metrics);
      setContentMetrics(contentResponse.data.content_metrics);
      setDashboardMetrics(dashboardResponse.data.dashboard_metrics);
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
      title: 'Usuarios Activos (Semana)',
      value: activeUsersMetrics?.weekly_active_users || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Usuarios Activos (Mes)',
      value: activeUsersMetrics?.monthly_active_users || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Usuarios',
      value: activeUsersMetrics?.total_users || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Nuevos (Semana)',
      value: activeUsersMetrics?.new_users_this_week || 0,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Nuevos (Mes)',
      value: activeUsersMetrics?.new_users_this_month || 0,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    {
      title: 'Total Cálculos',
      value: dashboardMetrics?.total_calculations || 0,
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Métricas</h1>
        <p className="text-gray-600">
          Estadísticas de uso y engagement de la plataforma
        </p>
      </div>

      {/* Métricas de usuarios */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Métricas de Usuarios</span>
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Usuarios que consultaron contenido (6 meses)
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {contentMetrics?.users_with_content_views_6_months || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total visualizaciones (6 meses)
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {contentMetrics?.total_content_views_6_months || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Top contenido */}
        {contentMetrics?.top_content && contentMetrics.top_content.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contenido Más Consultado (6 meses)
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

      {/* Métricas generales */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Métricas Generales</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Cálculos esta semana
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardMetrics?.calculations_this_week || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Huella promedio global
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardMetrics?.average_footprint || 0}
                </p>
                <p className="text-xs text-gray-500">kg CO2e/año</p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Insights de la Plataforma</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Engagement de Usuarios</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tasa de retención semanal:</span>
                <span className="font-medium">
                  {activeUsersMetrics?.total_users > 0 
                    ? Math.round((activeUsersMetrics.weekly_active_users / activeUsersMetrics.total_users) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tasa de retención mensual:</span>
                <span className="font-medium">
                  {activeUsersMetrics?.total_users > 0 
                    ? Math.round((activeUsersMetrics.monthly_active_users / activeUsersMetrics.total_users) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Usuarios que leen contenido:</span>
                <span className="font-medium">
                  {activeUsersMetrics?.total_users > 0 
                    ? Math.round((contentMetrics?.users_with_content_views_6_months / activeUsersMetrics.total_users) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Uso de la Plataforma</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cálculos por usuario activo:</span>
                <span className="font-medium">
                  {activeUsersMetrics?.weekly_active_users > 0 
                    ? Math.round(dashboardMetrics?.total_calculations / activeUsersMetrics.weekly_active_users)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Visualizaciones por usuario:</span>
                <span className="font-medium">
                  {contentMetrics?.users_with_content_views_6_months > 0 
                    ? Math.round(contentMetrics?.total_content_views_6_months / contentMetrics.users_with_content_views_6_months)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
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