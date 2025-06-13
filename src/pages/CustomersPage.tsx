import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, User, Clock, CheckCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';

const STATUS_VALID = ['pending', 'quoted', 'completed', 'finalizada', 'pendiente', 'en proceso'];

interface Quote {
  id: string;
  requirements: string;
  status: string;
  budget?: number;
  use_case?: string;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  quotes: Quote[];
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pendingSearch, setPendingSearch] = useState('');

  // Solo busca cuando el usuario presiona el botón o Enter
  const handleSearch = async () => {
    setLoading(true);
    setCustomers([]);
    try {
      // 1. Buscar clientes por nombre
      const { data: customerList, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .ilike('name', `%${pendingSearch}%`);

      if (customerError || !customerList || customerList.length === 0) {
        setCustomers([]);
        setLoading(false);
        return;
      }

      // 2. Buscar cotizaciones de todos los clientes encontrados
      const customersWithQuotes = await Promise.all(
        customerList.map(async (customer) => {
          const { data: quotes, error: quotesError } = await supabase
            .from('quotes')
            .select('*')
            .eq('customer_id', customer.id);

          return {
            ...customer,
            quotes: quotes || [],
          };
        })
      );

      setCustomers(customersWithQuotes);
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Permite buscar con Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearch(pendingSearch);
      handleSearch();
    }
  };

  // Botón de búsqueda
  const handleButtonClick = () => {
    setSearch(pendingSearch);
    handleSearch();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
      case 'pendiente':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'quoted':
      case 'en proceso':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'completed':
      case 'finalizada':
        return 'text-green-700 bg-green-100 border-green-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'quoted':
      case 'en proceso':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
      case 'finalizada':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'quoted':
        return 'Cotizada';
      case 'completed':
        return 'Completada';
      case 'pendiente':
        return 'Pendiente';
      case 'en proceso':
        return 'En Proceso';
      case 'finalizada':
        return 'Finalizada';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg font-semibold text-blue-700">Cargando...</span>
      </div>
    );
  }

  const safeCustomers = customers.map(c => ({
    ...c,
    quotes: Array.isArray(c.quotes) ? c.quotes : [],
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consulta de Cotizaciones
          </h1>
          <p className="text-gray-600">
            Busca tu nombre para ver el estado de tus cotizaciones
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative flex gap-2">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Escribe tu nombre para buscar tus cotizaciones..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={pendingSearch}
              onChange={e => setPendingSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={handleButtonClick}
              disabled={loading || pendingSearch.trim().length === 0}
            >
              Buscar
            </button>
          </div>
          {search.trim().length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              {customers.length > 0
                ? `Se encontraron ${customers.length} cliente(s)`
                : 'No se encontraron clientes con ese nombre'}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg font-semibold text-blue-700">Cargando...</span>
          </div>
        )}

        {search.trim().length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Busca tus cotizaciones
            </h3>
            <p className="text-gray-600">
              Ingresa tu nombre en la barra de búsqueda para ver tus cotizaciones y su estado actual
            </p>
          </div>
        )}

        {search.trim().length > 0 && customers.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600">
              No hay clientes registrados con el nombre "{search}" que tengan cotizaciones activas.
            </p>
          </div>
        )}

        {safeCustomers.length > 0 && (
          <div className="space-y-6">
            {safeCustomers.map(customer => (
              <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {customer.name}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📧 {customer.email}</p>
                        {customer.phone && <p>📱 {customer.phone}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {customer.quotes.length} cotización(es)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Cotizaciones:</h4>
                  <div className="space-y-4">
                    {customer.quotes.map((quote, index) => (
                      <div 
                        key={quote.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Cotización #{index + 1}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-2">{quote.requirements}</p>
                            {quote.use_case && (
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Uso:</strong> {quote.use_case}
                              </p>
                            )}
                            {quote.status && (
                              <div className="mb-2">
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                                  {getStatusIcon(quote.status)}
                                  {getStatusText(quote.status)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(quote.created_at)}
                          </div>
                          {quote.budget && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${quote.budget.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
