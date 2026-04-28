import Image from 'next/image';

interface BannerAdProps {
  /** 970×90 권장 비율 데스크톱 전용 이미지 */
  desktopSrc?: string;
  /** 320×50 권장 비율 모바일 전용 이미지 */
  mobileSrc?: string;
  /** desktopSrc/mobileSrc 없을 때 사용하는 폴백 이미지 (object-fit: contain으로 letterbox 처리) */
  fallbackSrc?: string;
  /** @deprecated — fallbackSrc 로 이전 예정. 하위 호환 유지 */
  src?: string;
  href: string;
  alt: string;
  slot?: 'header-bottom' | 'article-top' | 'sidebar' | 'footer-top' | string;
}

export default function BannerAd({
  desktopSrc,
  mobileSrc,
  fallbackSrc,
  src,
  href,
  alt,
  slot = 'header-bottom',
}: BannerAdProps) {
  const resolvedFallback = fallbackSrc ?? src;

  // 데스크톱·모바일 둘 다 이미지가 없으면 렌더링하지 않음
  const hasDesktop = !!(desktopSrc || resolvedFallback);
  const hasMobile  = !!(mobileSrc  || resolvedFallback);
  if (!hasDesktop && !hasMobile) return null;

  const desktopImg = desktopSrc ?? resolvedFallback ?? '';
  const mobileImg  = mobileSrc  ?? resolvedFallback ?? '';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener sponsored"
      style={{ display: 'block', width: '100%', textDecoration: 'none' }}
      className={`banner-ad-wrap banner-ad-slot-${slot}`}
    >
      {/* ── 공통 컨테이너 ─────────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#fafaf9',
          borderTop: '1px solid #e7e5e4',
          borderBottom: '1px solid #e7e5e4',
          padding: '8px 16px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── 데스크톱 띠배너 (≥768px) ─────────────────────── 970×90 */}
        <div className="banner-desktop" style={{ position: 'relative' }}>
          {/* "광고" 라벨 */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              fontSize: '11px',
              color: '#78716c',
              fontWeight: 500,
              lineHeight: 1,
              background: 'rgba(255,255,255,0.82)',
              padding: '1px 4px',
              borderRadius: '2px',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            광고
          </div>

          {/* 970×90 컨테이너 — letterbox if fallback */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '970px',
              margin: '0 auto',
              aspectRatio: '970 / 90',
              overflow: 'hidden',
              background: '#fafaf9',
            }}
          >
            {hasDesktop && (
              <Image
                src={desktopImg}
                alt={alt}
                fill
                style={{
                  objectFit: desktopSrc ? 'cover' : 'contain',
                  objectPosition: 'center',
                }}
                priority={slot === 'header-bottom'}
              />
            )}
          </div>
        </div>

        {/* ── 모바일 띠배너 (<768px) ───────────────────────── 320×50 */}
        <div className="banner-mobile" style={{ position: 'relative', display: 'none' }}>
          {/* "광고" 라벨 */}
          <div
            style={{
              position: 'absolute',
              top: '3px',
              left: '3px',
              fontSize: '10px',
              color: '#78716c',
              fontWeight: 500,
              lineHeight: 1,
              background: 'rgba(255,255,255,0.82)',
              padding: '1px 3px',
              borderRadius: '2px',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            광고
          </div>

          {/* 320×50 컨테이너 */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '320 / 50',
              overflow: 'hidden',
              background: '#fafaf9',
            }}
          >
            {hasMobile && (
              <Image
                src={mobileImg}
                alt={alt}
                fill
                style={{
                  objectFit: mobileSrc ? 'cover' : 'contain',
                  objectPosition: 'center',
                }}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .banner-desktop { display: none !important; }
          .banner-mobile  { display: block !important; }
          .banner-ad-wrap > div { padding: 6px 12px; }
        }
      `}</style>
    </a>
  );
}
