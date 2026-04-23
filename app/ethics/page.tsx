import fs from 'fs';
import path from 'path';
import Header from '@/components/Header';
import PrintButton from './PrintButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';
import './ethics.css';

export const metadata = {
  title: '편집 윤리규정 - 다산어보',
  description: '다산어보는 투명하고 공정한 보도를 위해 편집 윤리규정을 준수합니다.'
};

export default async function EthicsPage() {
  // Read markdown file from the root directory
  const filePath = path.join(process.cwd(), 'CLAUDE.md');
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    fileContent = '윤리규정을 불러오지 못했습니다. (CLAUDE.md 파일을 찾을 수 없습니다.)';
  }

  return (
    <main className="ethics-page">
      <Header />
      
      <div className="container ethics-container">
        <div className="ethics-paper">
          <div className="ethics-header">
            <div className="header-text">
              <div className="subtitle">다산어보는 아래 윤리규정을 준수합니다</div>
              <h1 className="title">편집 윤리규정</h1>
            </div>
            <div className="print-action">
              <PrintButton />
            </div>
          </div>

          <div className="ethics-content">
            <MarkdownRenderer content={fileContent} />
          </div>
          
          <div className="ethics-footer-stamp" style={{ justifyContent: 'center', marginTop: '4rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>다산어보 언론협동조합 이사장</span>
          </div>
        </div>
      </div>

      <footer className="ethics-page-footer">
        © 2026 다산어보 All rights reserved. <br/>
        본 윤리규정은 인터넷신문위원회 자율심의 규정을 바탕으로 제정되었습니다.
      </footer>

      {/* Since this is a server component, we need global logic for styling via an external css or embedded global style, 
          but Next.js doesn't support styled-jsx in server components easily unless client component. 
          We'll add a link to an external CSS or use pure global css trick. */}
    </main>
  );
}
