import Image from 'next/image'
import Link from 'next/link'
import type { FeaturedArticle } from '@/lib/queries/getFeaturedArticle'
import styles from './HeroFocusBox.module.css'

interface HeroFocusBoxProps {
  article: FeaturedArticle | null
}

function formatKoreanDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
}

export default function HeroFocusBox({ article }: HeroFocusBoxProps) {
  if (!article) return null

  const badgeLabel = article.is_pick ? '초점' : (article.category || '종합')
  const articleHref = `/article/${article.slug ?? article.id}`
  const authorName = article.source || '다산어보'

  return (
    <section aria-label="주요 기사" className={styles.container}>
      <div className={styles.grid}>
        {/* 사진 */}
        <Link
          href={articleHref}
          className={styles.imageWrap}
          aria-label={`${article.title} 기사 사진`}
        >
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Link>

        {/* 텍스트 */}
        <div className={styles.textContent}>
          <div>
            <span className={styles.badge}>
              {badgeLabel}
            </span>

            <Link href={articleHref} className={styles.headlineWrap}>
              <h2 className={styles.headline}>
                {article.title}
              </h2>
            </Link>

            <p className={styles.summary}>
              {article.subtitle || article.content?.replace(/<[^>]*>/g, '').substring(0, 150) || ''}
            </p>
          </div>

          <div className={styles.metaWrap}>
            <span className={styles.metaText}>
              {formatKoreanDate(article.created_at)} · {authorName}
            </span>
            <Link
              href={articleHref}
              className={styles.cta}
            >
              전문 보기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
