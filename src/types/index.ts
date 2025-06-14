export interface TimeSlot {
  time: string;
  available: boolean;
  isBusinessHour: boolean;
}

export interface CreateAppointmentData {
  date: Date;
  time: string;
  clientName: string;
  clientPhone: string;
  service: string;
  confirmed: boolean;
}

export interface Appointment extends CreateAppointmentData {
  id: string;
  created_at: string;
}

export interface Holiday {
  id: string;
  date: Date;
  description: string;
}

export interface BlockedTime {
  id: string;
  date: Date;
  time: string;    // Make sure this exists
  timeSlots: string;
  reason: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface BusinessHours {
  [key: string]: {
    morning?: { start: string; end: string };
    afternoon?: { start: string; end: string };
  };
}

export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface TwilioError {
  status: number;
  message: string;
  code: string;
  moreInfo: string;
}

export interface TwilioResponse {
  sid: string;
  status: string;
  message: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface TwilioMessageData {
  clientPhone: string; // Formato esperado: "whatsapp:+1234567890"
  body: string;

export interface Cita {
  id: number;
  nombre: string;
  telefono: string;
  fecha: string; // Formato ISO (ej: "2025-06-10")
  hora: string;  // Ej: "14:00"
  servicio: string;


}