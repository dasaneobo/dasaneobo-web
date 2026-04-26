'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Clock, ChevronRight } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (data) setResults(data);
      setLoading(false);
    };

    performSearch();
  }, [query]);

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '3rem', borderBottom: '2px solid #eee', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Search size={28} color="var(--primary-dark)" />
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>
          <span style={{ color: 'var(--primary-dark)' }}>"{query}"</span> 검색 결과
        </h1>
        <span style={{ marginLeft: 'auto', color: '#888' }}>총 {results.length}건</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>검색 중입니다...</div>
      ) : results.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {results.map((article) => (
            <Link key={article.id} href={`/article/${article.slug ?? article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '240px 1fr', 
                gap: '2rem',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #eee',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: '8px', overflow: 'hidden' }}>
                  <img 
                    src={article.image_url || '/fallback/article-default.svg'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt="" 
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = '/fallback/article-default.svg'; 
                      (e.target as HTMLImageElement).srcset = '';
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <span style={{ color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '0.85rem' }}>[{article.category}]</span>
                    <span style={{ color: '#aaa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: '1.4' }}>{article.title}</h3>
                  <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.content.replace(/<[^>]*>/g, '').replace(/[#*`~]/g, '').substring(0, 200)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '10rem 0', background: '#f8f9fa', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', color: '#999' }}>일치하는 검색 결과가 없습니다.</p>
          <Link href="/">
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>홈으로 돌아가기</button>
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fcfcfc' }}>
      <Header />
      <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>로딩 중...</div>}>
        <SearchResultsContent />
      </Suspense>
    </main>
  );
}
