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
        // 특수 파라미터(대괄호) 인코딩 문제를 방지하기 위해 수동 URL 구성
        const url = `${baseUrl}?serviceKey=${apiKey}&returnType=JSON&numOfRows=10&pageNo=1&cond[exmn_ymd::LTE]=${regDayCompact}&cond[exmn_ymd::GTE]=${regDayCompact}&cond[ctgry_cd::EQ]=${target.cat}&cond[item_cd::EQ]=${target.item}&cond[se_cd::EQ]=02`;

        const res = await fetch(url);
        const text = await res.text();
        
        if (dayOffset === 0 && target.item === '111') {
          (global as any).lastRawResponse = text.substring(0, 500);
        }

        if (!text.trim().startsWith('{')) continue;
        const data = JSON.parse(text);
        
        // 공공데이터포털은 보통 data.items 또는 data.response.body.items 구조
        const items = data.items || data.response?.body?.items?.item;
        if (items && Array.isArray(items) && items.length > 0) {
          const itemData = items[0];
          results.push({
            item_name: target.name,
            price: itemData.exmn_dd_prc?.replace(/,/g, '') || '0',
            diff: '0',
            unit: target.unit,
            updated_at: new Date().toISOString()
          });
        }
      }

      if (results.length > 0) break;
    }

      // 데이터를 하나라도 찾았다면 루프 중단 (최신일자 데이터 확보 완료)
      if (results.length > 0) break;
    }

    if (results.length > 0) {
      const { error } = await supabaseAdmin
        .from('farm_prices')
        .upsert(results, { onConflict: 'item_name' });
      
      if (error) throw error;
      return NextResponse.json({ success: true, count: results.length, data: results });
    } else {
      // 데이터가 없을 때 디버깅을 위해 마지막 시도 결과의 힌트를 제공
      return NextResponse.json({ 
        success: true, 
        count: 0, 
        message: "데이터를 찾지 못했습니다. API 키 활성화 대기 중이거나 해당 날짜에 데이터가 없을 수 있습니다.",
        tip: "공공데이터포털에서 '승인' 상태인지, 그리고 키를 입력한 지 1시간 이상 지났는지 확인해 주세요.",
        debug: {
          last_regday: results.length === 0 ? "3일치 모두 확인 실패" : "일부 확인",
          api_error: (global as any).lastApiError || "없음 (JSON 구조 확인 필요)",
          raw_response: (global as any).lastRawResponse || "응답 없음"
        }
      });
    }

  } catch (error: any) {
    console.error('Price Update Error:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
