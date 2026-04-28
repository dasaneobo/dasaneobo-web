'use client'

interface FeaturedPickSectionProps {
  article: {
    id?: string
    title: string
    image_url: string
    category: string
    author_id?: string
    created_at?: string
  }
  activePick: { id: string; title: string; pin_until: string | null } | null
  value: { is_featured: boolean; pin_until: string | null }
  onChange: (v: { is_featured: boolean; pin_until: string | null }) => void
}

const PRESETS = [
  { label: '5일 후', days: 5 },
  { label: '7일 후', days: 7 },
  { label: '영구',   days: null },
] as const

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(23, 59, 59, 0)
  return d.toISOString().slice(0, 10)
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const target = new Date(iso)
  const now = new Date()
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function FeaturedPickSection({
  article,
  activePick,
  value,
  onChange,
}: FeaturedPickSectionProps) {
  const { is_featured, pin_until } = value
  const countdown = daysUntil(pin_until)
  const noImage = !article.image_url
  const conflict = activePick && activePick.id !== article.id

  function setToggle(next: boolean) {
    if (!next) {
      onChange({ is_featured: false, pin_until: null })
    } else {
      onChange({ is_featured: true, pin_until: addDays(5) })
    }
  }

  function setPreset(days: number | null) {
    onChange({ is_featured: true, pin_until: days === null ? null : addDays(days) })
  }

  function setDate(date: string) {
    onChange({ is_featured: true, pin_until: date })
  }

  return (
    <section style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.8rem', marginBottom: '1.2rem', borderBottom: '1px solid #eee' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>초점 픽 설정</h3>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>메인홈 히어로 박스 노출 제어</span>
      </header>

      {conflict && (
        <div style={{ background: '#fffbeb', color: '#92400e', fontSize: '0.85rem', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.2rem', lineHeight: 1.5 }}>
          ⚠ 현재 활성 픽: <strong>"{activePick.title}"</strong>
          {activePick.pin_until && (
            <> · 만료까지 {daysUntil(activePick.pin_until)}일 남음</>
          )}
          {' '}— 저장 시 이 기사로 교체됩니다.
        </div>
      )}

      {noImage && is_featured && (
        <div style={{ background: '#fef2f2', color: '#991b1b', fontSize: '0.85rem', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.2rem', lineHeight: 1.5 }}>
          ⚠ 대표 이미지가 없어 메인홈 초점 박스에 노출되지 않습니다. 이미지를 추가해주세요.
        </div>
      )}

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={is_featured}
          onChange={(e) => setToggle(e.target.checked)}
          style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary-dark)' }}
        />
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)' }}>메인홈 초점 박스에 노출</span>
      </label>

      <fieldset disabled={!is_featured} style={{ border: 'none', padding: 0, margin: 0, opacity: is_featured ? 1 : 0.5 }}>
        <legend style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 700, marginBottom: '0.5rem' }}>픽 만료일</legend>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={pin_until ?? ''}
            min={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '0.5rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', width: '140px' }}
          />
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setPreset(p.days)}
              style={{ padding: '0.5rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.8rem', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {is_featured && (
          <p style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700, marginTop: '0.8rem' }}>
            {pin_until ? `만료까지 ${countdown}일 남음` : '영구 픽 (수동 종료 전까지 계속 노출)'}
          </p>
        )}
      </fieldset>

      {is_featured && !noImage && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', fontWeight: 700, marginBottom: '0.5rem' }}>
            메인홈 노출 미리보기
          </p>
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #eee' }}>
              <span style={{ display: 'inline-block', background: 'var(--primary-dark)', color: 'white', fontSize: '11px', padding: '3px 8px', fontWeight: 700, letterSpacing: '0.06em' }}>
                초점
              </span>
              <h4 style={{ fontFamily: '"Nanum Myeongjo", serif', fontSize: '1.2rem', fontWeight: 700, color: '#111', margin: '0.8rem 0 0.5rem', lineHeight: 1.3 }}>
                {article.title || '제목 없음'}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                {article.created_at ? new Date(article.created_at).toLocaleDateString('ko-KR') : '오늘'} · 기자
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
