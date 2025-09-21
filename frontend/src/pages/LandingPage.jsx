import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Calculator, TrendingDown, BookOpen, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Calculator,
      title: 'Calcula tu Huella',
      description: 'Mide tu impacto ambiental considerando transporte, energía, alimentación y más.'
    },
    {
      icon: TrendingDown,
      title: 'Seguimiento del Progreso',
      description: 'Visualiza si tu huella de carbono está disminuyendo con el tiempo.'
    },
    {
      icon: BookOpen,
      title: 'Contenido Educativo',
      description: 'Aprende sobre sostenibilidad y cómo reducir tu impacto ambiental.'
    },
    {
      icon: BarChart3,
      title: 'Análisis Detallado',
      description: 'Obtén insights sobre tus patrones de consumo y áreas de mejora.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">CarbonTrack</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Mide y Reduce tu{' '}
            <span className="text-primary-600">Huella de Carbono</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Toma control de tu impacto ambiental. Calcula, monitorea y reduce tu huella de carbono 
            con herramientas simples y contenido educativo de calidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              Comenzar Gratis
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-8 rounded-lg text-lg border border-gray-300 transition-colors duration-200"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Todo lo que necesitas para ser más sostenible
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div key={index} className="card text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Únete a la comunidad sostenible
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">2.5 Ton</div>
              <p className="text-gray-600">Reducción promedio de CO2e por usuario</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">85%</div>
              <p className="text-gray-600">Usuarios que mejoran su huella</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <p className="text-gray-600">Cálculos realizados</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para hacer la diferencia?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Comienza a medir tu huella de carbono hoy y contribuye a un planeta más sostenible.
          </p>
          <Link
            to="/register"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-block"
          >
            Empezar Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 text-primary-400" />
            <span className="text-lg font-semibold">CarbonTrack</span>
          </div>
          <p className="text-gray-400">
            Construyendo un futuro más sostenible, un cálculo a la vez.
          </p>
        </div>
      </footer>
    </div>
  );
}