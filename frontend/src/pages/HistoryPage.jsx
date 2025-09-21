import React, { useState, useEffect } from 'react';
import { carbonAPI } from '../api/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';

export default function HistoryPage() {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await carbonAPI.getHistory(currentPage, 10);
      setCalculations(response.data.calculations);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Error al cargar el historial');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (current, previous) => {
    if (!previous) return null;
    
    if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    } else if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else {
      return <BarChart3 className="h-4 w-4 text-gray-400" />;
    }
  };

  // Preparar datos para el gráfico
  const chartData = calculations.slice().reverse().map((calc, index) => ({
    fecha: formatDate(calc.fecha),
    huella: parseFloat(calc.resultado),
    fechaCompleta: calc.fecha
  }));

  if (loading && calculations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay cálculos aún</h2>
          <p className="text-gray-600 mb-8">
            Realiza tu primer cálculo de huella de carbono para ver tu historial aquí
          </p>
          <button
            onClick={() => window.location.href = '/calculate'}
            className="btn-primary"
          >
            Realizar Primera Calculación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Cálculos</h1>
        <p className="text-gray-600">
          Visualiza la evolución de tu huella de carbono a lo largo del tiempo
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Gráfico */}
      {chartData.length > 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de tu Huella de Carbono</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'kg CO2e/año', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} kg CO2e`, 'Huella de Carbono']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="huella" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Lista de cálculos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial Detallado</h3>
        <div className="space-y-4">
          {calculations.map((calc, index) => (
            <div key={calc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(calc.fecha)}
                    </span>
                  </div>
                  {index < calculations.length - 1 && getStatusIcon(calc.resultado, calculations[index + 1]?.resultado)}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold" style={{ color: calc.categoria.color }}>
                    {calc.resultado} kg CO2e
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ 
                          backgroundColor: calc.categoria.color + '20', 
                          color: calc.categoria.color 
                        }}>
                    {calc.categoria.categoria}
                  </span>
                </div>
              </div>
              
              {/* Desglose compacto */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-gray-500">Transporte T.</p>
                    <p className="font-medium">{calc.transporte_terrestre}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Transporte A.</p>
                    <p className="font-medium">{calc.transporte_aereo}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Energía</p>
                    <p className="font-medium">{calc.consumo_energia}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Agua</p>
                    <p className="font-medium">{calc.consumo_agua}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Residuos</p>
                    <p className="font-medium">{calc.residuos}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Alimentación</p>
                    <p className="font-medium">{calc.alimentacion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
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
    </div>
  );
}