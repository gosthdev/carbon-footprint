import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { carbonAPI, metricsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, BarChart3, Globe, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, progressResponse, metricsResponse] = await Promise.all([
          carbonAPI.getStats(),
          carbonAPI.getProgress(),
          metricsAPI.getDashboardMetrics()
        ]);
        
        setStats(statsResponse.data.stats);
        setProgress(progressResponse.data.progress);
        setGlobalMetrics(metricsResponse.data.dashboard_metrics);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDashboardRefresh = (e) => {
    if (location.pathname === '/dashboard') {
      e.preventDefault();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tu Huella Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.average_footprint || 0}</p>
              <p className="text-xs text-gray-500">kg CO2e/año</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio Global</p>
              <p className="text-2xl font-bold text-gray-900">{globalMetrics?.average_footprint || 0}</p>
              <p className="text-xs text-gray-500">kg CO2e/año (todos los usuarios)</p>
            </div>
            <Globe className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Cálculos Globales</p>
              <p className="text-2xl font-bold text-gray-900">{globalMetrics?.total_calculations || 0}</p>
              <p className="text-xs text-gray-500">de todos los usuarios</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Getting Started */}
      {(!stats || stats.total_calculations === 0) && (
        <div className="card border-primary-200 bg-primary-50">
          <div className="text-center">
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
              <span>Realizar Primer Cálculo</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}