'use server';

import { supabase } from '@/lib/supabase';

export async function requestMagicLink(email: string) {
  try {
    // Check if email exists and is active
    const { data, error } = await supabase
      .from('village_reporters')
      .select('id, status, full_name')
      .eq('email', email)
      .single();

    if (error || !data) {
      return { success: false, message: '등록된 마을 리포터 이메일을 찾을 수 없습니다.' };
    }

    if (data.status !== 'active') {
      return { success: false, message: '아직 승인 대기 중이거나 비활성화된 계정입니다.' };
    }

    const token = crypto.randomUUID();
    
    // Save token
    const { error: updateError } = await supabase
      .from('village_reporters')
      .update({ magic_token: token })
      .eq('id', data.id);

    if (updateError) {
      throw updateError;
    }

    return { success: true, token, name: data.full_name, email };
  } catch (err: any) {
    console.error('Magic Link Error:', err);
    return { success: false, message: '처리 중 오류가 발생했습니다.' };
  }
}

export async function verifyMagicToken(token: string) {
  try {
    if (!token) return { success: false };

    const { data, error } = await supabase
      .from('village_reporters')
      .select('id, full_name, email, contact_phone, region')
      .eq('magic_token', token)
      .single();

    if (error || !data) {
      return { success: false };
    }

    // Optional: Clear token after use if you want one-time links
    // await supabase.from('village_reporters').update({ magic_token: null }).eq('id', data.id);

    return { success: true, reporter: data };
  } catch (err) {
    return { success: false };
  }
}
