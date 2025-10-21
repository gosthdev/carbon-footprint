import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { carbonAPI } from '../api/api';
import { Calculator, Car, Plane, Zap, Droplets, Trash2, Utensils, CheckCircle } from 'lucide-react';

export default function CalculatePage() {
  const [formData, setFormData] = useState({
    transporte_terrestre: '',
    transporte_aereo: '',
    consumo_energia: '',
    consumo_agua: '',
    residuos: '',
    alimentacion: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formFields = [
    {
      key: 'transporte_terrestre',
      label: 'Transporte Terrestre',
      icon: Car,
      placeholder: 'Ej: 15000',
      unit: 'km/año',
      description: 'Kilómetros recorridos en auto, moto o transporte terrestre por año'
    },
    {
      key: 'transporte_aereo',
      label: 'Transporte Aéreo',
      icon: Plane,
      placeholder: 'Ej: 5000',
      unit: 'km/año',
      description: 'Kilómetros en vuelos por año'
    },
    {
      key: 'consumo_energia',
      label: 'Consumo de Energía',
      icon: Zap,
      placeholder: 'Ej: 350',
      unit: 'kWh/mes',
      description: 'Consumo eléctrico mensual promedio'
    },
    {
      key: 'consumo_agua',
      label: 'Consumo de Agua',
      icon: Droplets,
      placeholder: 'Ej: 15',
      unit: 'm³/mes',
      description: 'Metros cúbicos de agua consumidos por mes'
    },
    {
      key: 'residuos',
      label: 'Residuos',
      icon: Trash2,
      placeholder: 'Ej: 8',
      unit: 'kg/semana',
      description: 'Kilogramos de residuos generados por semana'
    },
    {
      key: 'alimentacion',
      label: 'Alimentación',
      icon: Utensils,
      placeholder: 'Ej: 6',
      unit: 'escala 1-10',
      description: 'Puntuación donde 1=vegetariano, 10=mucha carne roja'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convertir valores a números
      const numericData = {};
      Object.keys(formData).forEach(key => {
        const value = parseFloat(formData[key]) || 0;
        numericData[key] = value;
      });

      const response = await carbonAPI.calculate(numericData);
      setResult(response.data.calculation);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al calcular la huella de carbono');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCalculation = () => {
    setResult(null);
    setFormData({
      transporte_terrestre: '',
      transporte_aereo: '',
      consumo_energia: '',
      consumo_agua: '',
      residuos: '',
      alimentacion: ''
    });
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header de resultado */}
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Cálculo Completado!
          </h1>
          <p className="text-gray-600">
            Aquí están los resultados de tu huella de carbono
          </p>
        </div>

        {/* Resultado principal */}
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu Huella de Carbono Total</h2>
          <div className="flex items-center justify-center space-x-4">
            <div>
              <p className="text-4xl font-bold" style={{ color: result.categoria.color }}>
                {result.desglose.total}
              </p>
              <p className="text-sm text-gray-500">kg CO2e/año</p>
            </div>
            <div className="px-4 py-2 rounded-full text-sm font-medium" 
                 style={{ 
                   backgroundColor: result.categoria.color + '20', 
                   color: result.categoria.color 
                 }}>
              {result.categoria.categoria}
            </div>
          </div>
        </div>

        {/* Desglose por categorías */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose por Categorías</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {formFields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {result.desglose[key]} kg CO2e
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
          <ul className="space-y-2">
            {result.recomendaciones.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNewCalculation}
            className="btn-primary"
          >
            Nueva Calculación
          </button>
          <Link
            to="/history"
            className="btn-secondary text-center"
          >
            Ver Historial
          </Link>
          <Link
            to="/education"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
          >
            Aprender Más
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Calculator className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calcular Huella de Carbono
        </h1>
        <p className="text-gray-600">
          Ingresa tus datos de consumo para conocer tu impacto ambiental
        </p>
      </div>

      {/* Form */}
      <div className="card">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {formFields.map(({ key, label, icon: Icon, placeholder, unit, description }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span>{label}</span>
                    <span className="text-xs text-gray-500">({unit})</span>
                  </div>
                </label>
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  min="0"
                  step="0.01"
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Calculando...</span>
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  <span>Calcular Huella de Carbono</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para un cálculo preciso:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Usa datos aproximados si no tienes cifras exactas</li>
            <li>• Los campos vacíos se considerarán como 0</li>
            <li>• Puedes actualizar tus datos en cualquier momento</li>
            <li>• Realiza cálculos periódicos para ver tu progreso</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
                    