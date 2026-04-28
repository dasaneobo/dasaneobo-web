import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: '소개 | 다산어보',
  description: '다산어보는 강진·고흥·보성·장흥 4개 군의 이야기를 직접 쓰는 협동조합 언론입니다.',
  openGraph: {
    title: '소개 | 다산어보',
    description: '다산어보는 강진·고흥·보성·장흥 4개 군의 이야기를 직접 쓰는 협동조합 언론입니다.',
  }
};

export default function AboutPage() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Header />
      
      {/* 1. 히어로 섹션 */}
      <section className="about-hero">
        <div className="container" style={{ maxWidth: '900px' }}>
          <small className="hero-hanja-decor">茶山語報</small>
          <h1 className="hero-headline">
            강진·고흥·보성·장흥 4개 군의 이야기를,<br/>
            직접 씁니다.
          </h1>
          <div className="hero-wordmark">
            <span className="hangul">다산어보</span>
            <span className="hanja">茶山語報</span>
          </div>
          <p className="hero-subtext">
            다산어보는 시민이 함께 만드는 협동조합 언론입니다.<br/>
            광고주·정치 세력·자본의 압력에 굴하지 않고,<br/>
            시민의 말을 듣고 시민의 이야기를 전합니다.
          </p>
        </div>
      </section>

      {/* 2. 왜 만들었나 섹션 */}
      <section className="about-section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">왜 다산어보를 만들었나</h2>
          
          <div className="why-grid">
            <div className="why-card">
              <div className="why-number">1</div>
              <h3>서울 편중</h3>
              <p>전국 뉴스는 서울 이야기로 가득합니다.<br/>지역의 일은 지역 매체에서도 찾기 어렵습니다.</p>
            </div>
            <div className="why-card">
              <div className="why-number">2</div>
              <h3>포털 부재</h3>
              <p>포털에서는 우리 4개 군 소식이 검색되지 않거나,<br/>외부 매체의 짧은 토막 기사로만 보입니다.</p>
            </div>
            <div className="why-card">
              <div className="why-number">3</div>
              <h3>보도자료 그대로</h3>
              <p>군청 보도자료가 여과 없이 그대로 올라옵니다.<br/>행정의 시각이 곧 매체의 시각이 됩니다.</p>
            </div>
            <div className="why-card">
              <div className="why-number">4</div>
              <h3>불편한 진실 외면</h3>
              <p>지역의 불편한 진실은 외면받기 일쑤입니다.<br/>누구도 책임지지 않는 사안이 쌓여갑니다.</p>
            </div>
          </div>

          <div className="why-conclusion">
            <p><strong>전문 기자만 매체를 쓰던 시대는 끝났습니다.</strong><br/>
            농민도, 교사도, 자영업자도, 어부도, 학생도<br/>
            — 동네에서 일어난 일을 가장 먼저 보고 가장 잘 아는 사람이<br/>
            직접 알릴 수 있는 시대입니다.</p>
            <p className="mt-4">다산어보는 그 가능성을 지역 매체 운영의 중심에 둡니다.<br/>
            시민의 말을 듣고, 사실을 확인해, 시민에게 알립니다.</p>
          </div>
        </div>
      </section>

      {/* 3. 매체명 섹션 */}
      <section className="about-section bg-gray">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">다산어보 <span className="title-hanja">茶山語報</span></h2>
          <div className="name-content">
            <p>다산어보는 한자로 <strong>茶山語報</strong>라 적습니다.<br/>
            「語」는 말씀, 「報」는 알림 — 다산 정약용 선생이 강진에서<br/>
            18년간 백성의 삶을 기록하고 잘못된 것을 바로잡았던 그 정신으로,<br/>
            다산어보는 누구의 말에도 귀 기울이고 듣는 독립언론입니다.</p>
            
            <p className="mt-4">
            「報」는 한국 언론 전통의 글자입니다.<br/>
            조선 시대의 朝報(조보), 1883년 한국 최초 신문 漢城旬報(한성순보),<br/>
            오늘날의 「日報」가 모두 「알린다」는 뜻의 報를 씁니다.<br/>
            다산어보는 <span className="hanja-highlight">譜</span>(족보·도감)가 아닌 <span className="hanja-highlight">報</span>(알림) — 정보를 모으는 매체가 아니라,<br/>
            시민에게 사실을 알리는 매체입니다.</p>
          </div>
        </div>
      </section>

      {/* 4. 운영 모델 섹션 */}
      <section className="about-section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">협동조합 언론</h2>
          <p className="model-intro">
            다산어보는 「다산어보 언론협동조합」 형태로 운영됩니다.<br/>
            조합원이 곧 매체의 주인이며, 어떤 외부 자본도 다산어보를 소유하지 않습니다.<br/>
            2026년 4월 30일 강진군에서 창립한 신생 협동조합 매체입니다.
          </p>

          <ol className="model-principles">
            <li>광고주·정치 세력·자본의 압력에 굴하지 않습니다</li>
            <li>기초지자체 광고에 의존하지 않습니다 (편집권 보장)</li>
            <li>운영 잉여금은 입점 생산자 환원·언론 활동·마을 리포터 지원에 우선 사용합니다</li>
            <li>모든 보도·편집 활동은 「편집윤리규정」(35조 + 보강 7조)을 따릅니다</li>
            <li>마을 리포터 등 시민 제보를 매체 운영의 중심에 둡니다</li>
          </ol>

          <div className="mt-6">
            <Link href="/ethics-code" className="text-link">→ 편집윤리규정 보기</Link>
          </div>
        </div>
      </section>

      {/* 5. 인사말 섹션 */}
      <section className="about-section bg-gray">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">인사말</h2>
          <div className="greeting-grid">
            <div className="greeting-card">
              <h3 className="greeting-name">강상우 <span className="greeting-role">· 발행인 겸 이사장</span></h3>
              <p className="greeting-text">
                [발행인 인사말 작성 대기 중]<br/>
                독자 여러분, 안녕하십니까. 다산어보는 강진·고흥·보성·장흥의 목소리를 대변하기 위해 출발한 시민 참여형 협동조합 매체입니다. 지역의 생생한 이야기를 담아내고, 시민과 함께 성장하는 따뜻한 언론이 되겠습니다.
              </p>
            </div>
            <div className="greeting-card">
              <h3 className="greeting-name">이득규 <span className="greeting-role">· 편집국장 겸 청소년보호책임자</span></h3>
              <p className="greeting-text">
                [편집국장 인사말 작성 대기 중]<br/>
                지역의 숨겨진 이야기와 행정의 사각지대를 시민의 시선에서 짚어보려 합니다. 가장 가까운 이웃의 평범하지만 특별한 이야기를 매일 전하며, 누구도 소외되지 않는 정보망을 구축하겠습니다. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 조직 섹션 */}
      <section className="about-section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">조직</h2>
          <div className="org-table-wrapper">
            <table className="org-table">
              <tbody>
                <tr>
                  <th>발행인·이사장</th>
                  <td>강상우</td>
                </tr>
                <tr>
                  <th>편집국장·편집인</th>
                  <td>이득규</td>
                </tr>
                <tr>
                  <th>청소년보호책임자</th>
                  <td>이득규</td>
                </tr>
                <tr>
                  <th>조합원</th>
                  <td>창립 조합원 6인: 강상우(이사장), 이득규(편집국장) 외 4인</td>
                </tr>
                <tr>
                  <th>법인명</th>
                  <td>다산어보 언론협동조합</td>
                </tr>
                <tr>
                  <th>사업장</th>
                  <td>전남 강진군</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. 연혁 섹션 */}
      <section className="about-section bg-gray">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">연혁</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2026년 초</div>
              <div className="timeline-content">매체 기획 · 웹사이트 개발 · 조합원 모집</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2026.4.23</div>
              <div className="timeline-content">창립총회 공고 (강진군)</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2026.4.30</div>
              <div className="timeline-content">창립총회 → 다산어보 언론협동조합 창립 → 창간</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">이후</div>
              <div className="timeline-content">인터넷신문 등록 (전남도청) · 마을 리포터 정식 모집 · 첫 호 발행</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 함께하는 방법 섹션 */}
      <section className="about-section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">함께하는 방법</h2>
          <div className="join-grid">
            <Link href="/subscribe" className="join-card">
              <div className="join-icon">1</div>
              <h3>구독</h3>
              <p>월 1만원 / 연 10만원 / 평생 100만원 (창간 후원인)</p>
            </Link>
            <Link href="/" className="join-card">
              <div className="join-icon">2</div>
              <h3>조합원 가입</h3>
              <p>출자금 100만원, 매체 운영 의결권</p>
            </Link>
            <Link href="/reporter-apply" className="join-card">
              <div className="join-icon">3</div>
              <h3>마을 리포터</h3>
              <p>동네 일을 알려주는 등록 통신원 (글쓰기 부담 0)</p>
            </Link>
            <Link href="/report" className="join-card">
              <div className="join-icon">4</div>
              <h3>기사 제보</h3>
              <p>익명 가능 · 1회성 · 5분</p>
            </Link>
            <Link href="/" className="join-card">
              <div className="join-icon">5</div>
              <h3>광고 문의</h3>
              <p>다산어보의 가치에 부합하는 광고</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. 연락처 섹션 */}
      <section className="about-section bg-gray">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">연락처</h2>
          <div className="contact-info">
            <p><strong>사업장</strong> · 전남 강진군 (정식 등록 후 상세 주소 안내)</p>
            <p><strong>편집 문의</strong> · editor@dasaneobo.kr</p>
            <p><strong>제보·언론</strong> · press@dasaneobo.kr</p>
            <p><strong>사이트</strong> · www.dasaneobo.kr</p>
            <p className="mt-4 text-sm" style={{ color: '#64748b' }}>※ 정식 등록 후 대표전화 안내 예정</p>
          </div>
        </div>
      </section>

      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
        /* Common */
        .bg-white { background: #ffffff; }
        .bg-gray { background: #f8fafc; }
        .about-section { padding: 5rem 0; }
        .section-heading { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 2.5rem; font-family: 'Nanum Myeongjo', serif; }
        .text-link { color: #1F5946; font-weight: 600; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
        .text-link:hover { opacity: 0.8; }
        
        /* 1. Hero */
        .about-hero { padding: 6rem 0 5rem; background: #1F5946; color: #fff; text-align: center; }
        .hero-hanja-decor { display: block; font-size: 1.2rem; opacity: 0.4; letter-spacing: 0.5rem; margin-bottom: 1rem; font-family: 'Batang', serif; }
        .hero-headline { font-size: 2.6rem; font-weight: 800; line-height: 1.4; margin-bottom: 2rem; color: #fff; letter-spacing: -1px; }
        .hero-wordmark { margin-bottom: 2.5rem; display: inline-flex; align-items: baseline; gap: 0.5rem; background: rgba(255,255,255,0.1); padding: 0.5rem 1.2rem; border-radius: 50px; }
        .hero-wordmark .hangul { font-weight: 700; font-size: 1.1rem; }
        .hero-wordmark .hanja { font-family: 'Batang', serif; font-size: 1rem; opacity: 0.8; }
        .hero-subtext { font-size: 1.2rem; line-height: 1.8; opacity: 0.9; }

        /* 2. Why */
        .why-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .why-card { background: #f1f5f9; padding: 2rem; border-radius: 12px; }
        .why-number { width: 32px; height: 32px; background: #1F5946; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 1rem; }
        .why-card h3 { font-size: 1.2rem; font-weight: 700; color: #14322A; margin-bottom: 0.8rem; }
        .why-card p { color: #3A4A42; line-height: 1.6; margin: 0; font-size: 0.95rem; }
        .why-conclusion { background: #e6f0ed; padding: 2.5rem; border-radius: 12px; color: #14322A; line-height: 1.8; font-size: 1.1rem; border-left: 4px solid #1F5946; }

        /* 3. Name */
        .title-hanja { font-family: 'Batang', serif; font-size: 2rem; color: rgba(20, 50, 42, 0.7); font-weight: 400; margin-left: 0.5rem; }
        .name-content { font-size: 1.1rem; line-height: 1.8; color: #3A4A42; }
        .hanja-highlight { font-family: 'Batang', serif; font-size: 1.3em; font-weight: bold; color: #1F5946; padding: 0 2px; }

        /* 4. Model */
        .model-intro { font-size: 1.1rem; line-height: 1.8; color: #334155; margin-bottom: 2rem; }
        .model-principles { padding-left: 1.5rem; }
        .model-principles li { margin-bottom: 0.8rem; font-size: 1.05rem; color: #1e293b; line-height: 1.6; }

        /* 5. Greeting */
        .greeting-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .greeting-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .greeting-name { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; }
        .greeting-role { font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .greeting-text { color: #475569; line-height: 1.8; margin: 0; }

        /* 6. Org */
        .org-table-wrapper { background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .org-table { width: 100%; border-collapse: collapse; text-align: left; }
        .org-table th { padding: 1.2rem; background: #f1f5f9; color: #334155; font-weight: 600; width: 30%; border-bottom: 1px solid #e2e8f0; }
        .org-table td { padding: 1.2rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; }
        .org-table tr:last-child th, .org-table tr:last-child td { border-bottom: none; }

        /* 7. Timeline */
        .timeline { border-left: 2px solid #cbd5e1; padding-left: 2rem; margin-left: 1rem; }
        .timeline-item { position: relative; margin-bottom: 2rem; }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-item::before { content: ''; position: absolute; left: -2.4rem; top: 0.4rem; width: 12px; height: 12px; border-radius: 50%; background: #1F5946; border: 3px solid #f8fafc; }
        .timeline-date { font-weight: 700; color: #1F5946; margin-bottom: 0.3rem; font-size: 1.1rem; }
        .timeline-content { color: #334155; font-size: 1.05rem; line-height: 1.6; }

        /* 8. Join */
        .join-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
        .join-card { display: block; background: #f8fafc; padding: 1.5rem; border-radius: 12px; text-decoration: none; border: 1px solid #e2e8f0; transition: all 0.2s; }
        .join-card:hover { border-color: #1F5946; transform: translateY(-3px); box-shadow: 0 4px 12px rgba(31,89,70,0.1); }
        .join-icon { width: 28px; height: 28px; background: #e2e8f0; color: #475569; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; margin-bottom: 1rem; }
        .join-card:hover .join-icon { background: #1F5946; color: white; }
        .join-card h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
        .join-card p { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0; }

        /* 9. Contact */
        .contact-info p { margin: 0 0 0.8rem; font-size: 1.05rem; color: #334155; }
        .contact-info strong { color: #1e293b; display: inline-block; width: 80px; }

        /* Utilities */
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .text-sm { font-size: 0.9rem; }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-headline { font-size: 1.8rem; }
          .why-grid { grid-template-columns: 1fr; }
          .greeting-grid { grid-template-columns: 1fr; }
          .join-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .join-grid { grid-template-columns: 1fr; }
          .org-table th, .org-table td { display: block; width: 100%; padding: 0.8rem; }
          .org-table th { background: transparent; padding-bottom: 0; color: #64748b; font-size: 0.9rem; }
          .org-table td { border-bottom: 1px solid #e2e8f0; padding-top: 0.3rem; }
        }
      `}} />
    </main>
  );
}
