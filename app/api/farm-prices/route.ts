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
    // 최근 3일간의 데이터를 확인 (오늘 데이터가 아직 안 올라왔을 경우 대비)
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - dayOffset);
      const regDay = targetDate.toISOString().split('T')[0];
      
      const categories = ['100', '200'];
      
      for (const target of TARGET_ITEMS) {
      // 사용자의 스크린샷에 표시된 엔드포인트(B552845) 적용
      // 이중 인코딩 방지를 위해 수동으로 URL 구성
      const baseUrl = 'https://apis.data.go.kr/B552845/perDay/price';
      const url = `${baseUrl}?serviceKey=${apiKey}&p_cert_key=111&p_cert_id=222&p_startday=${regDay}&p_endday=${regDay}&p_itemcategorycode=${target.cat}&p_itemcode=${target.item}&p_kindcode=&p_productclscode=02&p_convert_kg_yn=N&p_returntype=json`;

      const res = await fetch(url);
      const text = await res.text();
      
      if (dayOffset === 0 && target.item === '111') {
        (global as any).lastRawResponse = text.substring(0, 500);
      }

      if (!text.trim().startsWith('{')) continue;
      const data = JSON.parse(text);
      
      const items = data.response?.body?.items?.item;
      if (items) {
        const itemArray = Array.isArray(items) ? items : [items];
        // 평균 가격 데이터 찾기
        const avgData = itemArray.find((item: any) => item.countyname === '평균' || item.countyname === '서울');
        
        if (avgData) {
          results.push({
            item_name: target.name,
            price: avgData.price?.replace(/,/g, '') || '0',
            diff: avgData.direction === '1' ? avgData.value : avgData.direction === '2' ? `-${avgData.value}` : '0',
            unit: target.unit,
            updated_at: new Date().toISOString()
          });
        }
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
