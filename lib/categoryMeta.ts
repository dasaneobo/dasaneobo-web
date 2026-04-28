/**
 * 다산어보 6개 분야 카테고리 메타 정보.
 *
 * 한글 카테고리명을 키로 사용. DB의 `articles.category`가 free string이라
 * 매핑 테이블이 단일 소스 오브 트루스 역할을 한다.
 */
export const CATEGORY_META = {
  '행정': { key: 'admin',    slug: 'administration', label: '행정', tone: '군청 navy' },
  '정치': { key: 'politics', slug: 'politics',       label: '정치', tone: '먹 ink' },
  '경제': { key: 'economy',  slug: 'economy',        label: '경제', tone: '동 bronze' },
  '사회': { key: 'society',  slug: 'society',        label: '사회', tone: '적 crimson' },
  '문화': { key: 'culture',  slug: 'culture',        label: '문화', tone: '자 plum' },
  '칼럼': { key: 'column',   slug: 'column',         label: '칼럼', tone: '청록 teal' },
} as const

export type CategoryName = keyof typeof CATEGORY_META
export type CategoryKey  = (typeof CATEGORY_META)[CategoryName]['key']
export type CategoryMeta = (typeof CATEGORY_META)[CategoryName]

/**
 * 한글 카테고리명을 받아 메타 정보를 반환. 알 수 없는 카테고리면 null.
 * 기사 데이터의 category가 free string이라 fallback 처리 필수.
 */
export function getCategoryMeta(name: string): CategoryMeta | null {
  return (CATEGORY_META as Record<string, CategoryMeta>)[name] ?? null
}

/** slug(영문)로 메타 정보를 역조회. 카테고리 페이지(/economy 등)에서 사용. */
export function getCategoryMetaBySlug(slug: string): CategoryMeta | null {
  return Object.values(CATEGORY_META).find((m) => m.slug === slug) ?? null
}

/** 사이트 전체에서 사용 가능한 카테고리 키 목록. 타입 가드용. */
export const CATEGORY_KEYS: readonly CategoryKey[] = Object.values(CATEGORY_META).map(
  (m) => m.key,
) as readonly CategoryKey[]
