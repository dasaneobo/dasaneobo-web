import Header from '@/components/Header';

export const metadata = {
  title: '청소년보호정책 - 다산어보',
  description: '다산어보 언론협동조합은 청소년의 건전한 성장을 위해 유해정보 차단 및 보호정책을 준수합니다.'
};

export default function YouthPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #2E7D52', paddingBottom: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>청소년보호정책</h1>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>다산어보 언론협동조합</p>
          </div>

          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '2rem', color: '#555' }}>
              다산어보 언론협동조합은 청소년보호법에 따라 청소년에게 유해한 정보가 유통되지 않도록 다음과 같은 청소년보호정책을 운영합니다.
            </p>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52', borderLeft: '4px solid #2E7D52', paddingLeft: '1rem' }}>1. 청소년보호책임자</h3>
              <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                <p><strong>▸ 성명:</strong> 강상우</p>
                <p><strong>▸ 직책:</strong> 이사장 (청소년보호책임자 겸임)</p>
                <p><strong>▸ 연락처:</strong> 010-6227-8966</p>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52', borderLeft: '4px solid #2E7D52', paddingLeft: '1rem' }}>2. 청소년 유해정보 차단</h3>
              <p style={{ marginBottom: '0.5rem' }}>다산어보는 다음과 같은 유해 정보가 게시되지 않도록 관리합니다.</p>
              <ul style={{ listStyle: 'none', paddingLeft: '0.5rem' }}>
                <li>▸ 음란·폭력적 콘텐츠</li>
                <li>▸ 도박·사행성 콘텐츠</li>
                <li>▸ 마약·약물 관련 유해 정보</li>
                <li>▸ 청소년의 건전한 성장을 저해하는 내용</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52', borderLeft: '4px solid #2E7D52', paddingLeft: '1rem' }}>3. 유해정보 신고 및 처리</h3>
              <p>
                유해 정보를 발견하신 경우 <a href="mailto:dinoskorea@gmail.com" style={{ color: '#2E7D52', fontWeight: 600 }}>dinoskorea@gmail.com</a>으로 신고해 주시면 즉시 검토 후 처리하겠습니다.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52', borderLeft: '4px solid #2E7D52', paddingLeft: '1rem' }}>4. 청소년 보호를 위한 서비스 운영</h3>
              <ul style={{ listStyle: 'none', paddingLeft: '0.5rem' }}>
                <li>▸ 회원 가입 시 연령 확인</li>
                <li>▸ 유해 콘텐츠 접근 제한</li>
                <li>▸ 정기적인 콘텐츠 모니터링</li>
              </ul>
            </section>

            <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
              <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>시행일: 2026년 4월 30일</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 800, fontSize: '1.3rem' }}>다산어보 언론협동조합</p>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#999', fontSize: '0.9rem' }}>
        © 2026 다산어보 All rights reserved.
      </footer>
    </main>
  );
}
