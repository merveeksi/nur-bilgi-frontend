// /lib/db.ts
import { Pool } from 'pg';
import * as fs from 'fs';

// Ortam değişkenlerini manuel olarak yükle
function loadEnvVariables() {
  try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const envVars = envFile.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) {
          acc[key.trim()] = value.trim().replace(/^["'](.*)["']$/, '$1');
        }
        return acc;
      }, {} as Record<string, string>);
    
    // Eğer ortam değişkenleri yoksa manuel olarak ayarla
    if (!process.env.POSTGRES_USER) {
      process.env.POSTGRES_USER = envVars.POSTGRES_USER || 'postgres';
    }
    if (!process.env.POSTGRES_PASSWORD) {
      process.env.POSTGRES_PASSWORD = envVars.POSTGRES_PASSWORD || 'postgres';
    }
    if (!process.env.POSTGRES_HOST) {
      process.env.POSTGRES_HOST = envVars.POSTGRES_HOST || 'localhost';
    }
    if (!process.env.POSTGRES_DB) {
      process.env.POSTGRES_DB = envVars.POSTGRES_DB || 'NurBilgi';
    }
    if (!process.env.POSTGRES_PORT) {
      process.env.POSTGRES_PORT = envVars.POSTGRES_PORT || '5432';
    }

    console.log('Yüklenen ortam değişkenleri:', {
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      // Şifreyi gizli tutalım
      password: process.env.POSTGRES_PASSWORD ? '[SET]' : '[NOT SET]',
      port: process.env.POSTGRES_PORT
    });
  } catch (error) {
    console.error('.env dosyası okunurken hata:', error);
    // Hata olsa bile varsayılan değerleri kullanalım
  }
}

// Ortam değişkenlerini yükle
loadEnvVariables();

// Veritabanı havuzunu oluştur
export const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'NurBilgi',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Veritabanı havuzunun durumunu kontrol et
pool.on('error', (err) => {
  console.error('Beklenmeyen veritabanı hatası:', err);
});

// Varsayılan havuzu export et
export default pool;
