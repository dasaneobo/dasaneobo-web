'use client';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  Image as ImageIcon, Type, Palette, Undo, Redo, AlignLeft, 
  AlignCenter, AlignRight 
} from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('URL을 입력하세요');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="tiptap-menu-bar" style={{ 
      display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '10px', 
      background: '#f1f3f5', borderBottom: '1px solid #ddd',
      borderTopLeftRadius: '8px', borderTopRightRadius: '8px' 
    }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('bold'))} title="굵게"><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('italic'))} title="기울임"><Italic size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('heading', { level: 1 }))} title="제목1">H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('heading', { level: 2 }))} title="제목2">H2</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('heading', { level: 3 }))} title="제목3">H3</button>
      
      <div style={{ width: '1px', background: '#ddd', margin: '0 5px' }} />
      
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('bulletList'))} title="글머리 기호"><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('orderedList'))} title="번호 매기기"><ListOrdered size={16} /></button>
      
      <div style={{ width: '1px', background: '#ddd', margin: '0 5px' }} />
      
      <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''} type="button" style={buttonStyle(editor.isActive('link'))} title="링크"><LinkIcon size={16} /></button>
      <button onClick={addImage} type="button" style={buttonStyle(false)} title="이미지"><ImageIcon size={16} /></button>
      
      <div style={{ width: '1px', background: '#ddd', margin: '0 5px' }} />
      
      <input 
        type="color" 
        onInput={(event: any) => editor.chain().focus().setColor(event.target.value).run()} 
        value={editor.getAttributes('textStyle').color || '#000000'}
        style={{ width: '30px', height: '30px', padding: 0, border: 'none', cursor: 'pointer' }}
        title="글자 색상"
      />

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
        <button onClick={() => editor.chain().focus().undo().run()} type="button" style={buttonStyle(false)} title="실행 취소"><Undo size={16} /></button>
        <button onClick={() => editor.chain().focus().redo().run()} type="button" style={buttonStyle(false)} title="다시 실행"><Redo size={16} /></button>
      </div>
    </div>
  );
};

const buttonStyle = (isActive: boolean) => ({
  background: isActive ? '#e9ecef' : 'transparent',
  border: 'none',
  borderRadius: '4px',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: isActive ? '#000' : '#495057',
  fontWeight: 'bold',
  minWidth: '32px'
});

export default function RichTextEditor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep content in sync when value changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      minHeight: '600px', 
      display: 'flex', 
      flexDirection: 'column',
      marginBottom: '3rem'
    }}>
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        style={{ 
          flex: 1, 
          padding: '20px', 
          overflowY: 'auto',
          outline: 'none'
        }} 
        className="tiptap-content"
      />
      <style jsx global>{`
        .tiptap-content .ProseMirror {
          min-height: 500px;
          outline: none;
        }
        .tiptap-content p { margin: 1em 0; }
        .tiptap-content ul, .tiptap-content ol { padding-left: 1.5em; }
        .tiptap-content img { max-width: 100%; height: auto; border-radius: 4px; }
        .tiptap-content a { color: var(--primary-dark); text-decoration: underline; }
        .tiptap-content h1 { font-size: 1.8em; margin-bottom: 0.5em; }
        .tiptap-content h2 { font-size: 1.5em; margin-bottom: 0.4em; }
        .tiptap-content h3 { font-size: 1.3em; margin-bottom: 0.3em; }
      `}</style>
    </div>
  );
}
