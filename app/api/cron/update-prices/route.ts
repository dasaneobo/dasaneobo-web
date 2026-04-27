import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const ITEMS = [
  { category: '100', code: '111', name: '쌀', unit: '20kg' }, // 쌀은 곡류(100), 품목 111 (보통 쌀 20kg)
  { category: '200', code: '211', name: '배추', unit: '1포기' }, // 채소류(200), 품목 211
  { category: '200', code: '214', name: '마늘', unit: '1kg' },
  { category: '100', code: '143', name: '고구마', unit: '1kg' },
  { category: '200', code: '245', name: '양파', unit: '1kg' },
  { category: '100', code: '141', name: '감자', unit: '1kg' },
];

/**
 * KAMIS API codes change occasionally. 
 * Based on user requested mapping (simplified):
 * 쌀 (100, 01) -> p_item_category_code=100, p_item_code=111 typically
 * we'll use a mapping that tries to match the user's intent.
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
  // Check auth for Cron (Vercel sets CRON_SECRET or check headers)
  // For simplicity here, we allow it, but in production check headers.
  
  const apiKey = process.env.KAMIS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'KAMIS_API_KEY missing' }, { status: 500 });
  }

  const today = new Date().toISOString().split('T')[0];
  const results: any[] = [];

  try {
    // We need to fetch for categories 100 and 200
    const categories = ['100', '200'];
    
    for (const cat of categories) {
      // 최신 KAMIS Open API 규격으로 엔드포인트 변경
      const url = `http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_cert_key=${apiKey}&p_cert_id=222&p_returntype=json&p_product_cls_code=02&p_item_category_code=${cat}&p_country_code=2100&p_regday=${today}&p_convert_kg_yn=N`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      // KAMIS API는 data 속성 안에 내부 data 속성 없이 바로 데이터 객체를 반환할 수 있으므로 구조 점검
      // JSON 구조: { condition: [...], data: { item: [...] } } 또는 data 자체가 에러이거나 배열
      if (data && data.data && data.data.item) {
        const items = Array.isArray(data.data.item) ? data.data.item : [data.data.item];
        
        // Filter for 광주 각화동 (Gwangju Gakhwa market often has name '각화' or '광주각화')
        // We'll filter items belonging to target list
        items.forEach((item: any) => {
          const target = TARGET_ITEMS.find(t => t.cat === cat && t.item === item.item_code);
          if (target) {
            
            const currentPriceStr = item.dpr1?.replace(/,/g, '') || '0'; // 당일 가격
            const prevPriceStr = item.dpr2?.replace(/,/g, '') || '0';    // 1일전 가격
            
            const currentPrice = currentPriceStr === '-' ? 0 : parseInt(currentPriceStr);
            const prevPrice = prevPriceStr === '-' ? 0 : parseInt(prevPriceStr);
            const diff = currentPrice > 0 && prevPrice > 0 ? currentPrice - prevPrice : 0;

            const newItem = {
              item_name: target.name,
              price: currentPrice.toString(),
              diff: diff.toString(),
              unit: target.unit,
              updated_at: new Date().toISOString()
            };
            
            // 중복 품목(상품/중품 등) 방지: 첫 번째 값(주로 상품)만 유지
            if (!results.find(r => r.item_name === target.name)) {
              results.push(newItem);
            }
          }
        });
      }
    }

    // Update Supabase
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
