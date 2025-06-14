import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Appointment, Holiday, BlockedTime } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { notifyAppointmentCreated, notifyAppointmentCancelled } from '../services/whatsappService';
import { formatDateForSupabase, parseSupabaseDate, isSameDate, isDateBefore, isFutureDate } from '../utils/dateUtils';
import { format, startOfDay } from 'date-fns';

interface AdminSettings {
  early_booking_restriction: boolean;
  early_booking_hours: number;
  restricted_hours: string[];
}

interface AppointmentContextType {
  appointments: Appointment[];
  holidays: Holiday[];
  blockedTimes: BlockedTime[];
  adminSettings: AdminSettings;
  userPhone: string | null;
  setUserPhone: (phone: string) => void;
  deleteAppointment: (id: string) => Promise<void>;
  createAppointment: (appointmentData: CreateAppointmentData) => Promise<Appointment>;
  createHoliday: (holidayData: Omit<Holiday, 'id'>) => Promise<Holiday>;
  createBlockedTime: (blockedTimeData: Omit<BlockedTime, 'id'>) => Promise<BlockedTime>;
  removeHoliday: (id: string) => Promise<void>;
  removeBlockedTime: (id: string) => Promise<void>;
  isTimeSlotAvailable: (date: Date, time: string) => Promise<boolean>;
  getDayAvailability: (date: Date) => Promise<{ [hour: string]: boolean }>;
  getAvailableHoursForDate: (date: Date) => string[];
  formatHour12h: (hour24: string) => string;
  loadAdminSettings: () => Promise<void>;
  // Función para obtener solo citas futuras (para mostrar en admin)
  getFutureAppointments: () => Appointment[];
}

