import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_CONFIG } from '@/constants/siteConfig';

export const metadata = {
  title: `환불정책 | ${SITE_CONFIG.name}`,
};

export default function RefundPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <div className="container" style={{ maxWidth: '800px', padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: '#111' }}>
          환불 및 구독 해지 정책
        </h1>
        
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', lineHeight: 1.8, color: '#333' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem' }}>
              1. 청약철회 (구독 취소)
            </h2>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>결제(입금) 후 <strong>7일 이내</strong>에 종이신문이 발송되지 않은 상태라면 전액 환불이 가능합니다.</li>
              <li>이미 첫 종이신문이 발송된 후에는 아래의 '중도 해지' 규정을 따릅니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem' }}>
              2. 중도 해지
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>월간 구독</h3>
              <p style={{ margin: 0 }}>월간 구독은 해지 신청 시 다음 달부터 종이신문 발송이 중단됩니다. 당월 결제분은 이미 신문이 발송되므로 환불되지 않습니다.</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>연간 구독</h3>
              <p style={{ margin: 0 }}>연간 구독 중도 해지 시, 잔여 기간을 일할 계산하여 환불해 드립니다. 단, 이미 송부된 종이신문의 부수만큼 정가(월 10,000원 기준)를 차감한 후 남은 금액을 입금해 드립니다.</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>평생 구독 (창간 후원)</h3>
              <p style={{ margin: 0 }}>평생 구독은 결제 후 14일 이내 청약철회만 가능하며, 지면에 이름이 인쇄되거나 특산물이 발송된 이후에는 환불이 불가합니다.</p>
            </div>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem' }}>
              3. 환불 신청 절차
            </h2>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>환불 및 구독 해지 신청은 이메일 <strong>{SITE_CONFIG.contact.email}</strong> 또는 고객센터(<strong>{SITE_CONFIG.contact.phone}</strong>)로 접수해 주시기 바랍니다.</li>
              <li>신청 확인 후 영업일 기준 7일 이내에 지정하신 계좌로 환불 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem' }}>
              4. 환불 불가 사유
            </h2>
            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
              <li>이용약관을 위반하여 강제 해지된 경우</li>
              <li>허위 정보로 구독을 신청한 경우</li>
              <li>이미 정상적으로 배송된 신문에 대한 부분 환불 요구</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
