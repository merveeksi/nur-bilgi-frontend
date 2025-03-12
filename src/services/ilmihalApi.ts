// services/ilmihalApi.ts (yeni bir dosya oluştur, mesela "services" klasöründe)

import { Ilmihal } from '@/app/ilmihal/ilmihalData' 
// Type hatası almamak için interface'leri import edebilir veya 
// bu dosyada da tanımlayabilirsin.

export async function fetchIlmihalList(): Promise<Ilmihal[]> {
  try {
    const response = await fetch('/api/ilmihal', {
      method: 'GET',
      // Gerekirse headers vs. ekle
    })
    if (!response.ok) {
      throw new Error('Liste alınırken bir hata oluştu.')
    }
    return response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function fetchIlmihalById(id: string): Promise<Ilmihal> {
  try {
    const response = await fetch(`/api/ilmihal/${id}`)
    if (!response.ok) {
      throw new Error('İlmihal bulunamadı veya hata oluştu')
    }
    return response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}