'use client';

import React from 'react';
// import dynamic from 'next/dynamic';
// import 'react-quill/dist/quill.snow.css';

// const ReactQuill = dynamic(() => import('react-quill'), {
//   ssr: false,
//   loading: () => <div style={{ height: '600px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee', borderRadius: '8px' }}>에디터를 불러오는 중...</div>,
// });

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: EditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', height: '550px', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '3rem', fontSize: '1rem' }}
      placeholder="기사 내용을 입력하세요..."
    />
  );
}
