import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carbonAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Calculator, TrendingUp, TrendingDown, BarChart3, BookOpen, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, progressResponse] = await Promise.all([
          carbonAPI.getStats(),
          carbonAPI.getProgress()
        ]);
        
        setStats(statsResponse.data.stats);
        setProgress(progressResponse.data.progress);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Nuevo Cálculo',
      description: 'Calcula tu huella de carbono actual',
      icon: Calculator,
      link: '/calculate',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Ver Historial',
      description: 'Revisa tus cálculos anteriores',
      icon: BarChart3,
      link: '/history',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Contenido Educativo',
      description: 'Aprende sobre sostenibilidad',
      icon: BookOpen,
      link: '/education',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user?.nombre}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Aquí tienes un resumen de tu actividad ambiental
        </p>
      </div>

      {/* Progress Card */}
      {progress && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tu Progreso</h3>
              <p className="text-gray-600">{progress.message}</p>
              <div className="mt-2 text-sm text-gray-500">
                Último cálculo: {new Date(progress.current_date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center">
              {progress.status === 'improved' ? (
                <TrendingDown className="h-8 w-8 text-green-500" />
              ) : progress.status === 'increased' ? (
                <TrendingUp className="h-8 w-8 text-red-500" />
              ) : (
                <BarChart3 className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cálculos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_calculations || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Huella Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.average_footprint || 0}</p>
              <p className="text-xs text-gray-500">kg CO2e/año</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mejor Resultado</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.min_footprint || 0}</p>
              <p className="text-xs text-gray-500">kg CO2e/año</p>
            </div>
            <TrendingDown className="h-8 w-8 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map(({ title, description, icon: Icon, link, color }, index) => (
            <Link
              key={index}
              to={link}
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${color} transition-colors`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      {(!stats || stats.total_calculations === 0) && (
        <div className="card border-primary-200 bg-primary-50">
          <div className="text-center">
            <Calculator className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Bienvenido a CarbonTrack!
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza calculando tu primera huella de carbono para ver tu impacto ambiental
            </p>
            <Link
              to="/calculate"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Realizar Primera Calculación</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}