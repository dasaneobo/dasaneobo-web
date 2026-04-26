'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import "@uiw/react-markdown-preview/markdown.css";
import 'react-quill/dist/quill.snow.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  const isHtml = content.trim().startsWith('<');

  if (isHtml) {
    return (
      <div 
        className="ql-editor"
        style={{ 
          background: 'transparent', 
          fontSize: '1.1rem', 
          lineHeight: '2', 
          color: '#333', 
          fontFamily: '"Nanum Myeongjo", serif' 
        }}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  return (
    <div data-color-mode="light">
      <MarkdownPreview 
        source={content} 
        style={{ 
          background: 'transparent', 
          fontSize: '1.1rem', 
          lineHeight: '2', 
          color: '#333', 
          fontFamily: '"Nanum Myeongjo", serif' 
        }} 
      />
    </div>
  );
}