// Genera un rango de horas en formato HH:00
const generateHoursRange = (start: number, end: number) => {
  const hours: string[] = [];
  for (let h = start; h <= end; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return hours;
};

// HORARIOS ACTUALIZADOS:
// Domingo: 10:00 a 15:00
// Miércoles: 7:00 a 12:00 y 15:00 a 19:00 (cierra a las 7 PM)
// Resto: 7:00 a 12:00 y 15:00 a 21:00
const getAvailableHoursForDate = (date: Date): string[] => {
  const weekday = date.getDay();
  if (weekday === 0) {
    // Domingo: 10:00 AM a 3:00 PM
    return generateHoursRange(10, 15);
  } else if (weekday === 3) {
    // Miércoles: 7:00 AM a 12:00 PM y 3:00 PM a 7:00 PM
    return [
      ...generateHoursRange(7, 12),
      ...generateHoursRange(15, 19)
    ];
  } else {
    // Lunes, martes, jueves, viernes, sábado: 7:00 AM a 12:00 PM y 3:00 PM a 9:00 PM
    return [
      ...generateHoursRange(7, 12),
      ...generateHoursRange(15, 21)
    ];
  }
};

// Convierte "15:00" en "3:00 PM" para mostrar en UI
const formatHour12h = (hour24: string): string => {
  if (!hour24) return '';
  const [h, m] = hour24.split(':');
  let hour = parseInt(h, 10);
  const minute = m || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

// Función para verificar restricción de horarios con antelación
const isRestrictedHourWithAdvance = (date: Date, time: string, adminSettings: AdminSettings): boolean => {
  if (!adminSettings.early_booking_restriction) return false;
  
  // Verificar si el horario está en la lista de horarios restringidos
  if (!adminSettings.restricted_hours?.includes(time)) return false;
  
  const now = new Date();
  const appointmentDateTime = new Date(date);
  
  // Convertir tiempo de 12h a 24h para comparación
  let hour = 0;
  if (time.includes('AM')) {
    hour = parseInt(time.split(':')[0]);
    if (hour === 12) hour = 0;
  } else if (time.includes('PM')) {
    hour = parseInt(time.split(':')[0]);
    if (hour !== 12) hour += 12;
  }
  
  appointmentDateTime.setHours(hour, 0, 0, 0);
  
  const diffMs = appointmentDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours < adminSettings.early_booking_hours;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    early_booking_restriction: false,
    early_booking_hours: 12,
    restricted_hours: ['7:00 AM', '8:00 AM']
  });
  const [userPhone, setUserPhone] = useState<string | null>(() => localStorage.getItem('userPhone'));

  // Función para cargar configuración de admin
  const loadAdminSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setAdminSettings({
          early_booking_restriction: data.early_booking_restriction,
          early_booking_hours: data.early_booking_hours,
          restricted_hours: data.restricted_hours || ['7:00 AM', '8:00 AM']
        });
      }
    } catch (error) {
      console.error('Error loading admin settings:', error);
    }
  };

  // Función para obtener solo citas futuras (incluyendo hoy)
  const getFutureAppointments = useCallback((): Appointment[] => {
    const today = new Date();
    return appointments.filter(appointment => {
      // Incluir citas de hoy y futuras
      return isSameDate(appointment.date, today) || isFutureDate(appointment.date);
    });
  }, [appointments]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      const formattedAppointments = data.map(appointment => ({
        ...appointment,
        date: parseSupabaseDate(appointment.date)
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      toast.error('Error al cargar las citas');
    }
  };

  const fetchHolidays = async () => {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      const formattedHolidays = data.map(holiday => ({
        ...holiday,
        date: parseSupabaseDate(holiday.date)
      }));
      setHolidays(formattedHolidays);
    } catch (error) {
      toast.error('Error al cargar los feriados');
    }
  };

  const fetchBlockedTimes = async () => {
    try {
      const { data, error } = await supabase
        .from('blocked_times')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      const formattedBlockedTimes = data.map(blockedTime => ({
        ...blockedTime,
        date: parseSupabaseDate(blockedTime.date)
      }));
      setBlockedTimes(formattedBlockedTimes);
    } catch (error) {
      toast.error('Error al cargar los horarios bloqueados');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Primero cargar configuración de admin
      await loadAdminSettings();
      // Cargar todos los datos (ya no limpiamos citas pasadas)
      await Promise.all([
        fetchAppointments(),
        fetchHolidays(),
        fetchBlockedTimes()
      ]);
    };
    
    initializeData();
  }, []);

  const isTimeSlotAvailable = useCallback(async (date: Date, time: string): Promise<boolean> => {
    try {
      // Verificar restricción de horarios con antelación
      if (isRestrictedHourWithAdvance(date, time, adminSettings)) {
        return false;
      }

      const formattedDate = formatDateForSupabase(date);
      const [{ data: holidaysData }, { data: blockedData }, { data: appointmentsData }] = await Promise.all([
        supabase.from('holidays').select('id').eq('date', formattedDate),
        supabase.from('blocked_times').select('time,timeSlots').eq('date', formattedDate),
        supabase.from('appointments').select('id,time').eq('date', formattedDate).eq('time', time)
      ]);
      
      if (holidaysData && holidaysData.length > 0) return false;
      if (blockedData && blockedData.some(block =>
        (block.time && block.time === time) ||
        (block.timeSlots && Array.isArray(block.timeSlots) && block.timeSlots.includes(time))
      )) return false;
      if (appointmentsData && appointmentsData.length > 0) return false;
      return true;
    } catch (err) {
      return false;
    }
  }, [adminSettings]);

  const getDayAvailability = useCallback(async (date: Date) => {
    const formattedDate = formatDateForSupabase(date);
    const hours = getAvailableHoursForDate(date);
    if (hours.length === 0) return {};

    const [{ data: holidaysData }, { data: blockedData }, { data: appointmentsData }] = await Promise.all([
      supabase.from('holidays').select('id').eq('date', formattedDate),
      supabase.from('blocked_times').select('time,timeSlots').eq('date', formattedDate),
      supabase.from('appointments').select('time').eq('date', formattedDate),
    ]);

    const availability: { [hour: string]: boolean } = {};
    if (holidaysData && holidaysData.length > 0) {
      hours.forEach(h => { availability[h] = false; });
      return availability;
    }

    const blockedSlots = new Set<string>();
    if (blockedData) {
      for (const block of blockedData) {
        if (block.timeSlots && Array.isArray(block.timeSlots)) {
          block.timeSlots.forEach((slot: string) => blockedSlots.add(slot));
        }
        if (block.time) blockedSlots.add(block.time);
      }
    }

    const takenSlots = new Set<string>();
    if (appointmentsData) {
      for (const app of appointmentsData) {
        if (app.time) takenSlots.add(app.time);
      }
    }

    for (const hour of hours) {
      const isRestricted = isRestrictedHourWithAdvance(date, hour, adminSettings);
      availability[hour] = !(blockedSlots.has(hour) || takenSlots.has(hour) || isRestricted);
    }
    return availability;
  }, [adminSettings]);

  const createAppointment = async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    try {
      // Verificar restricción de horarios con antelación antes de crear
      if (isRestrictedHourWithAdvance(appointmentData.date, appointmentData.time, adminSettings)) {
        const restrictedHours = adminSettings.restricted_hours?.join(', ') || 'ciertos horarios';
        throw new Error(`Los horarios ${restrictedHours} requieren reserva con ${adminSettings.early_booking_hours} horas de antelación`);
      }

      const formattedDate = formatDateForSupabase(appointmentData.date);
      const { data: newAppointment, error } = await supabase
        .from('appointments')
        .insert([{ ...appointmentData, date: formattedDate }])
        .select()
        .single();
      if (error) throw new Error('Error al crear la cita en la base de datos');
      
      try {
        // Enviar notificaciones por WhatsApp Web
        await notifyAppointmentCreated({
          clientPhone: appointmentData.clientPhone,
          clientName: appointmentData.clientName,
          date: format(appointmentData.date, 'dd/MM/yyyy'),
          time: appointmentData.time,
          service: appointmentData.service
        });
      } catch (whatsappError) {
        console.error('Error enviando WhatsApp:', whatsappError);
        // No fallar la creación de cita si WhatsApp falla
      }

      const parsedAppointment = {
        ...newAppointment,
        date: parseSupabaseDate(newAppointment.date)
      };
      setAppointments(prev => [...prev, parsedAppointment]);
      toast.success('Cita creada exitosamente');
      return parsedAppointment;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear la cita');
      throw error;
    }
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    try {
      const appointmentToDelete = appointments.find(app => app.id === id);
      if (!appointmentToDelete) return;
      
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      
      setAppointments(prev => prev.filter(app => app.id !== id));
      
      try {
        // Enviar notificaciones de cancelación por WhatsApp Web
        await notifyAppointmentCancelled({
          clientPhone: appointmentToDelete.clientPhone,
          clientName: appointmentToDelete.clientName,
          date: format(appointmentToDelete.date, 'dd/MM/yyyy'),
          time: appointmentToDelete.time,
          service: appointmentToDelete.service
        });
      } catch (whatsappError) {
        console.error('Error enviando WhatsApp de cancelación:', whatsappError);
      }

    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const createHoliday = async (holidayData: Omit<Holiday, 'id'>): Promise<Holiday> => {
    try {
      const formattedDate = formatDateForSupabase(holidayData.date);
      const { data: existingHolidays, error: checkError } = await supabase
        .from('holidays')
        .select('*')
        .eq('date', formattedDate);
      if (checkError) throw checkError;
      if (existingHolidays && existingHolidays.length > 0) throw new Error('Ya existe un feriado en esta fecha');
      const { data, error } = await supabase
        .from('holidays')
        .insert([{ ...holidayData, date: formattedDate }])
        .select()
        .single();
      if (error) throw error;
      const newHoliday = { ...data, date: parseSupabaseDate(data.date) };
      setHolidays(prev => [...prev, newHoliday]);
      return newHoliday;
    } catch (error) {
      throw error;
    }
  };

  const removeHoliday = async (id: string): Promise<void> => {
    try {
      const holidayToRemove = holidays.find(h => h.id === id);
      if (!holidayToRemove) return;
      const { error } = await supabase.from('holidays').delete().eq('id', id);
      if (error) throw error;
      setHolidays(prev => prev.filter(h => h.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const createBlockedTime = async (blockedTimeData: Omit<BlockedTime, 'id'>): Promise<BlockedTime> => {
    try {
      const formattedDate = formatDateForSupabase(blockedTimeData.date);
      const dataToInsert = {
        date: formattedDate,
        time: Array.isArray(blockedTimeData.timeSlots) ? blockedTimeData.timeSlots[0] : blockedTimeData.timeSlots,
        timeSlots: blockedTimeData.timeSlots,
        reason: blockedTimeData.reason || 'Horario bloqueado'
      };
      const { data, error } = await supabase
        .from('blocked_times')
        .insert([dataToInsert])
        .select()
        .single();
      if (error) throw error;
      const newBlockedTime = { ...data, date: parseSupabaseDate(data.date) };
      setBlockedTimes(prev => [...prev, newBlockedTime]);
      return newBlockedTime;
    } catch (error) {
      throw error;
    }
  };

  const removeBlockedTime = async (id: string): Promise<void> => {
    try {
      const blockedTimeToRemove = blockedTimes.find(bt => bt.id === id);
      if (!blockedTimeToRemove) return;
      const { error } = await supabase.from('blocked_times').delete().eq('id', id);
      if (error) throw error;
      setBlockedTimes(prev => prev.filter(bt => bt.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const handleSetUserPhone = (phone: string) => {
    setUserPhone(phone);
    localStorage.setItem('userPhone', phone);
  };

  const value = {
    appointments,
    holidays,
    blockedTimes,
    adminSettings,
    userPhone,
    setUserPhone: handleSetUserPhone,
    deleteAppointment,
    createAppointment,
    createHoliday,
    removeHoliday,
    createBlockedTime,
    removeBlockedTime,
    isTimeSlotAvailable,
    getDayAvailability,
    getAvailableHoursForDate,
    formatHour12h,
    loadAdminSettings,
    getFutureAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};