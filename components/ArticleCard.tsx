'use client';

import Image from 'next/image';
import { Article } from '@/lib/supabase';
import { Eye } from 'lucide-react';

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
        <Image 
          src={article.image_url || '/fallback/article-default.svg'} 
          alt={article.image_url ? article.title : `${article.title} - 다산어보`} 
          fill 
          style={{ objectFit: 'cover' }}
          onError={(e) => { 
            (e.target as HTMLImageElement).src = '/fallback/article-default.svg'; 
            (e.target as HTMLImageElement).srcset = '';
          }}
        />
      </div>
      <div style={{ padding: '1.2rem' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--primary-dark)',
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
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{new Date(article.created_at).toLocaleDateString()}</span>
          {article.view_count !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Eye size={14} /> {article.view_count.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
