import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { Readable } from 'stream';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
  : undefined;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const reportDataStr = formData.get('reportData') as string;
    const reportData = JSON.parse(reportDataStr);

    let highResUrl = '';
    let lowResUrl = '';

    // 사진이 있을 때만 업로드 처리
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}_${file.name}`;

      // 1. 구글 드라이브 업로드 (실패해도 계속 진행)
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
      } catch (driveErr) {
        console.error('Google Drive Error (무시하고 계속):', driveErr);
      }

      // 2. Supabase Storage 업로드 (실패해도 계속 진행)
      try {
        const lowResBuffer = await sharp(buffer)
          .resize(1200, null, { withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        const { error: storageError } = await supabaseAdmin.storage
          .from('village-reports')
          .upload(`low_res/${fileName}`, lowResBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (!storageError) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('village-reports')
            .getPublicUrl(`low_res/${fileName}`);
          lowResUrl = publicUrl;
        } else {
          console.error('Supabase Storage Error (무시하고 계속):', storageError);
        }
      } catch (storageErr) {
        console.error('Storage Processing Error (무시하고 계속):', storageErr);
      }
    }

    // 3. DB에 제보 정보 저장 (사진 없어도 저장)
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('village_reports')
      .insert([{
        ...reportData,
        high_res_url: highResUrl || null,
        low_res_url: lowResUrl || null,
        status: 'new'
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data: dbData });

  } catch (error: any) {
    console.error('Processing Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
