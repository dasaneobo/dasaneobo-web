import Header from '@/components/Header';

export const metadata = {
  title: '이용약관 - 다산어보',
  description: '다산어보 언론협동조합 서비스 이용 조건 및 절차를 안내해 드립니다.'
};

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #2E7D52', paddingBottom: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>이용약관</h1>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>다산어보 언론협동조합</p>
          </div>

          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '1.05rem' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제1조 (목적)</h3>
              <p>이 약관은 다산어보 언론협동조합(이하 '조합')이 운영하는 인터넷신문 다산어보(www.dasaneobo.kr, 이하 '사이트')에서 제공하는 서비스의 이용 조건 및 절차, 이용자와 조합의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제2조 (정의)</h3>
              <p>
                ① '서비스'란 조합이 사이트를 통해 제공하는 뉴스 기사, 정보, 구독 서비스 등 일체를 말합니다.<br />
                ② '이용자'란 이 약관에 따라 조합이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.<br />
                ③ '회원'이란 조합에 개인정보를 제공하여 회원 등록을 한 자로서, 조합의 서비스를 이용할 수 있는 자를 말합니다.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제3조 (약관의 효력 및 변경)</h3>
              <p>
                ① 이 약관은 사이트에 게시함으로써 효력이 발생합니다.<br />
                ② 조합은 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 사이트에 공지함으로써 효력이 발생합니다.<br />
                ③ 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제4조 (서비스 이용)</h3>
              <p>
                ① 서비스 이용은 조합의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 24시간을 원칙으로 합니다.<br />
                ② 조합은 시스템 점검, 보수 등의 사유로 서비스를 일시 중단할 수 있습니다.<br />
                ③ 조합이 제공하는 유료 서비스(구독)의 이용은 별도 규정에 따릅니다.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제5조 (이용자의 의무)</h3>
              <p>
                이용자는 다음 행위를 하여서는 안 됩니다.<br />
                ① 타인의 정보를 도용하거나 허위 정보를 제공하는 행위<br />
                ② 조합의 저작권 등 지식재산권을 침해하는 행위<br />
                ③ 조합 또는 제3자의 명예를 훼손하거나 업무를 방해하는 행위<br />
                ④ 외설·폭력적인 내용을 게시하거나 유포하는 행위
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제6조 (저작권)</h3>
              <p>
                ① 조합이 작성한 기사, 사진, 영상 등 모든 콘텐츠의 저작권은 조합에 귀속됩니다.<br />
                ② 이용자는 조합의 사전 동의 없이 콘텐츠를 복제·배포·방송·전송할 수 없습니다.<br />
                ③ 이용자가 게시한 제보 내용의 저작권은 이용자에게 귀속되나, 조합은 이를 기사 작성에 활용할 수 있습니다.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제7조 (면책조항)</h3>
              <p>
                ① 조합은 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.<br />
                ② 이용자가 게시한 정보의 정확성 및 신뢰성에 대해 조합은 책임을 지지 않습니다.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제8조 (분쟁 해결)</h3>
              <p>이 약관과 관련한 분쟁은 대한민국 법을 적용하며, 분쟁 발생 시 관할 법원은 조합의 소재지를 관할하는 법원으로 합니다.</p>
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
