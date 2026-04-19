'use client';

import Image from 'next/image';
import { Camera, BarChart3, TrendingUp, Users } from 'lucide-react';

export function ReporterFeed() {
  const posts = [
    { id: 1, user: '강진댁', text: '새벽 시장 싱싱한 은갈치!', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop' },
    { id: 2, user: '보성청년', text: '녹차밭 일출 장관이네요.', img: 'https://images.unsplash.com/photo-1594494424759-645688a22bc1?q=80&w=400&auto=format&fit=crop' },
    { id: 3, user: '장동민', text: '정남진 물축제 준비 한창!', img: 'https://images.unsplash.com/photo-1534939561126-30219672824a?q=80&w=400&auto=format&fit=crop' },
    { id: 4, user: '고흥새댁', text: '우주 발사체 구경 왔어요.', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <section style={{ margin: '3rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Camera style={{ color: 'var(--primary-dark)' }} />
        <h2 style={{ margin: 0 }}>리포터 광장</h2>
      </div>
      <div className="reporter-feed">
        {posts.map(post => (
          <div key={post.id} className="feed-item">
            <Image src={post.img} alt={post.text} fill style={{ objectFit: 'cover' }} />
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              width: '100%', 
              padding: '0.8rem', 
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: 'white',
              fontSize: '0.8rem'
            }}>
              <strong>@{post.user}</strong>
              <p style={{ margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{post.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RegionalDashboard() {
  const reports = [
    { name: '강진군', text: '시장 앞 신호등 고장났어요. 통행 조심하세요!', img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400&auto=format&fit=crop', time: '10분 전' },
    { name: '보성군', text: '녹차밭 입구 주차장 현재 만차입니다.', img: 'https://images.unsplash.com/photo-1594494424759-645688a22bc1?q=80&w=400&auto=format&fit=crop', time: '25분 전' },
    { name: '장흥군', text: '토요시장 오늘 버스킹 공연 너무 재밌네요~', img: 'https://images.unsplash.com/photo-1534939561126-30219672824a?q=80&w=400&auto=format&fit=crop', time: '1시간 전' },
    { name: '고흥군', text: '우주센터 가는 길 해안도로 벚꽃 만개했습니다.', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop', time: '2시간 전' },
  ];

  return (
    <section style={{ margin: '3rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Camera style={{ color: 'var(--primary-dark)' }} />
        <h2 style={{ margin: 0 }}>우리동네 실시간 제보</h2>
      </div>
      <div className="grid grid-cols-1 grid-cols-2 grid-cols-4">
        {reports.map(report => (
          <div key={report.name} className="data-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '140px' }}>
              <Image src={report.img} alt={report.text} fill style={{ objectFit: 'cover' }} />
              <div style={{ 
                position: 'absolute', 
                top: '10px', 
                left: '10px', 
                background: 'var(--primary)', 
                color: '#1a1a1a', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '20px', 
                fontSize: '0.75rem', 
                fontWeight: 700 
              }}>
                {report.name}
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {report.text}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#999' }}>
                <span>사진 제보</span>
                <span>{report.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
