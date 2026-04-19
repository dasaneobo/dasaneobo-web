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
    
    for (const cat of categories) {
      const url = `https://apis.data.go.kr/B552895/openapi/service/priceSvc/getDailyPriceByCategoryList?serviceKey=${apiKey}&p_cert_key=111&p_cert_id=222&p_returntype=json&p_product_cls_code=02&p_item_category_code=${cat}&p_country_code=2100&p_regday=${today}&p_convert_kg_yn=N`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.data && data.data.item) {
        const items = Array.isArray(data.data.item) ? data.data.item : [data.data.item];
        
        items.forEach((item: any) => {
          const target = TARGET_ITEMS.find(t => t.cat === cat && t.item === item.item_code);
          if (target && (item.county_name?.includes('광주') || item.market_name?.includes('각화'))) {
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
