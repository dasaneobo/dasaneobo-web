import Header from '@/components/Header';

export const metadata = {
  title: '개인정보처리방침 - 다산어보',
  description: '다산어보 언론협동조합은 이용자의 개인정보를 소중히 보호합니다.'
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #2E7D52', paddingBottom: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>개인정보처리방침</h1>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.1rem' }}>다산어보 언론협동조합</p>
          </div>

          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '2rem', color: '#555' }}>
              다산어보 언론협동조합(이하 '조합')은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
            </p>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제1조 (개인정보의 처리 목적)</h3>
              <p>
                조합은 다음의 목적을 위하여 개인정보를 처리합니다.<br />
                ① 회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공<br />
                ② 구독 서비스 제공: 정기구독 신청, 결제, 신문 발송<br />
                ③ 마을 리포터 관리: 리포터 신청 및 활동 관리<br />
                ④ 제보 접수: 기사 제보 내용 처리 및 취재<br />
                ⑤ 민원처리: 불만 처리 등 민원 업무
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제2조 (개인정보의 처리 및 보유기간)</h3>
              <p>
                ① 조합은 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시 동의받은 기간 내에서 개인정보를 처리·보유합니다.<br />
                ② 회원 가입 및 관리: 회원 탈퇴 시까지<br />
                ③ 구독 정보: 구독 종료 후 5년<br />
                ④ 제보 내용: 기사 게재 후 3년
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제3조 (수집하는 개인정보 항목)</h3>
              <p>
                ① 회원 가입: 이름, 이메일, 비밀번호, 연락처<br />
                ② 구독 신청: 이름, 주소, 연락처, 이메일<br />
                ③ 마을 리포터 신청: 이름, 연락처, 이메일, 거주지역<br />
                ④ 제보: 이름, 연락처, 제보 내용<br />
                ⑤ 자동 수집: 접속 IP, 쿠키, 접속 일시
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제4조 (개인정보의 제3자 제공)</h3>
              <p>
                조합은 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.<br />
                ① 이용자가 사전에 동의한 경우<br />
                ② 법령에 의거하거나 수사기관이 적법한 절차에 따라 요청한 경우
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제5조 (개인정보의 파기)</h3>
              <p>
                ① 조합은 개인정보 보유기간이 경과하거나 처리목적이 달성된 경우 지체 없이 파기합니다.<br />
                ② 전자파일: 복구 불가능한 방법으로 영구 삭제<br />
                ③ 출력물: 분쇄 또는 소각
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제6조 (이용자의 권리)</h3>
              <p>
                이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 요청은 <a href="mailto:dinoskorea@gmail.com" style={{ color: '#2E7D52', fontWeight: 600 }}>dinoskorea@gmail.com</a>으로 연락하시기 바랍니다.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#2E7D52' }}>제7조 (개인정보 보호책임자)</h3>
              <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '4px' }}>
                <p><strong>성명:</strong> 강상우</p>
                <p><strong>직책:</strong> 이사장</p>
                <p><strong>연락처:</strong> 010-6227-8966</p>
              </div>
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
