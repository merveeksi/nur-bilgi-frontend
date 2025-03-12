import { NextResponse } from 'next/server'
import { ilmihalCollection } from '@/app/ilmihal/ilmihalData' 

export async function GET() {
  // Tüm ilmihal verisini JSON olarak döndürüyoruz
  return NextResponse.json(ilmihalCollection)
}
