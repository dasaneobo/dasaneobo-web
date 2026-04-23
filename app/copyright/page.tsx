import Header from '@/components/Header';

export const metadata = {
  title: '저작권보호정책 - 다산어보',
  description: '다산어보 언론협동조합이 제작한 모든 콘텐츠는 저작권법의 보호를 받습니다.'
};

export default function CopyrightPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #2E7D52', paddingBottom: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>저작권보호정책</h1>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>다산어보 언론협동조합</p>
          </div>

          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '2rem', color: '#555' }}>
              다산어보 언론협동조합은 저작권법을 준수하며, 조합이 제작한 모든 콘텐츠의 저작권을 보호합니다.
            </p>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>1. 저작권 보호 범위</h3>
              <p style={{ marginBottom: '0.5rem' }}>다산어보가 제작·편집한 다음 콘텐츠는 저작권법의 보호를 받습니다.</p>
              <ul style={{ listStyle: 'none', paddingLeft: '0.5rem' }}>
                <li>▸ 기자 및 편집진이 작성한 기사</li>
                <li>▸ 다산어보가 촬영·제작한 사진 및 영상</li>
                <li>▸ 다산어보가 제작한 그래픽·인포그래픽</li>
                <li>▸ 다산어보 로고 및 제호</li>
                <li>▸ 사이트 디자인 및 구성</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>2. 허용되는 이용</h3>
              <p style={{ marginBottom: '0.5rem' }}>다음의 경우 다산어보 콘텐츠를 이용할 수 있습니다.</p>
              <ul style={{ listStyle: 'none', paddingLeft: '0.5rem' }}>
                <li>▸ 개인적·비상업적 목적의 이용</li>
                <li>▸ 출처(다산어보, www.dasaneobo.kr)를 명시한 적절한 인용</li>
                <li>▸ 보도·교육·연구 목적의 정당한 이용</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#D32F2F' }}>3. 금지되는 이용</h3>
              <ul style={{ listStyle: 'none', paddingLeft: '0.5rem' }}>
                <li>▸ 다산어보의 사전 동의 없는 무단 전재·복제·배포</li>
                <li>▸ 상업적 목적의 콘텐츠 이용</li>
                <li>▸ 원문 변형·왜곡</li>
                <li>▸ 출처 미표시 이용</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>4. 저작권 침해 신고</h3>
              <p>
                저작권 침해를 발견하신 경우 아래 연락처로 신고해 주시면 즉시 조치하겠습니다.<br />
                <strong>▸ 이메일:</strong> <a href="mailto:dinoskorea@gmail.com" style={{ color: '#2E7D52' }}>dinoskorea@gmail.com</a><br />
                <strong>▸ 담당:</strong> 편집국
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>5. 외부 콘텐츠 이용</h3>
              <p>
                다산어보는 외부 콘텐츠 이용 시 해당 저작권자의 허락을 받거나 적법한 절차에 따라 이용합니다. 외부 제공 데이터(공공데이터포털, 네이버 API 등)는 각 제공처의 이용약관을 준수합니다.
              </p>
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
