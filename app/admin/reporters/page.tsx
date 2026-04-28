'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import emailjs from '@emailjs/browser';
import { CheckCircle, XCircle, Search, Mail } from 'lucide-react';

type Reporter = {
  id: string;
  full_name: string;
  email: string;
  contact_phone: string;
  region: string;
  status: string;
  tier: number;
  created_at: string;
};

export default function AdminReportersPage() {
  const router = useRouter();
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchReporters();
  }, [filter]);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    // Simple admin check (assuming user has right permissions if they can load this page)
    setIsAdmin(true);
  };

  const fetchReporters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('village_reporters')
      .select('*')
      .eq('status', filter)
      .order('created_at', { ascending: false });

    if (data) {
      setReporters(data);
    }
    setLoading(false);
  };

  const handleApprove = async (reporter: Reporter) => {
    if (!confirm(`${reporter.full_name} 님을 마을 리포터로 승인하시겠습니까?`)) return;

    try {
      // 1. Update DB
      const { error } = await supabase
        .from('village_reporters')
        .update({ status: 'active', tier: 1 }) // Start at tier 1
        .eq('id', reporter.id);

      if (error) throw error;

      // 2. Send Welcome Email via EmailJS
      if (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
        const welcomeUrl = `${window.location.origin}/report`;
        
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID || 'template_default', // Admin must setup this template
          {
            to_email: reporter.email,
            to_name: reporter.full_name,
            subject: '[다산어보] 마을 리포터 등록이 승인되었습니다.',
            message: `다산어보 마을 리포터가 되신 것을 환영합니다!
            
${reporter.full_name} 님의 마을 리포터 등록이 완료되었습니다.
지금부터 아래 링크를 통해 마을 소식을 제보해 주시면, 누적 제보 수에 따라 명함 발급, 평생 구독 등 다양한 혜택이 주어집니다.

제보 페이지: ${welcomeUrl}

앞으로 ${reporter.region}의 생생한 이야기를 기대하겠습니다. 감사합니다.`
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );
      }

      alert('승인 및 환영 이메일 발송이 완료되었습니다.');
      fetchReporters();
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err.message);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('정말 이 신청을 반려하시겠습니까?')) return;

    const { error } = await supabase
      .from('village_reporters')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      alert('반려 중 오류 발생: ' + error.message);
    } else {
      fetchReporters();
    }
  };

  const getTierName = (tier: number) => {
    switch(tier) {
      case 1: return '입회';
      case 2: return '활동';
      case 3: return '고문';
      case 4: return '茶山語報';
      default: return '-';
    }
  };

  if (!isAdmin) return null;

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      
      <div className="container" style={{ padding: '3rem 0', maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: '#1e293b' }}>
          마을 리포터 관리
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { id: 'pending', label: '승인 대기' },
            { id: 'active', label: '활동 중' },
            { id: 'rejected', label: '반려됨' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                border: filter === f.id ? '2px solid #1F5946' : '1px solid #cbd5e1',
                background: filter === f.id ? '#1F5946' : 'white',
                color: filter === f.id ? 'white' : '#64748b',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>이름</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>권역</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>연락처/이메일</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>신청일</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>단계(혜택)</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700, textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>로딩 중...</td>
                </tr>
              ) : reporters.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>데이터가 없습니다.</td>
                </tr>
              ) : (
                reporters.map(reporter => (
                  <tr key={reporter.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>{reporter.full_name}</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>{reporter.region}</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>
                      <div style={{ fontSize: '0.9rem' }}>{reporter.contact_phone}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{reporter.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>
                      {new Date(reporter.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {filter === 'active' ? (
                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                          {getTierName(reporter.tier)}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {filter === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleApprove(reporter)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            <CheckCircle size={16} /> 승인
                          </button>
                          <button 
                            onClick={() => handleReject(reporter.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            <XCircle size={16} /> 반려
                          </button>
                        </div>
                      )}
                      {filter === 'active' && (
                        <button 
                          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', margin: '0 auto' }}
                        >
                          <Search size={16} /> 상세 보기
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
