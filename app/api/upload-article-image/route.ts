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
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;

    // 1️⃣ Google Drive 업로드 (고해상도 원본)
    let highResUrl = '';
    try {
      const driveResponse = await drive.files.create({
        requestBody: { name: fileName, parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''] },
        media: { mimeType: file.type, body: Readable.from(buffer) },
        fields: 'id, webViewLink',
      });
      highResUrl = driveResponse.data.webViewLink || '';
    } catch (driveErr) {
      console.error('Google Drive Error (ignored):', driveErr);
    }

    // 2️⃣ Supabase Storage (저해상도 압축) 업로드
    let lowResUrl = '';
    try {
      // 1200px 리사이즈 및 품질 80 압축
      const lowResBuffer = await sharp(buffer).resize(1200, null, { withoutEnlargement: true })
        .jpeg({ quality: 80 }).toBuffer();
        
      // 기존 기사 이미지 버킷인 article-images를 사용
      const { error: storageError } = await supabaseAdmin.storage
        .from('article-images')
        .upload(`articles/${fileName}`, lowResBuffer, { contentType: 'image/jpeg', upsert: true });
        
      if (!storageError) {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('article-images')
          .getPublicUrl(`articles/${fileName}`);
        lowResUrl = publicUrl;
      } else {
        console.error('Supabase Storage Error:', storageError);
        throw storageError;
      }
    } catch (storageErr) {
      console.error('Storage Processing Error:', storageErr);
      throw storageErr;
    }

    return NextResponse.json({ success: true, publicUrl: lowResUrl, highResUrl: highResUrl });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
