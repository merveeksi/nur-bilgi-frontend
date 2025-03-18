import { NextResponse } from 'next/server';

// Bu değerleri elle güncelleyebilirsiniz (en son güncelleme: Temmuz 2023)
const CURRENT_PRICES = {
  gold: {
    name: "Gram Altın",
    price: "3.554,43" // TL/gram
  },
  silver: {
    name: "Gümüş",
    price: "40,17" // TL/gram
  },
  lastUpdated: "2025-03-18" // Son güncelleme tarihi
};

/**
 * Altın ve gümüş fiyatlarını döndüren API endpoint
 */
export async function GET() {
  try {
    // Sadece sabit değerleri döndür
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      lastUpdated: CURRENT_PRICES.lastUpdated,
      gold: CURRENT_PRICES.gold,
      silver: CURRENT_PRICES.silver
    });
  } catch (error) {
    console.error('Altın fiyatları işlenirken hata oluştu:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Altın fiyatları alınamadı.',
      error: error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
      timestamp: new Date().toISOString(),
      fallback: true,
      gold: {
        name: "Gram Altın (Varsayılan)",
        price: "2.450,00"
      },
      silver: {
        name: "Gümüş (Varsayılan)",
        price: "29,50"
      }
    }, { status: 500 });
  }
} 