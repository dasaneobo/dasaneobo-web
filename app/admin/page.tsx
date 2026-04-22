'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { ClipboardList, CheckCircle, Clock, ArrowRight, FileText, XCircle, Users, Star, Edit, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'published' | 'reports' | 'settings'>('pending');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pendingArticles, setPendingArticles] = useState<any[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<any[]>([]);
  const [villageReports, setVillageReports] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchArticles = async () => {
    // Pending
    const { data: pending } = await supabase
      .from('articles')
      .select(`*`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (pending) setPendingArticles(pending);

    // Published
    const { data: published } = await supabase
      .from('articles')
      .select(`*`)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(30);
    if (published) setPublishedArticles(published);

    // Village Reports
    const { data: reports } = await supabase.from('village_reports').select('*').order('created_at', { ascending: false });
    if (reports) setVillageReports(reports);

    // Site Settings
    const { data: settings } = await supabase.from('site_settings').select('*');
    if (settings) {
      const settingsMap = settings.reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr.value }), {});
      setSiteSettings(settingsMap);
    }

    // Ads
    const { data: adsData } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (adsData) setAds(adsData);
  };

  const updateAd = async (id: string, updates: any) => {
    const { error } = await supabase.from('ads').update(updates).eq('id', id);
    if (error) {
      setStatusMsg({ text: '저장 실패: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: '설정이 저장되었습니다.', type: 'success' });
      await fetchArticles();
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      if (!profile || (profile.role !== 'editor' && profile.role !== 'admin')) {
        alert('편집국 권한이 없습니다.');
        router.push('/');
        return;
      }
      setUserProfile(profile);

      await fetchArticles();
      setLoading(false);
    };

    fetchAdminData();
  }, [router]);

  // Auto-dismiss status message
  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);


  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published' })
        .eq('id', id);
        
      if (error) {
        setStatusMsg({ text: '발행 실패: ' + error.message, type: 'error' });
      } else {
        setStatusMsg({ text: '기사가 발행되었습니다.', type: 'success' });
        await fetchArticles();
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleTop = async (id: string, currentStatus: boolean) => {
    try {
      // If setting to top, unset all others first to ensure only one is top? 
      // Actually, my query in Home handles multiple top stories by picking newest, 
      // but let's make it cleaner: Unset all, then set this one.
      if (!currentStatus) {
        await supabase.from('articles').update({ is_top: false }).eq('status', 'published');
      }

      const { error } = await supabase
        .from('articles')
        .update({ is_top: !currentStatus })
        .eq('id', id);
        
      if (error) {
        alert('상태 변경 실패: ' + error.message + '\nSQL Editor에서 is_top 컬럼을 추가했는지 확인해주세요.');
      } else {
        await fetchArticles();
      }
    } catch (err) { console.error(err); }
  };

  const updateSetting = async (id: string, value: string) => {
    const { error } = await supabase.from('site_settings').update({ value }).eq('id', id);
    if (error) {
      setStatusMsg({ text: '저장 실패: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: '수정사항이 반영되었습니다.', type: 'success' });
      fetchArticles(); // Refresh
    }
  };

  const renderSettingsTab = () => {
    const billboard = ads.find(a => a.location === 'billboard');
    const sidebar = ads.find(a => a.location === 'sidebar');

    return (
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '0 0 12px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>공공 데이터 및 투명성 지표 관리</h3>
        
        {/* Transparency Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.8rem' }}>누적 독립언론 기금 (유리알 보도 배너)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                defaultValue={siteSettings.donation_amount || ''} 
                onBlur={(e) => updateSetting('donation_amount', e.target.value)}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}
                placeholder="예: 12,450,000"
              />
              <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>원</span>
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.8rem' }}>구독자 수 (유리알 보도 배너)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                defaultValue={siteSettings.subscriber_count || ''} 
                onBlur={(e) => updateSetting('subscriber_count', e.target.value)}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}
                placeholder="예: 4,521"
              />
              <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>명</span>
            </div>
          </div>
        </div>

        {/* Ad Management */}
        <div style={{ marginTop: '3rem', padding: '2rem', border: '1px solid #eee', borderRadius: '12px', background: '#fff' }}>
          <h4 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="var(--primary-dark)" /> 광고 및 배너 관리
          </h4>
          
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Billboard Ad Section */}
            <div style={{ padding: '1.5rem', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>[메인 상단 빌보드]</span>
                {billboard ? (
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={billboard.is_active} onChange={(e) => updateAd(billboard.id, { is_active: e.target.checked })} /> 노출 활성
                  </label>
                ) : <span style={{fontSize:'0.8rem', color:'#ef4444'}}>데이터 없음 (SQL 실행 필요)</span>}
              </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <input type="text" defaultValue={billboard.title} onBlur={(e) => updateAd(billboard.id, { title: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="광고 제목" />
                  <input type="text" defaultValue={billboard.description} onBlur={(e) => updateAd(billboard.id, { description: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="상세 설명 / 축제 기간 등" />
                  <input type="text" defaultValue={billboard.link_url} onBlur={(e) => updateAd(billboard.id, { link_url: e.target.value })} style={{ padding: '0.6rem', border: '1px solid var(--primary)', borderRadius: '4px', background: '#f0fdf4' }} placeholder="랜딩 페이지 URL (http://...)" />
                </div>
            </div>

            {/* Sidebar Ad Section */}
            <div style={{ padding: '1.5rem', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>[우측 사이드바 광고]</span>
                {sidebar ? (
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={sidebar.is_active} onChange={(e) => updateAd(sidebar.id, { is_active: e.target.checked })} /> 노출 활성
                  </label>
                ) : <span style={{fontSize:'0.8rem', color:'#ef4444'}}>데이터 없음 (SQL 실행 필요)</span>}
              </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <input type="text" defaultValue={sidebar.title} onBlur={(e) => updateAd(sidebar.id, { title: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="광고 제목" />
                  <input type="text" defaultValue={sidebar.description} onBlur={(e) => updateAd(sidebar.id, { description: e.target.value })} style={{ padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="연락처 / URL 등" />
                  <input type="text" defaultValue={sidebar.link_url} onBlur={(e) => updateAd(sidebar.id, { link_url: e.target.value })} style={{ padding: '0.6rem', border: '1px solid var(--primary)', borderRadius: '4px', background: '#f0fdf4' }} placeholder="랜딩 페이지 URL (http://...)" />
                </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const handleReject = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) await fetchArticles();
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm('제보를 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('village_reports').delete().eq('id', id);
    if (error) {
      setStatusMsg({ text: '제보 삭제 실패: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: '제보가 삭제되었습니다.', type: 'success' });
      await fetchArticles();
    }
  };

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa', position: 'relative' }}>
      {/* Toast Notification */}
      {statusMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: statusMsg.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '99px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {statusMsg.text}
          <button 
            onClick={() => setStatusMsg(null)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '1rem', opacity: 0.7 }}
          >
            닫기
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
      <Header />
      
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
            <ClipboardList color="#1a1a1a" size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>다산어보 편집국 (Desk)</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>리포터 발제 승인 및 톱뉴스 지정을 관리합니다.</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.8rem' }}>
            {userProfile?.role === 'admin' && (
              <Link href="/admin/users">
                <button className="btn btn-outline" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold' }}>
                  <Users size={18} /> 회원 관리
                </button>
              </Link>
            )}
            <Link href="/admin/new">
              <button className="btn btn-primary" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center', padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#222', color: 'white', border: 'none', fontWeight: 'bold' }}>
                <FileText size={18} /> 직접 기사 작성
              </button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
          <div 
            style={{ padding: '1rem 0', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: activeTab === 'pending' ? 'var(--primary-dark)' : '#999', borderBottom: activeTab === 'pending' ? '3px solid var(--primary-dark)' : '3px solid transparent' }}
            onClick={() => setActiveTab('pending')}
          >
            승인 대기 ({pendingArticles.length})
          </div>
          <div 
            style={{ padding: '1rem 0', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: activeTab === 'published' ? 'var(--primary-dark)' : '#999', borderBottom: activeTab === 'published' ? '3px solid var(--primary-dark)' : '3px solid transparent' }}
            onClick={() => setActiveTab('published')}
          >
            발행 완료 ({publishedArticles.length})
          </div>
          <div 
            style={{ padding: '1rem 0', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: activeTab === 'reports' ? 'var(--primary-dark)' : '#999', borderBottom: activeTab === 'reports' ? '3px solid var(--primary-dark)' : '3px solid transparent' }}
            onClick={() => setActiveTab('reports')}
          >
            마을 제보 ({villageReports.length})
          </div>
          <div 
            style={{ padding: '1rem 0', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: activeTab === 'settings' ? 'var(--primary-dark)' : '#999', borderBottom: activeTab === 'settings' ? '3px solid var(--primary-dark)' : '3px solid transparent' }}
            onClick={() => setActiveTab('settings')}
          >
            사이트 설정
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeTab === 'pending' && (
            pendingArticles.length > 0 ? (
              pendingArticles.map(article => (
                <div key={article.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#999' }}>{new Date(article.created_at).toLocaleString()}</span>
                    <span style={{ background: '#fff4e5', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>검토 중</span>
                  </div>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1.3rem', fontWeight: 800 }}>{article.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                    <button onClick={() => handleReject(article.id)} style={{ border: '1px solid #ddd', background: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>반려</button>
                    <button onClick={() => handleApprove(article.id)} style={{ background: 'var(--primary-dark)', border: 'none', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>기사 승인</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '5rem', color: '#999' }}>대기 중인 제출안이 없습니다.</p>
            )
          )}

          {activeTab === 'published' && (
            publishedArticles.length > 0 ? (
              publishedArticles.map(article => (
                <div key={article.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                       {article.is_top && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>메인 1면 톱</span>}
                       <span style={{ color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: 'bold' }}>[{article.category}]</span>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{article.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <Link href={`/admin/new?id=${article.id}`}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8f9fa', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', color: '#666', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        <Edit size={16} /> 수정
                      </button>
                    </Link>
                    <button onClick={() => handleToggleTop(article.id, article.is_top)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: article.is_top ? '#fff1f2' : '#f8f9fa', border: article.is_top ? '1px solid #fecdd3' : '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', color: article.is_top ? '#e11d48' : '#666', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      <Star size={16} fill={article.is_top ? '#e11d48' : 'none'} /> {article.is_top ? '톱뉴스 해제' : '톱뉴스 지정'}
                    </button>
                    <button onClick={() => handleReject(article.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={20} /></button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '5rem', color: '#999' }}>발행된 기사가 없습니다.</p>
            )
          )}

          {activeTab === 'reports' && (
            villageReports.length > 0 ? (
              villageReports.map(report => (
                <div key={report.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', display: 'flex', gap: '1.5rem' }}>
                  {report.low_res_url && (
                     <div style={{ width: '200px', height: '140px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5' }}>
                        <img src={report.low_res_url} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700 }}>[{report.style}] {report.sender_name} 리포터</span>
                      <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(report.created_at).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                       <div><strong>누가:</strong> {report.who}</div><div><strong>무엇을:</strong> {report.what}</div><div><strong>언제:</strong> {report.when}</div>
                       <div><strong>어디서:</strong> {report.where}</div><div><strong>어떻게:</strong> {report.how}</div><div><strong>왜:</strong> {report.why}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <Link href={report.high_res_url || '#'} target="_blank"><button style={{ background: '#4285F4', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>원본 드라이브</button></Link>
                       <Link href={`/admin/new?reportId=${report.id}`}><button style={{ background: '#333', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>기사 변환</button></Link>
                       <button onClick={() => handleDeleteReport(report.id)} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>제보 삭제</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '5rem', color: '#999' }}>접수된 마을 제보가 없습니다.</p>
            )
          )}

          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </main>
  );
}
