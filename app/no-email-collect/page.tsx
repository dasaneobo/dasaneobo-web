import Header from '@/components/Header';

export const metadata = {
  title: '이메일주소 무단수집 거부 - 다산어보',
  description: '다산어보는 정보통신망법에 따라 이메일 주소의 무단 수집 및 유통을 엄격히 금지합니다.'
};

export default function NoEmailCollectPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #2E7D52', paddingBottom: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>이메일주소 무단수집 거부</h1>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>다산어보 언론협동조합</p>
          </div>

          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '1.05rem' }}>
            <div style={{ background: '#fff9db', padding: '1.5rem', borderRadius: '8px', marginBottom: '2.5rem', borderLeft: '5px solid #fcc419' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>
                본 사이트에 게시된 이메일주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해 형사처벌됨을 유념하시기 바랍니다.
              </p>
            </div>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.2rem', color: '#2E7D52' }}>관련 법령</h3>
              <p style={{ fontWeight: 600, marginBottom: '0.8rem', color: '#555' }}>
                정보통신망 이용촉진 및 정보보호 등에 관한 법률 제50조의2(전자우편주소의 무단 수집행위 등 금지)
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: '0.5rem', color: '#444' }}>
                <li style={{ marginBottom: '0.8rem' }}>▸ 누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니 됩니다.</li>
                <li style={{ marginBottom: '0.8rem' }}>▸ 위의 규정을 위반하여 수집된 전자우편주소를 판매·유통하여서는 아니 됩니다.</li>
                <li style={{ marginBottom: '0.8rem' }}>▸ 수집·판매 및 유통이 금지된 전자우편주소임을 알면서 이를 정보 전송에 이용하여서는 아니 됩니다.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#D32F2F' }}>위반 시 처벌</h3>
              <p>
                위 규정을 위반할 경우 <strong>정보통신망법 제74조</strong>에 따라 1천만 원 이하의 벌금에 처해질 수 있습니다.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>문의</h3>
              <p>
                <strong>▸ 이메일:</strong> <a href="mailto:dinoskorea@gmail.com" style={{ color: '#2E7D52' }}>dinoskorea@gmail.com</a><br />
                <strong>▸ 다산어보 언론협동조합 편집국</strong>
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
