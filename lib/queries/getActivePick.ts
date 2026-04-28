import { supabase } from '@/lib/supabase'

export async function getActivePick(): Promise<{
  id: string
  title: string
  pin_until: string | null
} | null> {
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('articles')
    .select('id, title, pin_until')
    .eq('is_featured', true)
    .or(`pin_until.is.null,pin_until.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}
