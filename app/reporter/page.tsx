import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function ReporterPage() {
  return (
    <main>
      <Header />
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div style={{ background: '#f8fafc', padding: '3rem', borderRadius: '12px', marginBottom: '3rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-dark)', marginBottom: '1rem' }}>다산어보 리포터 수첩</h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            지역 주민들이 직접 발로 뛰어 기록한 생생한 마을 소식입니다. 
            다산어보 리포터들은 지역의 투명성을 높이고 이웃의 이야기를 전하는 독립 보도의 주역입니다.
          </p>
        </div>
      </div>
      <NewspaperLayout title="리포터 수첩" type="category" value="리포터" />
      <Footer />
    </main>
  );
}
