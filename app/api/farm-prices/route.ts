import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * KAMIS API codes mapping
 */
const TARGET_ITEMS = [
  { cat: '100', item: '111', name: '쌀', unit: '20kg' },
  { cat: '200', item: '211', name: '배추', unit: '1포기' },
  { cat: '200', item: '258', name: '마늘', unit: '1kg' },
  { cat: '100', item: '143', name: '고구마', unit: '1kg' },
  { cat: '200', item: '245', name: '양파', unit: '1kg' },
  { cat: '100', item: '141', name: '감자', unit: '1kg' },
];

export async function GET(req: Request) {
  const apiKey = process.env.KAMIS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KAMIS_API_KEY missing' }, { status: 500 });
  }

  const today = new Date().toISOString().split('T')[0];
  const results: any[] = [];

  try {
    const categories = ['100', '200'];
    // 공공데이터포털 인증키는 이미 인코딩되어 있는 경우가 많으므로 중복 인코딩 방지를 위해 디코딩 후 사용
    const decodedKey = decodeURIComponent(apiKey);
    
    for (const cat of categories) {
      // 공공데이터포털 최신 오퍼레이션 주소
      const baseUrl = 'http://apis.data.go.kr/B552895/openapi/service/priceSvc/getDailyPriceByCategoryList';
      const params = new URLSearchParams({
        serviceKey: decodedKey, // 인증키
        p_product_cls_code: '02', // 소매 가격
        p_item_category_code: cat,
        p_country_code: '2100', // 서울 (전국 기준)
        p_regday: today,
        p_convert_kg_yn: 'N',
        p_returntype: 'json'
      });

      const res = await fetch(`${baseUrl}?${params.toString()}`);
      const text = await res.text(); // 먼저 텍스트로 받아서 확인

      if (!text.trim().startsWith('{')) {
        console.error(`API Response Error (${cat}):`, text);
        continue; // JSON이 아니면 스킵
      }

      const data = JSON.parse(text);
      
      if (data.response?.body?.items?.item) {
        const items = Array.isArray(data.response.body.items.item) 
          ? data.response.body.items.item 
          : [data.response.body.items.item];
        
        items.forEach((item: any) => {
          const target = TARGET_ITEMS.find(t => t.cat === cat && t.item === item.item_code);
          // '전국평균' 혹은 '서울' 데이터 우선 추출
          if (target && (item.county_name === '평균' || item.county_name === '서울')) {
            results.push({
              item_name: target.name,
              price: item.dpr1?.replace(/,/g, '') || '0',
              diff: item.dpr2?.replace(/,/g, '') || '0',
              unit: target.unit,
              updated_at: new Date().toISOString()
            });
          }
        });
      }
    }

    if (results.length > 0) {
      const { error } = await supabaseAdmin
        .from('farm_prices')
        .upsert(results, { onConflict: 'item_name' });
      
      if (error) throw error;
    }

    return NextResponse.json({ success: true, count: results.length, data: results });

  } catch (error: any) {
    console.error('Price Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
