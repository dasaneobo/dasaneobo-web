// ... 기존 import 및 설정 ...

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const reportDataStr = formData.get('reportData') as string;
    const reportData = JSON.parse(reportDataStr);
    // 파일이 없을 경우 바로 DB에 저장
    if (!file) {
      const { data: dbData, error: dbError } = await supabaseAdmin
        .from('village_reports')
        .insert([{ ...reportData, high_res_url: null, low_res_url: null, status: 'new' }])
        .select()
        .single();
      if (dbError) throw dbError;
      return NextResponse.json({ success: true, data: dbData });
    }

    // 파일이 있을 경우 기존 로직 (Google Drive + Supabase Storage)
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;

    // 1️⃣ Google Drive 업로드
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

    // 2️⃣ Supabase Storage (저해상도) 업로드
    let lowResUrl = '';
    try {
      const lowResBuffer = await sharp(buffer).resize(1200, null, { withoutEnlargement: true })
        .jpeg({ quality: 80 }).toBuffer();
      const { error: storageError } = await supabaseAdmin.storage
        .from('village-reports')
        .upload(`low_res/${fileName}`, lowResBuffer, { contentType: 'image/jpeg', upsert: true });
      if (!storageError) {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('village-reports')
          .getPublicUrl(`low_res/${fileName}`);
        lowResUrl = publicUrl;
      } else {
        console.error('Supabase Storage Error (ignored):', storageError);
      }
    } catch (storageErr) {
      console.error('Storage Processing Error (ignored):', storageErr);
    }

    // 3️⃣ DB 저장 (파일 URL 포함)
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('village_reports')
      .insert([{ ...reportData, high_res_url: highResUrl || null, low_res_url: lowResUrl || null, status: 'new' }])
      .select()
      .single();
    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data: dbData });
  } catch (error: any) {
    console.error('Processing Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
