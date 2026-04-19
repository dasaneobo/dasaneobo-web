import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { Readable } from 'stream';

// Supabase Admin 설정
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Google Drive 설정
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
  : undefined;

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  privateKey,
  ['https://www.googleapis.com/auth/drive.file']
);
const drive = google.drive({ version: 'v3', auth });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const reportData = JSON.parse(formData.get('reportData') as string);

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;

    // 1. 고화질 원본 구글 드라이브 업로드
    let highResUrl = '';
    try {
      const driveResponse = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''],
        },
        media: {
          mimeType: file.type,
          body: Readable.from(buffer),
        },
        fields: 'id, webViewLink'
      });
      highResUrl = driveResponse.data.webViewLink || '';
      console.log('Google Drive Upload Success:', driveResponse.data.id);
    } catch (err) {
      console.error('Google Drive Error:', err);
    }

    // 2. Sharp를 사용한 저화질(웹용) 리사이징 (너비 1200px 제한)
    const lowResBuffer = await sharp(buffer)
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // 3. Supabase Storage 업로드 (저화질)
    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from('village-reports')
      .upload(`low_res/${fileName}`, lowResBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (storageError) throw storageError;

    const { data: { publicUrl: lowResUrl } } = supabaseAdmin.storage
      .from('village-reports')
      .getPublicUrl(`low_res/${fileName}`);

    // 4. DB에 제보 정보 저장
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('village_reports')
      .insert([
        {
          ...reportData,
          high_res_url: highResUrl,
          low_res_url: lowResUrl,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data: dbData });

  } catch (error: any) {
    console.error('Processing Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
