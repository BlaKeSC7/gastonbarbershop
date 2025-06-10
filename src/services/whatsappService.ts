interface WhatsAppMessageData {
  clientPhone: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
}

const ADMIN_PHONE = '+18092033894';

// Función para abrir WhatsApp directamente sin confirmación
export const openWhatsAppWithMessage = (phone: string, message: string) => {
  // Limpiar el número de teléfono
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Detectar el dispositivo
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  
  // URL de WhatsApp
  const whatsappURL = isMobile 
    ? `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
  
  if (isMobile) {
    // Para móviles - usar window.location.href que mantiene mejor el contexto
    window.location.href = whatsappURL;
  } else {
    // Para navegadores de escritorio
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
  }
};

export const notifyAppointmentCreated = (data: WhatsAppMessageData) => {
  const adminMessage = `🔔 *NUEVA CITA REGISTRADA* 🔔

✂️ *D' Gastón Stylo Barbería*

👤 *Cliente:* ${data.clientName}
📱 *Teléfono:* ${data.clientPhone}
📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

¡Nueva cita confirmada en el sistema!`;

  try {
    // Solo enviar mensaje al admin/dueño
    openWhatsAppWithMessage(ADMIN_PHONE, adminMessage);
    
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    throw error;
  }
};

export const notifyAppointmentCancelled = (data: WhatsAppMessageData) => {
  const adminMessage = `❌ *CITA CANCELADA* ❌

✂️ *D' Gastón Stylo Barbería*

👤 *Cliente:* ${data.clientName}
📱 *Teléfono:* ${data.clientPhone}
📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

⚠️ *El horario está ahora disponible para nuevas citas.*`;

  try {
    // Solo enviar mensaje al admin/dueño
    openWhatsAppWithMessage(ADMIN_PHONE, adminMessage);
    
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    throw error;
  }
};

// Función para notificar al cliente sobre su cita confirmada
export const notifyClientAppointmentConfirmed = (data: WhatsAppMessageData) => {
  const clientMessage = `✅ *CITA CONFIRMADA* ✅

✂️ *D' Gastón Stylo Barbería*

¡Hola ${data.clientName}! Tu cita ha sido confirmada:

📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

📍 *Dirección:* [Tu dirección aquí]

⏰ Te recomendamos llegar 5 minutos antes.

¡Nos vemos pronto! 💈`;

  try {
    openWhatsAppWithMessage(data.clientPhone, clientMessage);
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    throw error;
  }
};

// Función para notificar al cliente sobre cancelación
export const notifyClientAppointmentCancelled = (data: WhatsAppMessageData) => {
  const clientMessage = `❌ *CITA CANCELADA* ❌

✂️ *D' Gastón Stylo Barbería*

Hola ${data.clientName}, 

Tu cita programada para:
📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

Ha sido cancelada.

💬 Si deseas reagendar, no dudes en contactarnos.

¡Gracias por tu comprensión! 🙏`;

  try {
    openWhatsAppWithMessage(data.clientPhone, clientMessage);
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    throw error;
  }
};