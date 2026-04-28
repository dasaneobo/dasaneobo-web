/**
 * 다산어보 4대 권역 메타 정보.
 *
 * 분야(category)와 동일 패턴이지만 별도 모듈로 분리. 한 카드에 분야 + 권역이
 * 같이 들어갈 수 있고, 둘은 다른 시각 언어(분야=배지, 권역=점)를 쓴다.
 */
export const REGION_META = {
  '강진': {
    key: 'gangjin',   slug: 'gangjin',
    label: '강진',    tone: '청자 celadon',
    motif: '다산·청자',
  },
  '고흥': {
    key: 'goheung',   slug: 'goheung',
    label: '고흥',    tone: '유자 citrus',
    motif: '우주·유자',
  },
  '보성': {
    key: 'boseong',   slug: 'boseong',
    label: '보성',    tone: '차 tea',
    motif: '녹차·차밭',
  },
  '장흥': {
    key: 'jangheung', slug: 'jangheung',
    label: '장흥',    tone: '정남 terra',
    motif: '정남진·한우',
  },
} as const

export type RegionName = keyof typeof REGION_META
export type RegionKey  = (typeof REGION_META)[RegionName]['key']
export type RegionMeta = (typeof REGION_META)[RegionName]

export function getRegionMeta(name: string): RegionMeta | null {
  return (REGION_META as Record<string, RegionMeta>)[name] ?? null
}

export function getRegionMetaBySlug(slug: string): RegionMeta | null {
  return Object.values(REGION_META).find((m) => m.slug === slug) ?? null
}

export const REGION_KEYS: readonly RegionKey[] = Object.values(REGION_META).map(
  (m) => m.key,
) as readonly RegionKey[]
