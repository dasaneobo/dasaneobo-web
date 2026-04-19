'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Clock, User as UserIcon, Calendar, ArrowRight, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  author_name: string;
  category: string;
  region: string;
  created_at: string;
}

interface NewspaperLayoutProps {
  title: string;
  type: 'region' | 'category';
  value: string; // e.g., '강진' or '행정'
}

export default function NewspaperLayout({ title, type, value }: NewspaperLayoutProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (value !== 'all') {
        if (type === 'region') {
          query = query.eq('region', value);
        } else {
          query = query.eq('category', value);
        }
      }

      const { data } = await query;
      if (data) setArticles(data);
      setLoading(false);
    };

    fetchArticles();
  }, [type, value]);

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>소식을 불러오는 중...</div>;

  if (articles.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '5rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#ccc', marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: '#999' }}>현재 등록된 소식이 없습니다. 준비 중입니다.</p>
        <Link href="/"><button className="btn btn-outline" style={{ marginTop: '2rem' }}>메인으로 돌아가기</button></Link>
      </div>
    );
  }

  const featured = articles[0];
  const secondary = articles.slice(1, 3);
  const others = articles.slice(3);

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      {/* Newspaper Header */}
      <div style={{ borderBottom: '4px solid #111', paddingBottom: '1.5rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
           <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0, fontFamily: '"Nanum Myeongjo", serif' }}>
             {title}
           </h2>
           <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#666', fontSize: '0.9rem' }}>
             <Clock size={16} /> 최근 업데이트: {new Date(articles[0].created_at).toLocaleString()}
           </div>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 600, borderLeft: '1px solid #ddd', paddingLeft: '1rem' }}>
           다산어보 섹션 제 {Math.floor(Math.random() * 100) + 10}호
        </div>
      </div>

      {/* Main Grid: Featured + Secondary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
        {/* Featured Article */}
        <Link href={`/article/${featured.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="newspaper-featured" style={{ cursor: 'pointer' }}>
            {featured.image_url && (
              <div style={{ width: '100%', height: '400px', overflow: 'hidden', borderRadius: '4px', marginBottom: '1.5rem' }}>
                <img src={featured.image_url} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2, letterSpacing: '-1px' }}>{featured.title}</h3>
            {featured.subtitle && <h4 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '1rem', fontWeight: 700 }}>{featured.subtitle}</h4>}
            <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {featured.content.replace(/<[^>]*>/g, '').substring(0, 300)}...
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#777', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><UserIcon size={16} /> {featured.author_name} 기자</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={16} /> {new Date(featured.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>

        {/* Secondary Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {secondary.map(article => (
            <Link key={article.id} href={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem', cursor: 'pointer' }}>
                {article.image_url && (
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '4px' }}>
                    <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{article.title}</h4>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>{new Date(article.created_at).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
          {secondary.length === 0 && <div style={{ color: '#ccc', textAlign: 'center', padding: '2rem' }}>추가 소식이 없습니다.</div>}
        </div>
      </div>

      {/* Grid: Other Articles */}
      {others.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ borderTop: '2px solid #333', paddingTop: '2rem', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRight size={20} /> 더 많은 소식
            </h4>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {others.map(article => (
              <Link key={article.id} href={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ cursor: 'pointer' }}>
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px', background: '#f5f5f5', marginBottom: '1rem' }}>
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>이미지 없음</div>
                    )}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-dark)', padding: '2px 8px', background: 'var(--primary-light)', borderRadius: '4px' }}>
                      {article.category}
                    </span>
                  </div>
                  <h5 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.title}
                  </h5>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(article.created_at).toLocaleDateString()}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <button className="btn btn-outline" style={{ padding: '0.8rem 2.5rem', borderRadius: '30px', fontWeight: 700 }}>기사 더보기</button>
          </div>
        </div>
      )}

      {/* Global CSS for responsiveness would go in index.css, here we stick to inline or style tag */}
      <style jsx>{`
        @media (max-width: 992px) {
          .container { padding-left: 1.5rem; padding-right: 1.5rem; }
          div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          h2 { font-size: 2rem !important; }
          h3 { font-size: 1.6rem !important; }
        }
      `}</style>
    </div>
  );
}
