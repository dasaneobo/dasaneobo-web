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

  const results: any[] = [];
  const decodedKey = decodeURIComponent(apiKey);

  try {
    // 최근 3일간의 데이터를 확인 (오늘 데이터가 아직 안 올라왔을 경우 대비)
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - dayOffset);
      const regDay = targetDate.toISOString().split('T')[0];
      
      const categories = ['100', '200'];
      
      for (const cat of categories) {
        const baseUrl = 'http://apis.data.go.kr/B552895/openapi/service/priceSvc/getDailyPriceByCategoryList';
        const params = new URLSearchParams({
          serviceKey: decodedKey,
          p_product_cls_code: '02',
          p_item_category_code: cat,
          p_country_code: '', // 전체 지역 조회
          p_regday: regDay,
          p_convert_kg_yn: 'N',
          p_returntype: 'json'
        });

        const res = await fetch(`${baseUrl}?${params.toString()}`);
        const text = await res.text();

        if (!text.trim().startsWith('{')) continue;

        const data = JSON.parse(text);
        const items = data.response?.body?.items?.item;
        
        if (items) {
          const itemArray = Array.isArray(items) ? items : [items];
          
          itemArray.forEach((item: any) => {
            const target = TARGET_ITEMS.find(t => t.cat === cat && t.item === item.item_code);
            // 이미 추가된 품목이 아니고, 전국평균 혹은 서울 데이터인 경우
            if (target && !results.find(r => r.item_name === target.name)) {
              if (item.county_name === '평균' || item.county_name?.includes('서울') || item.county_name?.includes('광주')) {
                results.push({
                  item_name: target.name,
                  price: item.dpr1?.replace(/,/g, '') || '0',
                  diff: item.dpr2?.replace(/,/g, '') || '0',
                  unit: target.unit,
                  updated_at: new Date().toISOString()
                });
              }
            }
          });
        }
      }

      // 데이터를 하나라도 찾았다면 루프 중단 (최신일자 데이터 확보 완료)
      if (results.length > 0) break;
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
