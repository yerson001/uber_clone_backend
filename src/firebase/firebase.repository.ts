import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import { Message, MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseRepository {
  messaging: Messaging;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.messaging = firebaseApp.messaging();
  }

  sendMessage(notification: Message) {
    console.log('NOTIFICACION SIMULADA (sendMessage):', notification);
    return this.messaging.send(notification).then((response) => {
        console.log('✅ NOTIFICACION ENVIADA - Response:', response);
        return response;
    }).catch(e => {
        console.log('❌ ERROR ENVIANDO NOTIFICACION:', e);
        throw e;
    });
  }

  async sendMessageToMultipleDevices(payload: any) {
    console.log('🔔 INICIANDO ENVÍO MULTICAST...');
    console.log('📤 PAYLOAD RECIBIDO:', JSON.stringify(payload, null, 2));

    try {
      // Validar que hay tokens
      if (!payload.tokens || payload.tokens.length === 0) {
        throw new Error('No hay tokens para enviar');
      }

      console.log(`📱 Enviando a ${payload.tokens.length} dispositivos`);

      // ✅ ESTRUCTURA CORRECTA para sendEachForMulticast
      const multicastMessage: MulticastMessage = {
        tokens: payload.tokens,
        notification: {
          title: payload.notification?.title,
          body: payload.notification?.body,
        },
        data: payload.data || {},
        android: {
          priority: 'high',
          notification: {
            channelId: payload.android?.notification?.channelId || 'default_channel',
            priority: 'max',
            defaultSound: true,
            defaultLightSettings: true,
          },
        },
      };

      console.log('📋 MENSAJE FINAL PARA FIREBASE:', JSON.stringify(multicastMessage, null, 2));

      const response = await this.messaging.sendEachForMulticast(multicastMessage);
      
      console.log('📊 RESPUESTA COMPLETA:', JSON.stringify(response, null, 2));
      console.log(`✅ Enviados: ${response.successCount}/${response.responses.length}`);
      console.log(`❌ Fallidos: ${response.failureCount}`);

      // Mostrar detalles de fallos
      if (response.failureCount > 0) {
        console.log('💥 DETALLES DE FALLOS:');
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.log(`  Token ${idx}: ${resp.error?.message || 'Error desconocido'}`);
            console.log(`  Error code: ${resp.error?.code}`);
          }
        });
      }

      return response;
    } catch (error) {
      console.log('❌ ERROR EN sendMessageToMultipleDevices:', error);
      console.log('📍 Stack trace:', error.stack);
      throw error;
    }
  }

  // 🆕 MÉTODO ALTERNATIVO - Enviar uno por uno para debug
  async sendToEachDeviceIndividually(payload: any) {
    console.log('🔄 ENVIANDO INDIVIDUALMENTE PARA DEBUG...');
    
    const results = [];
    
    for (let i = 0; i < payload.tokens.length; i++) {
      const token = payload.tokens[i];
      console.log(`📱 Enviando ${i + 1}/${payload.tokens.length} - Token: ${token.substring(0, 20)}...`);
      
      try {
        const message: Message = {
          token: token,
          notification: {
            title: payload.notification?.title,
            body: payload.notification?.body,
          },
          data: payload.data || {},
          android: {
            priority: 'high',
            notification: {
              channelId: payload.android?.notification?.channelId || 'default_channel',
            },
          },
        };

        const response = await this.messaging.send(message);
        console.log(`✅ Token ${i + 1} enviado correctamente:`, response);
        results.push({ success: true, token, response });
      } catch (error) {
        console.log(`❌ Error en token ${i + 1}:`, error.message);
        results.push({ success: false, token, error: error.message });
      }
    }

    return results;
  }
}