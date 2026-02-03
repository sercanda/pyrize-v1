import { NextRequest, NextResponse } from 'next/server';

const TURKIYE_API_BASE = 'https://api.turkiyeapi.dev/v1';

/**
 * Türkiye API Proxy
 * Client-side CORS sorununu çözmek için API route üzerinden çağrı yapıyoruz
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // provinces, districts, neighborhoods
  const provinceId = searchParams.get('provinceId');
  const districtId = searchParams.get('districtId');

  try {
    let url = '';

    switch (type) {
      case 'provinces':
        url = `${TURKIYE_API_BASE}/provinces?fields=id,name,population,isMetropolitan`;
        break;
      case 'districts':
        if (!provinceId) {
          return NextResponse.json({ error: 'provinceId required' }, { status: 400 });
        }
        url = `${TURKIYE_API_BASE}/districts?provinceId=${provinceId}&fields=id,name,provinceId`;
        break;
      case 'neighborhoods':
        if (!districtId) {
          return NextResponse.json({ error: 'districtId required' }, { status: 400 });
        }
        url = `${TURKIYE_API_BASE}/neighborhoods?districtId=${districtId}&fields=id,name,districtId`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Türkiye API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ data: data.data || [] });

  } catch (error: any) {
    console.error('Lokasyon API hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Lokasyon verileri alınamadı' },
      { status: 500 }
    );
  }
}

