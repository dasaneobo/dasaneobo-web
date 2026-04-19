import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for bypass RLS if needed for internal pipeline
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received Kakao Webhook:', body);

    const utterance = body.userRequest?.utterance;
    const userId = body.userRequest?.user?.id;

    if (!utterance) {
      return NextResponse.json({
        version: "2.0",
        template: {
          outputs: [{ simpleText: { text: "제보 내용을 인식하지 못했습니다." } }]
        }
      });
    }

    // Insert into Supabase 'drafts' table
    const { data, error } = await supabaseAdmin
      .from('drafts')
      .insert([
        {
          reporter_name: `KakaoUser_${userId?.substring(0, 5)}`,
          raw_content: utterance,
          status: 'pending'
        }
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    // Response to Kakao Bot
    return NextResponse.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: "제보가 성공적으로 접수되었습니다. 관리자 확인 후 기사화 검토 예정입니다. 감사합니다!"
            }
          }
        ]
      }
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({
      version: "2.0",
      template: {
        outputs: [{ simpleText: { text: "시스템 오류로 제보를 접수하지 못했습니다. 잠시 후 상의해주세요." } }]
      }
    }, { status: 500 });
  }
}
