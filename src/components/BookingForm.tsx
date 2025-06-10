import React, { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { services } from '../utils/mockData';
import { useAppointments } from '../context/AppointmentContext';
import { Phone, MessageSquare, Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';
import { es } from 'date-fns/locale';

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onSuccess: () => void;
}

// Función para generar el enlace de WhatsApp
const getWhatsAppLink = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isIOS) {
    return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
  } else {
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
};

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  selectedTime,
  onSuccess
}) => {
  const { createAppointment } = useAppointments();
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    service: services[0]?.id || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ADMIN_PHONE = '+18092033894';

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const truncated = numbers.slice(0, 10);
    const matches = truncated.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!matches) return '';
    const formatted = matches.slice(1).filter(Boolean).join('-');
    const remaining = 12 - formatted.length;
    return formatted + '_'.repeat(Math.max(0, remaining));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      clientPhone: formatted
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'clientPhone') return;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre es obligatorio';
    }
    if (!formData.clientPhone.trim() || formData.clientPhone.includes('_')) {
      newErrors.clientPhone = 'El teléfono es obligatorio';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.clientPhone)) {
      newErrors.clientPhone = 'Formato: 555-123-4567';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const cleanPhone = formData.clientPhone.replace(/\D/g, '');
      await createAppointment({
        date: selectedDate,
        time: selectedTime,
        clientName: formData.clientName.trim(),
        clientPhone: cleanPhone,
        service: formData.service,
        confirmed: true
      });

      // Crear mensaje para WhatsApp
      const selectedService = services.find(s => s.id === formData.service);
      const adminMessage = `🔔 *NUEVA CITA REGISTRADA* 🔔

✂️ *D' Gastón Stylo Barbería*

👤 *Cliente:* ${formData.clientName.trim()}
📱 *Teléfono:* ${formData.clientPhone}
📅 *Fecha:* ${format(selectedDate, "dd/MM/yyyy", { locale: es })}
🕒 *Hora:* ${selectedTime}
💼 *Servicio:* ${selectedService?.name || 'Servicio seleccionado'}

¡Nueva cita confirmada en el sistema!`;

      // Abrir WhatsApp
      const whatsappLink = getWhatsAppLink(ADMIN_PHONE, adminMessage);
      window.location.href = whatsappLink;

      toast.success(
        <div>
          <p className="font-bold">¡Cita confirmada!</p>
          <p>Se enviará notificación al barbero por WhatsApp</p>
        </div>,
        { duration: 5000 }
      );
      
      onSuccess();
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      if (error.message === 'El horario seleccionado ya no está disponible') {
        toast.error('Este horario ya no está disponible. Por favor selecciona otro.');
      } else if (error.code === '23505') {
        toast.error('Ya existe una cita en este horario. Por favor selecciona otro.');
      } else {
        toast.error('Error al crear la cita. Por favor intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Detalles de la cita</h3>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarIcon className="w-5 h-5" />
          {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ClockIcon className="w-5 h-5" />
          {selectedTime}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecciona el servicio
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            >
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={`block w-full p-2 border ${
                errors.clientName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500`}
              placeholder="Juan Pérez"
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Teléfono
              </div>
            </label>
            <input
              type="text"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handlePhoneChange}
              className={`block w-full p-2 border ${
                errors.clientPhone ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500`}
              placeholder="000-000-0000"
            />
            {errors.clientPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.clientPhone}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-sm text-gray-600">
            Cuenta Popular: 0817630635 Sr Jose R Gaton Valera <br/>
            Cuenta BanReservas: 9605171140 Sr Jose R Gaton Valera
          </p>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg transition-colors text-white font-medium ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar cita'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;