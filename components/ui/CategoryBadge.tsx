import { getCategoryMeta, type CategoryKey } from '@/lib/categoryMeta'
import styles from './CategoryBadge.module.css'

interface CategoryBadgeProps {
  category: string
  variant?: 'subtle' | 'solid'
  size?: 'sm' | 'md'
  className?: string
}

export default function CategoryBadge({
  category,
  variant = 'subtle',
  size = 'sm',
  className = '',
}: CategoryBadgeProps) {
  const meta = getCategoryMeta(category)
  
  const sizeClass = size === 'md' ? styles.size_md : styles.size_sm;

  // Unknown category — neutral fallback. DB에 없는 새 분야가 들어와도 깨지지 않게.
  if (!meta) {
    return (
      <span
        className={`${styles.badge} ${styles.fallback} ${sizeClass} ${className}`}
      >
        {category}
      </span>
    )
  }

  const styleClass = styles[`${meta.key}_${variant}`] || styles.fallback;

  return (
    <span
      className={`${styles.badge} ${styleClass} ${sizeClass} ${className}`}
    >
      {meta.label}
    </span>
  )
}
