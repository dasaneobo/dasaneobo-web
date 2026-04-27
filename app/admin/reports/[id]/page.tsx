'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Copy } from 'lucide-react';
import Link from 'next/link';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('village_reports')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setReport(data);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const markAsDone = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('village_reports')
        .update({ status: 'done' })
        .eq('id', id);

      if (error) throw error;
      setReport({ ...report, status: 'done' });
      alert('처리 완료 상태로 변경되었습니다.');
    } catch (err) {
      console.error('Update failed:', err);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const copyToClaude = async () => {
    if (!report) return;

    const textToCopy = `[다산어보 마을 리포터 제보 내용]
다음 내용을 바탕으로 인터넷 신문사 '다산어보'의 기사 초안을 작성해주세요. 문체는 객관적이고 신뢰감 있게 작성해주시고, 제보 형식을 고려하여 적절한 톤앤매너를 유지해주세요.

- 제보 형식: ${report.style}
- 지역: ${report.where}
- 누가: ${report.who}
- 언제: ${report.when}
- 어디서: ${report.where}
- 무엇을: ${report.what}
- 어떻게: ${report.how}
- 왜: ${report.why}
- 상세 내용 및 전달 사항: 
${report.extra || '없음'}
`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>;
  }

  if (!report) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>제보를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/admin/reports" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
        <ArrowLeft size={18} />
        목록으로 돌아가기
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111', margin: '0 0 0.5rem 0' }}>
            마을 리포터 제보 상세
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.95rem' }}>
            <span>접수일: {new Date(report.created_at).toLocaleString('ko-KR')}</span>
            <span style={{ 
              padding: '4px 10px', 
              borderRadius: '4px', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              background: report.status === 'done' ? '#dcfce7' : '#fef3c7',
              color: report.status === 'done' ? '#166534' : '#92400e'
            }}>
              {report.status === 'done' ? '처리 완료' : '검토 대기'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={copyToClaude}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8rem 1.5rem', background: '#3b82f6', color: 'white', 
              border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 700, 
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
            }}
          >
            <Copy size={20} />
            {copySuccess ? '복사 완료!' : 'Claude로 복사'}
          </button>
          
          <button 
            onClick={markAsDone}
            disabled={report.status === 'done' || updating}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8rem 1.5rem', background: report.status === 'done' ? '#f1f5f9' : '#64748b', 
              color: report.status === 'done' ? '#94a3b8' : 'white', 
              border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 700, 
              cursor: report.status === 'done' || updating ? 'not-allowed' : 'pointer'
            }}
          >
            <CheckCircle size={20} />
            처리 완료로 표시
          </button>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        
        {/* Header Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h3 style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: 700 }}>제보 형식</h3>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2E7D52' }}>{report.style}</div>
          </div>
          <div>
            <h3 style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: 700 }}>제보자 정보</h3>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              {report.sender_name || '익명'} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>({report.sender_contact || '연락처 없음'})</span>
            </div>
          </div>
        </div>

        {/* 6W1H Content */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '4px', height: '20px', background: '#2E7D52', borderRadius: '2px' }}></div>
          육하원칙 제보 내용
        </h3>
        
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: '누가 (Who)', value: report.who },
            { label: '무엇을 (What)', value: report.what },
            { label: '언제 (When)', value: report.when },
            { label: '어디서 (Where)', value: report.where },
            { label: '어떻게 (How)', value: report.how },
            { label: '왜 (Why)', value: report.why },
          ].map((item, i) => (
            <div key={i} style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>{item.label}</div>
              <div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 500, lineHeight: 1.6 }}>{item.value || '-'}</div>
            </div>
          ))}
        </div>

        {/* Extra Content */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '4px', height: '20px', background: '#2E7D52', borderRadius: '2px' }}></div>
          상세 내용 및 전달 사항
        </h3>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9', minHeight: '150px' }}>
          <p style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {report.extra || '추가 내용이 없습니다.'}
          </p>
        </div>

      </div>
    </div>
  );
}
