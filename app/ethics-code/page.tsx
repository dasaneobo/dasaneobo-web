import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '편집윤리규정 | 다산어보 언론협동조합',
  description: '다산어보 언론협동조합의 편집윤리규정. 독립 협동조합 언론의 정신을 지키기 위한 7개 장 36개 조의 편집·취재·보도 윤리 원칙.',
};

export default function EthicsCodePage() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '850px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#2E7D52', fontWeight: 800, marginBottom: '0.5rem' }}>다산어보 언론협동조합</h2>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#111', margin: '0 0 1rem', fontFamily: '"Nanum Myeongjo", serif', letterSpacing: '-1px' }}>편집윤리규정</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>2026년 4월 30일 시행</p>
        </div>

        {/* Intro Box */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #2E7D52', marginBottom: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155', margin: 0, fontWeight: 500 }}>
            다산어보 언론협동조합은 전남광주특별시 강진·고흥·보성·장흥 4개 군의 목소리를 담는 시민의 언론입니다. 
            우리는 광고주·정치 세력·자본의 압력에 굴하지 않으며, 사실에 기반하여 약자·소수자의 편에 서고, 
            지역 공동체의 알 권리를 가장 앞에 둡니다. 협동조합 언론은 누구의 소유물도 아니며, 
            조합원과 독자가 함께 만드는 공유 자산입니다.
          </p>
        </div>

        {/* TOC */}
        <div style={{ background: '#f1f5f9', padding: '1.5rem 2rem', borderRadius: '8px', marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b' }}>목차</h3>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', padding: 0, margin: 0, listStyle: 'none' }}>
            <li><a href="#chap1" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>제1장 총칙</a></li>
            <li><a href="#chap2" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>제2장 편집권의 독립</a></li>
            <li><a href="#chap3" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>제3장 보도의 원칙</a></li>
            <li><a href="#chap4" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>제4장 취재의 원칙</a></li>
            <li><a href="#chap5" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>제5장 부대사업과 편집의 분리</a></li>
            <li><a href="#chap6" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>제6장 정정·반론·고충 처리</a></li>
            <li><a href="#chap7" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>제7장 윤리위원회 및 위반 시 조치</a></li>
            <li><a href="#add" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>부칙</a></li>
          </ul>
        </div>

        {/* Body Content */}
        <div className="ethics-content" style={{ background: 'white', padding: '3rem 4rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
          
          <section id="chap1">
            <h2>제1장 총칙</h2>
            <div className="article">
              <span className="article-title">제1조 (목적)</span>
              <p>이 규정은 본 조합의 모든 보도·편집 활동이 사실에 기반하고 공정하며, 외부 압력에 굴하지 않는 독립 협동조합 언론의 정신을 지키도록 한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제2조 (적용 대상)</span>
              <p>편집국장, 기자, 마을 리포터, 외부 기고자, 보도에 관여하는 임원에게 적용한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제3조 (기본 정신)</span>
              <p>사실 우선, 약자·소수자 우선, 독립, 균형, 지역성, 협동조합의 6대 원칙을 준수한다.</p>
            </div>
          </section>

          <section id="chap2">
            <h2>제2장 편집권의 독립</h2>
            <div className="article">
              <span className="article-title">제5조 (편집권 보장)</span>
              <p>편집권은 편집국장에게 있다. 이사장 및 임원은 개별 보도에 사전·사후 지시·압력을 행사하지 않는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제6조 (외부 압력 거부)</span>
              <p>광고주의 우호적 보도 요구, 정치인의 청탁, 행정 기관의 보도 자제 요구를 거부한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제7조 (금품·향응 거부)</span>
              <p>취재 대상자, 광고주, 정치인 등으로부터 금품·향응·접대를 받지 않는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제8조 (이해관계 회피)</span>
              <p>본인·가족·소속 단체의 이해관계가 걸린 사안의 보도를 회피한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제9조 (정치 활동 제한)</span>
              <p>편집국 구성원은 특정 정당 활동·공직 출마·선거 운동을 하지 않는다.</p>
            </div>
          </section>

          <section id="chap3">
            <h2>제3장 보도의 원칙</h2>
            <div className="article">
              <span className="article-title">제10조 (사실 확인)</span>
              <p>모든 보도는 사실에 근거하며, 둘 이상의 방법으로 교차 검증한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제11조 (추측 표현 금지)</span>
              <p>"~로 보인다", "~인 것으로 알려졌다" 등 추측성 표현을 사용하지 않는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제12조 (균형 보도)</span>
              <p>갈등·분쟁 사안은 모든 당사자의 입장을 동등하게 듣는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제13조 (약자·소수자 우선)</span>
              <p>노인·아동·장애인·여성·이주민·빈곤층 등 사회적 약자의 목소리를 우선한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제14조 (혐오 표현 금지)</span>
              <p>성별·연령·장애·인종·종교·직업에 대한 비하 표현을 사용하지 않는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제15조 (자살·자해 보도)</span>
              <p>한국기자협회 「자살보도 권고기준」을 따른다.</p>
            </div>
            <div className="article">
              <span className="article-title">제16조 (재난·사고 보도)</span>
              <p>피해자·유가족의 인격권·사생활을 우선 보호한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제17조 (선거 보도)</span>
              <p>모든 후보자에게 기회를 균등하게 제공하고, 특정 후보를 지지·반대하지 않는다.</p>
            </div>
          </section>

          <section id="chap4">
            <h2>제4장 취재의 원칙</h2>
            <div className="article">
              <span className="article-title">제18조 (정당한 취재 방법)</span>
              <p>신분 명시, 목적 고지, 동의를 구한 인터뷰·녹음·촬영을 한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제19조 (인용의 원칙)</span>
              <p>모든 인용은 큰따옴표로 정확히 표기하고 출처를 명시한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제20조 (취재 동의)</span>
              <p>인터뷰 시 다산어보 소속·취재 목적·녹음·게재 매체에 대한 명시적 동의를 받는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제21조 (개인정보 보호)</span>
              <p>주민등록번호·주소·전화번호 등을 본인 동의 없이 노출하지 않는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제22조 (저작권)</span>
              <p>타인 저작권을 존중하며, 출처 명시와 공정 이용 범위를 지킨다.</p>
            </div>
          </section>

          <section id="chap5">
            <h2>제5장 부대사업과 편집의 분리</h2>
            <div className="article">
              <span className="article-title">제23조 (광고와 편집의 분리)</span>
              <p>광고주의 보도 청탁을 받지 않으며, 광고임을 명확히 표시한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제24조 (다산 마켓 입점 업체 보도)</span>
              <p>입점 업체에 관한 모든 기사에 「본지 마켓 입점 업체」 표시를 의무화한다. 비판 보도가 필요한 경우 거래 관계를 이유로 회피하지 않는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제25조 (협찬·후원)</span>
              <p>협찬 콘텐츠는 협찬 사실을 명시한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제26조 (정부·지자체 광고)</span>
              <p>광고 거래가 비판 보도를 제약하지 않는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제27조 (부대사업 잉여금)</span>
              <p>입점 생산자 환원·언론 활동 지원·마을 리포터 지원 등 공익 목적에 우선 사용한다.</p>
            </div>
          </section>

          <section id="chap6">
            <h2>제6장 정정·반론·고충 처리</h2>
            <div className="article">
              <span className="article-title">제28조 (오류의 정정)</span>
              <p>오류 확인 시 즉시 정정 보도를 한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제29조 (반론권 보장)</span>
              <p>보도 대상자의 반론 요청을 7일 이내에 처리한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제30조 (고충 처리)</span>
              <p>독자·시민의 고충은 editor@dasaneobo.kr로 접수받아 14일 이내 답변한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제31조 (취재원 보호)</span>
              <p>익명을 약속한 취재원의 신원을 어떠한 경우에도 공개하지 않는다.</p>
            </div>
          </section>

          <section id="chap7">
            <h2>제7장 윤리위원회 및 위반 시 조치</h2>
            <div className="article">
              <span className="article-title">제32조 (위원회 설치)</span>
              <p>편집윤리위원회(위원장 1인 + 위원 2~4인)를 둔다.</p>
            </div>
            <div className="article">
              <span className="article-title">제33조 (위원회 권한)</span>
              <p>본 규정 위반 사안 심의 및 조치 결정.</p>
            </div>
            <div className="article">
              <span className="article-title">제34조 (위반 시 조치)</span>
              <p>정도에 따라 「경(구두 주의 + 정정)」 / 「중(서면 경고 + 사과 보도 + 활동 제한)」 / 「대(자격 박탈 + 공개 사과 + 법적 절차)」의 3단계 조치를 취한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제35조 (위반 사안 공개)</span>
              <p>「중」 이상은 익명 처리하여 공개, 「대」는 실명 공개도 가능.</p>
            </div>
            <div className="article">
              <span className="article-title">제36조 (자율 신고와 보호)</span>
              <p>자율 신고자 처분 감경, 내부 고발자 보호.</p>
            </div>
          </section>

          <section id="add" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '8px', marginTop: '3rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 1.5rem', border: 'none', padding: 0 }}>부칙</h2>
            <div className="article" style={{ marginBottom: '1rem' }}>
              <span className="article-title">제1조 (시행일)</span>
              <p>2026년 4월 30일부터 시행.</p>
            </div>
            <div className="article" style={{ marginBottom: '1rem' }}>
              <span className="article-title">제2조 (개정 절차)</span>
              <p>편집윤리위원회 검토 → 편집국 의견 수렴 → 이사회 의결.</p>
            </div>
            <div className="article" style={{ marginBottom: '1rem' }}>
              <span className="article-title">제3조 (윤리위원회 구성 시점)</span>
              <p>조합원 10인 이상 또는 설립등기 후 6개월 시점 중 빠른 시점에 구성. 그 이전에는 편집국장이 잠정 행사.</p>
            </div>
            <div className="article" style={{ marginBottom: 0 }}>
              <span className="article-title">제4조 (적용 사례 축적)</span>
              <p>적용 사례를 매년 사이트에 공개.</p>
            </div>
          </section>
        </div>

        {/* Footer Info */}
        <div style={{ marginTop: '3rem', textAlign: 'right', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8' }}>
          <p style={{ margin: 0 }}>2026년 4월 30일 제정</p>
          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>다산어보 언론협동조합</p>
          <p style={{ margin: 0 }}>편집국장 이득규 / 이사장 강상우</p>
          <p style={{ margin: 0 }}>editor@dasaneobo.kr</p>
        </div>

      </div>

      <Footer />

    </main>
  );
}
