import { getRegionMeta } from '@/lib/regionMeta'
import styles from './RegionDot.module.css'

interface RegionDotProps {
  region: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function RegionDot({
  region,
  size = 'md',
  showLabel = true,
  className = '',
}: RegionDotProps) {
  const meta = getRegionMeta(region)
  
  const gapClass = styles[`size_${size}_gap`]
  const dotClass = styles[`size_${size}_dot`]
  const labelClass = styles[`size_${size}_label`]

  // Unknown region — neutral fallback
  if (!meta) {
    return (
      <span className={`${styles.container} ${gapClass} ${className}`}>
        <span className={`${styles.dot} ${styles.fallback_accent} ${dotClass}`} aria-hidden="true" />
        {showLabel && <span className={labelClass}>{region}</span>}
      </span>
    )
  }

  const accentClass = styles[`${meta.key}_accent`]

  return (
    <span className={`${styles.container} ${gapClass} ${className}`}>
      <span
        className={`${styles.dot} ${accentClass} ${dotClass}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={labelClass}>
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>{`권역: `}</span>
          {meta.label}
        </span>
      )}
    </span>
  )
}
