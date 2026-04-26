'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => <div style={{ height: '600px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee', borderRadius: '8px' }}>에디터를 불러오는 중...</div>,
});

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: EditorProps) {
  return (
    <div className="rich-text-editor">
      <SunEditor
        setContents={value}
        onChange={onChange}
        setOptions={{
          height: '600px',
          buttonList: [
            ['undo', 'redo'],
            ['formatBlock', 'fontColor', 'hiliteColor'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['removeFormat'],
            ['list', 'align', 'horizontalRule', 'table'],
            ['link', 'image', 'video'],
            ['fullScreen', 'showBlocks', 'codeView'],
            ['preview', 'print']
          ],
          lang: 'ko'
        }}
      />
    </div>
  );
}
