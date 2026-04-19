'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    role: string;
  };
}

export default function Comments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndComments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);

      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (name, role)
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (data) setComments(data as any);
    };

    fetchUserAndComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { 
          article_id: articleId, 
          user_id: currentUser.id, 
          content: newComment.trim() 
        }
      ])
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (name, role)
      `)
      .single();

    if (error) {
      alert('댓글 등록 실패: ' + error.message);
    } else if (data) {
      setComments([...comments, data as any]);
      setNewComment('');
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  return (
    <section style={{ marginTop: '4rem', padding: '2rem', borderTop: '1px solid #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
        <MessageSquare size={22} color="var(--primary-dark)" />
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>독자 한마디 ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
        <div style={{ position: 'relative' }}>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={currentUser ? "비방, 욕설보다는 따뜻한 응원을 남겨주세요." : "로그인 후 댓글을 남기실 수 있습니다."}
            disabled={!currentUser}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1rem',
              borderRadius: '8px',
              border: '2px solid #f0f0f0',
              outline: 'none',
              fontSize: '1rem',
              resize: 'none',
              background: currentUser ? 'white' : '#f8f9fa'
            }}
          />
          <button 
            type="submit"
            disabled={loading || !currentUser || !newComment.trim()}
            style={{
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              background: 'var(--primary-dark)',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: (loading || !currentUser || !newComment.trim()) ? 0.6 : 1
            }}
          >
            <Send size={16} /> 등록
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ width: '40px', height: '40px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={20} color="#888" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', marginRight: '0.6rem' }}>{comment.profiles?.name || '익명'}</span>
                  <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(comment.created_at).toLocaleString('ko-KR')}</span>
                </div>
                {currentUser?.id === comment.user_id && (
                  <button onClick={() => handleDelete(comment.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '1rem', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#bbb', background: '#fcfcfc', borderRadius: '8px', border: '1px dashed #eee' }}>
            첫 번째 댓글을 남겨보세요!
          </div>
        )}
      </div>
    </section>
  );
}
