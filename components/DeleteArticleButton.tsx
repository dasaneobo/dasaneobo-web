'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteArticleButton({ articleId }: { articleId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // 확인 후 삭제 (모달이 차단되었을 수 있으므로 기본 confirm 제거하고 즉시 삭제 진행)
    setLoading(true);
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);
    
    setLoading(false);

    if (error) {
      console.error(error);
      alert('삭제 중 오류가 발생했습니다: ' + error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: '#ffebee',
        border: '1px solid #ffcdd2',
        color: '#c62828',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '0.85rem',
        opacity: loading ? 0.7 : 1
      }}
    >
      <Trash2 size={14} /> {loading ? '삭제 중...' : '기사 삭제'}
    </button>
  );
}
