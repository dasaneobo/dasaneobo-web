import { supabase } from '@/lib/supabase'

export interface FeaturedArticle {
  id: string
  slug?: string
  title: string
  subtitle?: string
  content: string
  image_url: string
  category: string
  source?: string
  created_at: string
  is_pick: boolean
}

/**
 * 메인홈 초점 박스에 노출할 기사 1건을 반환.
 */
export async function getFeaturedArticle(): Promise<FeaturedArticle | null> {
  const baseSelect =
    'id, slug, title, content, image_url, category, created_at, is_top'

  // 1. 어드민에서 지정한 톱뉴스(is_top)
  const { data: pick, error: pickError } = await supabase
    .from('articles')
    .select(baseSelect)
    .eq('is_top', true)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (pickError) {
    console.error('[getFeaturedArticle] pick query error:', pickError)
  }

  if (pick) {
    return { ...pick, is_pick: true }
  }

  // 2. Fallback: 최근 7일 내 사진 있는 최신 기사
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: latest, error: latestError } = await supabase
    .from('articles')
    .select(baseSelect)
    .not('image_url', 'is', null)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestError) {
    console.error('[getFeaturedArticle] fallback query error:', latestError)
    return null
  }

  return latest ? { ...latest, is_pick: false } : null
}
