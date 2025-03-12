import { NextResponse } from 'next/server'
import { ilmihalCollection } from '@/app/ilmihal/ilmihalData'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  // İlgili ID'ye sahip ilmihali bulma
  const ilmihal = ilmihalCollection.find(item => item.id === id)
  
  if (!ilmihal) {
    return NextResponse.json(
      { error: 'İlmihal bulunamadı' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(ilmihal)
} 