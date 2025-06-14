import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  specificIssue: string;
  customDescription: string;
  budget: string;
}

const QuotePage: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    specificIssue: '',
    customDescription: '',
    budget: ''
  });
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Buscar si el cliente ya existe
      const { data: existingCustomer, error: searchError } = await supabase
        .from('customers')
        .select('id, name, email, phone, quotes(id, requirements, status, budget, use_case, created_at)')
        .eq('name', form.name.trim())
        .eq('email', form.email.trim().toLowerCase())
        .eq('phone', form.phone.trim())
        .maybeSingle();

      let customerId;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Si no existe, lo crea
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert([{
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim()
          }])
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Luego, crea la cotización
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert([{
          customer_id: customerId,
          requirements: `${form.serviceType} - ${form.specificIssue}\n\n${form.customDescription}`,
          budget: parseFloat(form.budget.replace(/[^0-9.]/g, '')),
          use_case: form.serviceType,
          status: 'pending'
        }]);

      if (quoteError) throw quoteError;

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar la cotización. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">¡Cotización enviada!</h2>
          <p className="text-gray-600">Nos pondremos en contacto contigo pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Solicitar Cotización
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                Tipo de Servicio
              </label>
              <select
                id="serviceType"
                name="serviceType"
                required
                value={form.serviceType}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value="consultoria">Consultoría</option>
                <option value="desarrollo">Desarrollo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="specificIssue" className="block text-sm font-medium text-gray-700">
                Asunto Específico
              </label>
              <input
                id="specificIssue"
                name="specificIssue"
                type="text"
                required
                value={form.specificIssue}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="customDescription" className="block text-sm font-medium text-gray-700">
                Descripción Detallada
              </label>
              <textarea
                id="customDescription"
                name="customDescription"
                required
                value={form.customDescription}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Presupuesto Estimado
              </label>
              <input
                id="budget"
                name="budget"
                type="text"
                value={form.budget}
                onChange={handleChange}
                placeholder="$"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Enviando...' : 'Enviar Cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotePage;