'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReportsAdminPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // Filters
  const [regionFilter, setRegionFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('village_reports')
        .select('*', { count: 'exact' });

      // Apply Filters
      if (regionFilter) {
        query = query.ilike('where', `%${regionFilter}%`);
      }
      if (styleFilter) {
        query = query.eq('style', styleFilter);
      }
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      // Apply Pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setReports(data || []);
      if (count !== null) setTotalCount(count);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, regionFilter, styleFilter, statusFilter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={24} color="#2E7D52" />
          마을 리포터 제보 관리
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '150px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>지역</label>
          <select 
            value={regionFilter} 
            onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="">전체 지역</option>
            <option value="강진">강진</option>
            <option value="고흥">고흥</option>
            <option value="보성">보성</option>
            <option value="장흥">장흥</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '150px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>제보 형식</label>
          <select 
            value={styleFilter} 
            onChange={(e) => { setStyleFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="">전체 형식</option>
            <option value="중립 보도">중립 보도</option>
            <option value="따뜻한 마을 소식">따뜻한 마을 소식</option>
            <option value="공식 공지문">공식 공지문</option>
            <option value="짧은 단신">짧은 단신</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '150px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>처리 상태</label>
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="">전체 상태</option>
            <option value="new">검토 대기</option>
            <option value="done">처리 완료</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 700, color: '#475569', fontSize: '0.9rem', width: '120px' }}>작성일</th>
              <th style={{ padding: '1rem', fontWeight: 700, color: '#475569', fontSize: '0.9rem', width: '100px' }}>상태</th>
              <th style={{ padding: '1rem', fontWeight: 700, color: '#475569', fontSize: '0.9rem', width: '150px' }}>제보 형식</th>
              <th style={{ padding: '1rem', fontWeight: 700, color: '#475569', fontSize: '0.9rem', width: '120px' }}>지역 (어디서)</th>
              <th style={{ padding: '1rem', fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>제보 요약 (무엇을)</th>
              <th style={{ padding: '1rem', fontWeight: 700, color: '#475569', fontSize: '0.9rem', width: '120px' }}>리포터</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>데이터를 불러오는 중...</td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>조건에 맞는 제보가 없습니다.</td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr 
                  key={report.id} 
                  onClick={() => router.push(`/admin/reports/${report.id}`)}
                  style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                    {new Date(report.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: report.status === 'done' ? '#dcfce7' : '#fef3c7',
                      color: report.status === 'done' ? '#166534' : '#92400e'
                    }}>
                      {report.status === 'done' ? '처리 완료' : '검토 대기'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{report.style}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                    {report.where?.length > 10 ? report.where.substring(0, 10) + '...' : report.where || '-'}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.95rem', color: '#0f172a', fontWeight: 500 }}>
                    {report.what?.length > 30 ? report.what.substring(0, 30) + '...' : report.what}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#475569' }}>{report.sender_name || '익명'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: '0.5rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>{page} / {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: '0.5rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
