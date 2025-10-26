import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { carbonAPI } from '../api/api';
// Importar nuevos iconos
  import {Calculator, Zap, Droplets, Trash2, Bus, Car, XCircle, BarChart2, Lightbulb, Fuel, CheckCircle} from 'lucide-react';

// Componente auxiliar para el desglose (basado en tu diseño)
const DesgloseItem = ({ label, value, color }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-lg font-bold ${color}`}>
            {value.toLocaleString('es-PE')} kg CO2e
        </span>
    </div>
);

export default function CalculatePage() {
    // Definición del estado inicial del formulario con la nueva estructura
    const [formData, setFormData] = useState({
        // Consumos Directos (Mensuales)
        consumo_energia: '',
        consumo_agua: '',
        // Residuos (Semanal)
        residuos: '',
        // Transporte Terrestre (Mensual, Anidado)
        transporte_terrestre_data: {
            tipos_publicos: {
                custer: '',
                combi: '',
                bus: '',
                taxi: '',
            },
            personal: {
                tipo: 'ninguno', // Valor inicial: ninguno
                km: ''
            }
        }
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estilos comunes
    const inputBorderClass = "mt-1 block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm";
    const hasResult = result !== null;

    // Campos de Consumos Directos (NO transporte)
    const formFields = [
        {
            key: 'consumo_energia',
            label: 'Consumo de Energía',
            icon: Zap,
            placeholder: 'Ej: 350',
            unit: 'kWh/mes', // CAMBIO DE UNIDAD A MENSUAL
            description: 'Consumo eléctrico mensual promedio.'
        },
        {
            key: 'consumo_agua',
            label: 'Consumo de Agua',
            icon: Droplets,
            placeholder: 'Ej: 15',
            unit: 'm³/mes', // CAMBIO DE UNIDAD A MENSUAL
            description: 'Metros cúbicos de agua consumidos por mes.'
        },
        {
            key: 'residuos',
            label: 'Residuos',
            icon: Trash2,
            placeholder: 'Ej: 8',
            unit: 'kg/semana',
            description: 'Kilogramos de residuos generados por semana.'
        }
    ];

    // Opciones de Transporte Público
    const publicTransportOptions = [
        { key: 'custer', label: 'Cúster' },
        { key: 'combi', label: 'Combi' },
        { key: 'bus', label: 'Bus' },
        { key: 'taxi', label: 'Taxi' },
    ];

    // Opciones de Transporte Personal
    const personalTransportOptions = [
        { key: 'ninguno', label: 'Ninguno' },
        { key: 'moto_mototaxi', label: 'Moto ' },
        { key: 'auto_db5', label: 'Auto (DB5)' },
        { key: 'auto_gasohol', label: 'Auto (Gasohol)' },
        { key: 'auto_glp', label: 'Auto (GLP)' },
        { key: 'auto_gnv', label: 'Auto (GNV)' },
    ];

    // Manejar cambios en Consumos Directos
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    // Manejar cambios en Transporte Público
    const handlePublicTransportChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            transporte_terrestre_data: {
                ...prev.transporte_terrestre_data,
                tipos_publicos: {
                    ...prev.transporte_terrestre_data.tipos_publicos,
                    [name]: value
                }
            }
        }));
        setError('');
    };

    // Manejar cambios en Transporte Personal
    const handlePersonalTransportChange = (e) => {
        const { name, value } = e.target;
        
        // Si cambia el tipo a 'ninguno', forzar km a 0
        const newKmValue = (name === 'tipo' && value === 'ninguno') ? '' : formData.transporte_terrestre_data.personal.km;

        setFormData(prev => ({
            ...prev,
            transporte_terrestre_data: {
                ...prev.transporte_terrestre_data,
                personal: {
                    ...prev.transporte_terrestre_data.personal,
                    [name]: value,
                    km: name === 'tipo' ? newKmValue : value // Ajustar el km si se cambia el tipo a 'ninguno'
                }
            }
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Función auxiliar para convertir a float (0 si es vacío o inválido)
            const getNumericValue = (value) => parseFloat(value) || 0;

            // Construir el payload con todos los valores numéricos
            const payload = {
                // Consumos directos
                consumo_energia: getNumericValue(formData.consumo_energia),
                consumo_agua: getNumericValue(formData.consumo_agua),
                residuos: getNumericValue(formData.residuos),
                
                // Objeto de Transporte Terrestre
                transporte_terrestre_data: {
                    tipos_publicos: Object.fromEntries(
                        Object.entries(formData.transporte_terrestre_data.tipos_publicos)
                            .map(([key, value]) => [key, getNumericValue(value)])
                    ),
                    personal: {
                        tipo: formData.transporte_terrestre_data.personal.tipo,
                        km: getNumericValue(formData.transporte_terrestre_data.personal.km)
                    }
                }
            };
            
            const response = await carbonAPI.calculate(payload);
            setResult(response.data.calculation);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.error || 'Error al calcular la huella de carbono. Por favor, revisa tus datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleNewCalculation = () => {
        setResult(null);
        setFormData({
            consumo_energia: '',
            consumo_agua: '',
            residuos: '',
            transporte_terrestre_data: {
                tipos_publicos: {
                    custer: '', combi: '', bus: '', taxi: '',
                },
                personal: {
                    tipo: 'ninguno',
                    km: ''
                }
            }
        });
    };

    // --- RENDERIZADO DEL RESULTADO ---
    if (hasResult) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full mx-auto space-y-8">
                    <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ¡Cálculo Completado!
                        </h1>
                        <p className="text-gray-600">
                            Resultados de tu huella de carbono anual
                        </p>
                    </div>

                    <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
                        {/* Indicador de Huella Total */}
                        <div
                            className="p-6 rounded-lg text-center shadow-lg mb-6"
                            style={{ backgroundColor: result.categoria.color + '10', borderColor: result.categoria.color, border: '1px solid' }}
                        >
                            <p className="text-lg font-medium text-gray-700">Tu Huella Total Anual es de:</p>
                            <p className="text-6xl font-extrabold mt-1" style={{ color: result.categoria.color }}>
                                {result.desglose.total.toLocaleString('es-PE')} kg
                            </p>
                            <p className="text-xl font-semibold mt-1 text-gray-800">
                                de CO2 equivalente
                            </p>
                            <span
                                className="inline-block mt-3 px-4 py-1 text-sm font-bold text-white rounded-full"
                                style={{ backgroundColor: result.categoria.color }}
                            >
                                Categoría: {result.categoria.categoria}
                            </span>
                        </div>

                        {/* Desglose */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Desglose por Categoría</h4>
                            <DesgloseItem label="Transporte Terrestre" value={result.desglose.transporte_terrestre} color="text-yellow-600" />
                            <DesgloseItem label="Consumo de Energía" value={result.desglose.consumo_energia} color="text-green-700" />
                            <DesgloseItem label="Consumo de Agua" value={result.desglose.consumo_agua} color="text-blue-600" />
                            <DesgloseItem label="Residuos" value={result.desglose.residuos} color="text-green-600" />
                            
                            <h5 className="text-base font-medium text-gray-800 mt-4 pt-4 border-t border-gray-300">Detalle de Transporte:</h5>
                            <DesgloseItem label="— Público" value={result.desglose.desglose_transporte.publico} color="text-yellow-600" />
                            <DesgloseItem label="— Personal" value={result.desglose.desglose_transporte.personal} color="text-yellow-600" />

                        </div>

                        {/* Recomendaciones */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="text-xl font-semibold text-green-900 flex items-center mb-3">
                                <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
                                Recomendaciones Personalizadas
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-green-800">
                                {result.recomendaciones.map((rec, index) => (
                                    <li key={index} className="text-sm">{rec}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <button
                                onClick={handleNewCalculation}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                            >
                                Nuevo Cálculo
                            </button>
                            <Link
                                to="/history"
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                            >
                                Ver Historial
                            </Link>
                            <Link
                                to="/education"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                            >
                                Aprender Más
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // --- RENDERIZADO DEL FORMULARIO ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center">
                    <Calculator className="h-16 w-16 text-green-600 mx-auto mb-4" /> 
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Calcular Huella de Carbono
                    </h1>
                    <p className="text-gray-600">
                        Ingresa tus datos de consumo para conocer tu impacto ambiental
                    </p>
                </div>

                {/* Contenedor del Formulario */}
                <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
                    
                    {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                        <XCircle className="h-5 w-5 mr-2" /> {error}
                    </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* --------------------------- SECCIÓN 1: CONSUMOS DIRECTOS --------------------------- */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Consumos Mensuales y Residuos</h3>
                    
                    {/* Card de Consumos y Residuos */}
                    <div className='border p-4 rounded-md bg-white shadow-sm'>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formFields.map(({ key, label, icon: Icon, placeholder, unit, description, type = 'number' }) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-sm font-medium text-gray-700 flex items-center">
                                <Icon className="h-4 w-4 mr-2 text-green-600" /> 
                                {label}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type={type}
                                    name={key}
                                    id={key}
                                    value={formData[key]}
                                    onChange={handleInputChange}
                                    placeholder={placeholder}
                                    className={inputBorderClass} 
                                    min="0"
                                    step="0.01"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">{unit}</span>
                                </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{description}</p>
                            </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* --------------------------- SECCIÓN 2: TRANSPORTE TERRESTRE --------------------------- */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pt-4 pb-2">Transporte Terrestre (km/mes)</h3> {/* CAMBIO DE UNIDAD */}

                    {/* Subsección: Transporte Público - Card */}
                    <div className='border p-4 rounded-md bg-white shadow-sm'>
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                            <Bus className="h-4 w-4 mr-2 text-green-600" /> 
                            Kilómetros en Transporte Público (Múltiples Opciones)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {publicTransportOptions.map(({ key, label }) => (
                            <div key={key}>
                                <label htmlFor={`pub_${key}`} className="block text-sm font-medium text-gray-700">
                                {label}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name={key}
                                    id={`pub_${key}`}
                                    value={formData.transporte_terrestre_data.tipos_publicos[key]}
                                    onChange={handlePublicTransportChange}
                                    placeholder="Ej: 400"
                                    className={inputBorderClass} 
                                    min="0"
                                    step="1"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">km/mes</span> {/* CAMBIO DE UNIDAD */}
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        <p className="mt-3 text-xs text-gray-600">
                            Puedes ingresar el kilometraje **mensual** recorrido en cada tipo de transporte público que uses.
                        </p>
                    </div>

                    {/* Subsección: Transporte Personal - Card */}
                    <div className='border p-4 rounded-md bg-white shadow-sm'>
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                            <Car className="h-4 w-4 mr-2 text-green-600" /> 
                            Kilómetros en Transporte Personal (Una Opción)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Selector de Tipo de Vehículo Personal */}
                            <div>
                                <label htmlFor="personal_tipo" className="block text-sm font-medium text-gray-700">
                                Tipo de Vehículo Propio
                                </label>
                                <select
                                id="personal_tipo"
                                name="tipo"
                                value={formData.transporte_terrestre_data.personal.tipo}
                                onChange={handlePersonalTransportChange}
                                className="mt-1 block w-full py-2.5 px-3 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                >
                                {personalTransportOptions.map(option => (
                                    <option key={option.key} value={option.key}>{option.label}</option>
                                ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500 flex items-center"><Fuel className="h-3 w-3 mr-1"/> Indica el tipo y combustible que usas.</p>
                            </div>

                            {/* Kilómetros de Vehículo Personal */}
                            <div>
                                <label htmlFor="personal_km" className="block text-sm font-medium text-gray-700">
                                Kilómetros Mensuales
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="km"
                                    id="personal_km"
                                    value={formData.transporte_terrestre_data.personal.km}
                                    onChange={handlePersonalTransportChange}
                                    placeholder="Ej: 850"
                                    className={inputBorderClass} 
                                    min="0"
                                    step="1"
                                    disabled={formData.transporte_terrestre_data.personal.tipo === 'ninguno'}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">km/mes</span> {/* CAMBIO DE UNIDAD */}
                                </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Ingresa el km **mensual** si usas vehículo propio.</p>
                            </div>
                        </div>
                    </div>

                    {/* --------------------------- BOTÓN DE CÁLCULO --------------------------- */}
                    <div className="pt-6 border-t border-gray-200">
                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white rounded-md py-2 px-4 transition duration-150"
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

                    {/* Información adicional del formulario */}
                    <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">💡 Consejos para un cálculo preciso:</h4>
                        <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                            <li>• Usa datos de facturas para energía y agua si es posible.</li>
                            <li>• Estima tu kilometraje **mensual** de transporte.</li>
                            <li>• Los campos vacíos se considerarán como 0 en el cálculo.</li>
                            <li>• Los factores de emisión están basados en el Informe de Inventario de GEI 2021 de ISA REP.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Asegúrate de importar 'CheckCircle' de 'lucide-react' para que el resultado funcione.
// También 'XCircle', 'BarChart2', 'Lightbulb', 'Fuel'