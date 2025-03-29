import { useEffect, useState, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Hub URL'sini merkezi bir yerden almak daha iyidir (örn. environment variable)
// Dikkat: Backend API adresiniz ve Hub yolunuz doğru olmalı!
const HUB_URL = 'http://localhost:5204/notificationhub'; // SignalR hub bağlantı adresi

// Hook'un döndüreceği değerler
interface SignalRHookResult {
    connection: signalR.HubConnection | null;
    connectionStatus: ConnectionStatus;
    error: any | null;
    startConnection: () => Promise<void>;
    stopConnection: () => Promise<void>;
    // İsteğe bağlı: Hub'a mesaj göndermek için bir fonksiyon
    // sendMessage: (methodName: string, ...args: any[]) => Promise<void>;
}

export const useSignalRConnection = (): SignalRHookResult => {
    // useRef ile connection nesnesini saklayalım ki gereksiz yeniden renderları tetiklemesin
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [error, setError] = useState<any | null>(null);

    // Bağlantıyı başlatan fonksiyon
    const startConnection = useCallback(async () => {
        if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
            console.log('SignalR Zaten bağlı.');
            return;
        }

        const getAccessToken = (): string | null => {
            
            if (typeof window !== 'undefined') { // Client-side olduğundan emin ol
               return localStorage.getItem('auth_token');
            }
            return null;
       };

        const token = getAccessToken();
        // Eğer Hub'ınız Authorize değilse token göndermenize gerek yok.
        // Eğer Authorize ise ve token yoksa bağlantı kurulamayabilir veya yetki hatası alınır.
        if (!token && /* Hub'ınız Authorize ise buraya ek kontrol ekleyebilirsiniz */ false) {
             console.error("SignalR bağlantısı için Authentication token bulunamadı.");
             setConnectionStatus('error');
             setError("Token eksik.");
             return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                // Eğer Hub'ınız Authorize ise token'ı burada gönderin
                 accessTokenFactory: () => token as string // Token null değilse gönder
                 // SkipNegotiation ve Transport type gibi opsiyonel ayarlar eklenebilir
                 // skipNegotiation: true,
                 // transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000]) // Otomatik tekrar bağlanma (ms cinsinden süreler)
            .configureLogging(signalR.LogLevel.Information) // Geliştirme için log seviyesi
            .build();

        connectionRef.current = newConnection;
        setConnectionStatus('connecting');
        setError(null);

        // Bağlantı kapandığında durumu güncelle
        newConnection.onclose(err => {
            console.error('SignalR Bağlantısı kapandı:', err);
            setConnectionStatus('disconnected');
            setError(err || new Error("Bağlantı beklenmedik şekilde kapandı."));
            // İsteğe bağlı: Tekrar bağlanmayı manuel tetikleyebilirsiniz
            // setTimeout(() => startConnection(), 5000);
        });

        // Bağlantı yeniden kurulmaya çalışıldığında
         newConnection.onreconnecting(error => {
             console.warn(`SignalR Bağlantısı tekrar kurulmaya çalışılıyor: ${error}`);
             setConnectionStatus('connecting');
         });

         // Bağlantı başarıyla yeniden kurulduğunda
         newConnection.onreconnected(connectionId => {
             console.log(`SignalR Bağlantısı başarıyla tekrar kuruldu. Yeni ID: ${connectionId}`);
             setConnectionStatus('connected');
         });


        try {
            await newConnection.start();
            console.log('SignalR Bağlantısı kuruldu.');
            setConnectionStatus('connected');
        } catch (err) {
            console.error('SignalR Bağlantı hatası:', err);
            setConnectionStatus('error');
            setError(err);
            connectionRef.current = null; // Başarısız bağlantıyı temizle
        }
    }, [HUB_URL]); // useCallback bağımlılığı

    // Bağlantıyı durduran fonksiyon
    const stopConnection = useCallback(async () => {
        if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
            try {
                await connectionRef.current.stop();
                console.log('SignalR Bağlantısı durduruldu.');
                setConnectionStatus('disconnected');
            } catch (err) {
                console.error('SignalR Durdurma hatası:', err);
                setConnectionStatus('error'); // veya 'disconnected' kalabilir
                setError(err);
            } finally {
                 connectionRef.current = null; // Bağlantı nesnesini temizle
            }
        }
    }, []);


    // Hook'u kullanan bileşen unmount olduğunda bağlantıyı durdur
    useEffect(() => {
        // Component mount olduğunda bağlantıyı başlatmayı tercih ederseniz:
        // startConnection();

        // Cleanup fonksiyonu: Component unmount olduğunda çalışır
        return () => {
            stopConnection();
        };
    }, [stopConnection /* , startConnection */]); // Bağımlılıklar

    // İsteğe bağlı: Hub'a mesaj gönderme fonksiyonu
    // const sendMessage = useCallback(async (methodName: string, ...args: any[]) => {
    //     if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
    //         try {
    //             await connectionRef.current.invoke(methodName, ...args);
    //         } catch (err) {
    //             console.error(`SignalR '${methodName}' çağrılırken hata:`, err);
    //             // Hata yönetimi eklenebilir
    //         }
    //     } else {
    //         console.warn('SignalR Bağlı değil. Mesaj gönderilemedi.');
    //         // Hata yönetimi veya mesajı kuyruğa alma eklenebilir
    //     }
    // }, []);

    return {
        connection: connectionRef.current, // Mevcut bağlantı nesnesi (olay dinleyicileri eklemek için)
        connectionStatus,
        error,
        startConnection, // Bağlantıyı manuel başlatmak için
        stopConnection, // Bağlantıyı manuel durdurmak için
        // sendMessage // Mesaj gönderme fonksiyonu
    };
};