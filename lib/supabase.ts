import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export type Article = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
  author_id?: string;
  status: 'draft' | 'published';
  category: string;
  view_count?: number;
};

export type Draft = {
  id: string;
  created_at: string;
  reporter_name: string;
  raw_content: string;
  status: 'pending' | 'reviewed' | 'converted';
};
export type Profile = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'reporter' | 'normal';
  recommender?: string;
  created_at?: string;
};
