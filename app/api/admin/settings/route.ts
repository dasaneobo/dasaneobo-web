import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { id, value } = await request.json();

    if (!id || value === undefined) {
      return NextResponse.json(
        { error: 'id and value are required' },
        { status: 400 }
      );
    }

    // Upsert the setting bypassing RLS
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ id, value }, { onConflict: 'id' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
