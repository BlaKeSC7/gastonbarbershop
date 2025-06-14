// components/WhatsAppQR.tsx
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import whatsappService from '../services/whatsappService';

const WhatsAppQR = () => {
  const [qrCode, setQrCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Configurar callback para recibir QR
    whatsappService.onQRReceived = async (qr) => {
      try {
        const qrDataUrl = await QRCode.toDataURL(qr);
        setQrCode(qrDataUrl);
        setIsConnected(false);
      } catch (error) {
        console.error('Error generando QR:', error);
      }
    };

    // Verificar estado cada 5 segundos
    const checkStatus = setInterval(() => {
      const status = whatsappService.getStatus();
      setIsConnected(status.isReady);
      if (status.isReady) {
        setQrCode(''); // Limpiar QR cuando esté conectado
      }
    }, 5000);

    return () => {
      clearInterval(checkStatus);
    };
  }, []);

  if (isConnected) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        ✅ WhatsApp conectado correctamente
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        🔄 Iniciando WhatsApp...
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
      <p className="mb-2">📱 Escanea este código QR con WhatsApp:</p>
      <img src={qrCode} alt="WhatsApp QR Code" className="mx-auto" />
      <p className="text-sm mt-2">Abre WhatsApp > Menú > Dispositivos vinculados > Vincular dispositivo</p>
    </div>
  );
};

export default WhatsAppQR;