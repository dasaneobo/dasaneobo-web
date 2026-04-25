
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ViewCounter({ articleId }: { articleId: string }) {
  useEffect(() => {
    const incrementView = async () => {
      // We use a simple update here. For better performance and to avoid race conditions,
      // a database function (RPC) is recommended:
      // await supabase.rpc('increment_article_views', { article_id: articleId });
      
      try {
        // First, fetch current view count
        const { data } = await supabase
          .from('articles')
          .select('view_count')
          .eq('id', articleId)
          .single();
        
        const currentViews = data?.view_count || 0;
        
        // Then increment
        await supabase
          .from('articles')
          .update({ view_count: currentViews + 1 })
          .eq('id', articleId);
      } catch (e) {
        console.error('Error incrementing view count:', e);
      }
    };

    if (articleId) {
      incrementView();
    }
  }, [articleId]);

  return null; // This component doesn't render anything
}
