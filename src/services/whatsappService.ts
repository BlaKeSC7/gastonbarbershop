interface WhatsAppMessageData {
 clientPhone: string;
 clientName: string;
 date: string;
 time: string;
 service: string;
}

const ADMIN_PHONE = '+18092033894';

// Función para abrir WhatsApp con mensaje pre-escrito (compatible con iOS)
export const openWhatsAppWithMessage = (phone: string, message: string) => {
 // Limpiar el número de teléfono
 const cleanPhone = phone.replace(/\D/g, '');
 
 // Codificar el mensaje para URL
 const encodedMessage = encodeURIComponent(message);
 
 // Detectar el dispositivo
 const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
 const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
 
 if (isIOS) {
   // Para iOS usa el protocolo whatsapp://
   window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
 } else if (isMobile) {
   // Para Android móvil
   window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
 } else {
   // Para navegadores de escritorio (WhatsApp Web)
   window.open(`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`, '_blank');
 }
};

export const notifyAppointmentCreated = async (data: WhatsAppMessageData) => {
 const adminMessage = `🔔 *NUEVA CITA REGISTRADA* 🔔

✂️ *D' Gastón Stylo Barber Shop* ✂️

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

export const notifyAppointmentCancelled = async (data: WhatsAppMessageData) => {
 const adminMessage = `❌ *CITA CANCELADA* ❌

✂️ *D' Gastón Stylo Barber Shop* ✂️

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