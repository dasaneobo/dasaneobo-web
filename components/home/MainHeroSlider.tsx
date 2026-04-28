'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MainHeroSlider.module.css';
import { ChevronLeft } from 'lucide-react';

interface Article {
  id: string;
  slug?: string;
  title: string;
  image_url: string;
  category: string;
  created_at?: string;
}

interface MainHeroSliderProps {
  articles: Article[];
}

export default function MainHeroSlider({ articles }: MainHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!articles || articles.length === 0) return null;

  const activeArticle = articles[activeIndex];

  return (
    <section aria-label="메인 주요 기사 슬라이더">
      <div className={styles.container}>
        {/* Left side: Main Image Area */}
        <Link href={`/article/${activeArticle.slug ?? activeArticle.id}`} className={styles.mainArea}>
          <Image
            src={activeArticle.image_url}
            alt={activeArticle.title}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className={styles.mainImage}
            priority
          />
          <div className={styles.gradientOverlay} />
          <div className={styles.mainTextContent}>
            <h2 className={styles.mainHeadline}>{activeArticle.title}</h2>
          </div>
        </Link>

        {/* Right side: List Area */}
        <div className={styles.listArea}>
          {articles.map((art, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={art.id}
                className={`${styles.listItem} ${isActive ? styles.listActive : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <Link 
                  href={`/article/${art.slug ?? art.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%', alignItems: 'center' }}
                  onClick={(e) => {
                    if (!isActive) e.preventDefault(); // Only navigate if it's already active, otherwise hover/click just changes image
                  }}
                >
                  {isActive && (
                    <span className={styles.listActiveIndicator}>
                      <ChevronLeft size={18} strokeWidth={3} />
                    </span>
                  )}
                  <h3 className={styles.listHeadline}>{art.title}</h3>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
