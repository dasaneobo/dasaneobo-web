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

  try {
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - dayOffset);
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const regDayCompact = `${year}${month}${day}`;
      
      for (const target of TARGET_ITEMS) {
        if (results.find(r => r.item_name === target.name)) continue;

        const baseUrl = 'https://apis.data.go.kr/B552845/perDay/price';
        const url = `${baseUrl}?serviceKey=${apiKey}&returnType=JSON&numOfRows=10&pageNo=1&cond[exmn_ymd::LTE]=${regDayCompact}&cond[exmn_ymd::GTE]=${regDayCompact}&cond[ctgry_cd::EQ]=${target.cat}&cond[item_cd::EQ]=${target.item}&cond[se_cd::EQ]=02`;

        const res = await fetch(url);
        const text = await res.text();
        
        if (!text.trim().startsWith('{')) continue;
        const data = JSON.parse(text);
        const items = data.items || data.response?.body?.items?.item;
        if (items && Array.isArray(items) && items.length > 0) {
          const itemData = items[0];
          
          const rawPrice = parseFloat(itemData.exmn_dd_prc?.replace(/,/g, '') || '0');
          const unitSize = parseFloat(itemData.unit_sz || '1');
          
          // 1단위당 가격 계산 (예: 40kg 40만원 -> 1kg 1만원)
          const normalizedPrice = unitSize > 0 ? Math.round(rawPrice / unitSize) : rawPrice;
          const displayUnit = `1${itemData.unit || 'kg'}`;
          
          results.push({
            item_name: target.name,
            price: normalizedPrice.toString(),
            diff: '0',
            unit: displayUnit,
            updated_at: new Date().toISOString()
          });
        }
      }

      if (results.length > 0) break;
    }

    if (results.length > 0) {
      const { error } = await supabaseAdmin
        .from('farm_prices')
        .upsert(results, { onConflict: 'item_name' });
      
      if (error) throw error;
      return NextResponse.json({ success: true, count: results.length, data: results });
    } else {
      return NextResponse.json({ success: true, count: 0, message: "최근 데이터가 없습니다." });
    }

  } catch (error: any) {
    console.error('Price Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
