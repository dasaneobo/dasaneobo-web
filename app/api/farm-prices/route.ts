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
    // 최근 3일간의 데이터를 확인
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) { // 범위를 5일로 확대 (휴무일 대비)
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - dayOffset);
      
      // 날짜 형식을 YYYY-MM-DD에서 YYYYMMDD로 변경 (하이픈 제거)
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const regDay = `${year}-${month}-${day}`; // 일단 기존 유지하되 아래서 변환 시도
      const regDayCompact = `${year}${month}${day}`;
      
      for (const target of TARGET_ITEMS) {
        const clsCodes = ['02', '01'];
        const dateFormats = [regDay, regDayCompact];
        
        let foundForTarget = false;
        for (const clsCode of clsCodes) {
          if (foundForTarget) break;
          for (const dFormat of dateFormats) {
            // 사장님 스크린샷의 End Point 주소와 파라미터 규격(perDay)에 맞춤
            const baseUrl = 'https://apis.data.go.kr/B552845/perDay/price';
            const url = `${baseUrl}?serviceKey=${apiKey}&p_regday=${dFormat}&p_itemcategorycode=${target.cat}&p_itemcode=${target.item}&p_kindcode=01&p_productclscode=${clsCode}&p_convert_kg_yn=N&p_returntype=json`;

            const res = await fetch(url);
            const text = await res.text();
            
            if (dayOffset === 0 && target.item === '111') {
              (global as any).lastRawResponse = text.substring(0, 500);
            }

            if (!text.trim().startsWith('{')) continue;
            const data = JSON.parse(text);
            
            const items = data.response?.body?.items?.item;
            if (items && (Array.isArray(items) ? items.length > 0 : items)) {
              const itemArray = Array.isArray(items) ? items : [items];
              const avgData = itemArray.find((item: any) => item.countyname === '평균' || item.countyname === '서울') || itemArray[0];
              
              if (avgData && !results.find(r => r.item_name === target.name)) {
                results.push({
                  item_name: target.name,
                  price: avgData.price?.replace(/,/g, '') || '0',
                  diff: avgData.direction === '1' ? avgData.value : avgData.direction === '2' ? `-${avgData.value}` : '0',
                  unit: target.unit,
                  updated_at: new Date().toISOString()
                });
                foundForTarget = true;
                break;
              }
            }
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
