'use client';

import Image from 'next/image';
import { Article } from '@/lib/supabase';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="fade-in" style={{
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ position: 'relative', height: '200px', width: '100%', background: '#f0f0f0' }}>
        {article.image_url ? (
          <Image 
            src={article.image_url} 
            alt={article.title} 
            fill 
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#ccc',
            background: 'linear-gradient(45deg, var(--primary-light), #fff)'
          }}>
            이미지 없음
          </div>
        )}
      </div>
      <div style={{ padding: '1.2rem' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--primary-dark)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>{article.category}</span>
        <h3 style={{ 
          fontSize: '1.2rem', 
          margin: '0.5rem 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>{article.title}</h3>
        <p style={{
          fontSize: '0.9rem',
          color: '#666',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>{article.content}</p>
        <div style={{
          fontSize: '0.8rem',
          color: '#999',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{new Date(article.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
