import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '편집윤리규정 | 다산어보 언론협동조합',
  description: '다산어보 언론협동조합의 편집윤리규정. 본 강령 및 제1차 보강을 포함한 통합본.',
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
          <p style={{ color: '#64748b', fontSize: '1rem' }}>2026년 4월 30일 시행 (제1차 보강 포함)</p>
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
            <div className="article">
              <span className="article-title">제4조 (본 규정의 공개와 위상) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>① 본 규정은 다산어보 사이트에 상시 공개하며, 모든 조합원·구성원이 접근할 수 있도록 한다.<br/>
              ② 본 규정은 본 조합의 편집·보도와 관련된 다른 내부 규정·관행에 우선한다.<br/>
              ③ 매년 1회 부칙 제4조에 따라 적용 사례를 점검하고 사이트에 공개한다.</p>
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
              <span className="article-title">제8조의2 (협동조합 매체의 자기 보도) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>① 본 조합·조합원·임원의 사업과 활동에 관한 보도는 일반 보도와 동일한 기준으로 다룬다.<br/>
              ② 본 조합의 운영 관련 보도(총회·이사회 결정·재정 등) 시 본 조합의 이해관계를 본문 또는 말미에 명시한다.<br/>
              ③ 조합원이 보도 대상이 되는 사안은 제8조 (이해관계 회피)에 따라 처리한다.</p>
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
              <span className="article-title">제12조의2 (익명 취재원 사용) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>① 취재원의 실명 공개가 신변·생계·가족에 위협이 될 우려가 있을 때에 한해 익명으로 보도한다.<br/>
              ② 익명 취재원의 단독 발언은 보도하지 않으며, 둘 이상의 독립된 취재원으로 교차 확인한다.<br/>
              ③ 익명 보도는 편집국장의 사전 승인을 받는다.</p>
            </div>
            <div className="article">
              <span className="article-title">제13조 (약자·소수자 우선)</span>
              <p>노인·아동·장애인·여성·이주민·빈곤층 등 사회적 약자의 목소리를 우선한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제13조의2 (지역성) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>① 강진·고흥·보성·장흥 4개 군의 시각에서 지역의 이슈를 우선 보도한다.<br/>
              ② 외부 매체의 보도를 인용할 때에는 지역의 맥락에서 다시 해석한다.<br/>
              ③ 특정 지역에 대한 부정적 일반화·고정관념을 사용하지 않는다.</p>
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
            <div className="article">
              <span className="article-title">제17조의2 (사진·영상의 진실성) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>① 보도용 사진과 영상은 촬영 시점과 장소의 사실을 그대로 담는다. 디지털 합성·변조·연출은 하지 않으며, 부득이한 재구성은 그 사실을 명확히 표시한다.<br/>
              ② 자료 사진은 「자료 사진」으로 표기하고 촬영 시점을 함께 적는다.<br/>
              ③ 군중·범죄 현장·피해자가 식별되는 얼굴은 본인 동의가 없는 한 모자이크 처리한다.<br/>
              ④ 외부에서 받은 사진과 영상은 출처와 촬영자를 본문에 명시한다.</p>
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
            <div className="article">
              <span className="article-title">제22조의2 (제보 기반 보도) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>① 편집국은 마을 리포터와 일반 시민의 제보를 사실 확인 후 기사로 작성한다. 둘 이상의 독립된 자료·증언으로 교차 검증한 경우에 한해 발행한다.<br/>
              ② 제보자가 제공한 사진·영상은 출처와 진위를 검증한 뒤 사용한다. 본 강령 제17조의2를 함께 따른다.<br/>
              ③ 제보 내용에 기초한 보도의 모든 법적 책임은 편집국이 진다. 다만 제보자가 의도적으로 허위 사실을 제공한 사실이 입증된 경우에는 책임 분담을 재검토한다.</p>
            </div>
            <div className="article">
              <span className="article-title">제22조의3 (생성형 인공지능 활용) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>① 생성형 인공지능(이하 「AI」)을 기사 작성·번역·요약·교정에 보조적으로 활용할 수 있다. 최종 사실 확인과 모든 책임은 편집국 구성원에게 있다.<br/>
              ② AI가 생성한 이미지·영상·음성은 보도 자료로 사용하지 않는다. 명백히 「AI 생성」으로 표기하는 시각화는 예외로 한다.<br/>
              ③ AI가 본문 작성에 핵심적으로 사용된 기사는 그 사실을 본문 말미에 명시한다.<br/>
              ④ 취재원의 발언과 인용을 AI로 재구성하거나 변형하지 않는다.</p>
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
            <div className="article" style={{ marginBottom: '1rem' }}>
              <span className="article-title">제4조 (적용 사례 축적)</span>
              <p>적용 사례를 매년 사이트에 공개.</p>
            </div>
            <div className="article" style={{ marginBottom: 0 }}>
              <span className="article-title">제5조 (제1차 보강 시행일) <span className="amend-marker">〈신설 2026.4.30.〉</span></span>
              <p>본 규정 제1차 보강 (제4조, 제8조의2, 제12조의2, 제13조의2, 제17조의2, 제22조의2, 제22조의3 신설)은 본 규정과 함께 2026년 4월 30일 시행한다.</p>
            </div>
          </section>

          {/* Appendix Section */}
          <section id="appendix" style={{ marginTop: '4rem', borderTop: '2px dashed #e2e8f0', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' }}>부록 · 신설 조항 vs 6대 원칙 매핑</h2>
            <p style={{ color: '#475569', marginBottom: '1.5rem' }}>본 통합본은 제3조의 6대 원칙을 모두 본문 조항에 매핑한다.</p>
            
            <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '1rem', color: '#334155', fontWeight: 700, width: '25%' }}>원칙</th>
                    <th style={{ padding: '1rem', color: '#334155', fontWeight: 700, width: '35%' }}>본문 조항</th>
                    <th style={{ padding: '1rem', color: '#334155', fontWeight: 700, width: '40%' }}>비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569' }}>사실 우선</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제10조, 제11조</td>
                    <td style={{ padding: '1rem', color: '#475569' }}></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569' }}>약자·소수자 우선</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제13조, 제14조, 제16조</td>
                    <td style={{ padding: '1rem', color: '#475569' }}></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569' }}>독립</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제2장 전체 + 제8조의2</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>협동조합 자기 보도 (신설)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569' }}>균형</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제12조, 제17조 + 제12조의2</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>익명 보도 사용 조건 (신설)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 700 }}>지역성</td>
                    <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 700 }}>제13조의2</td>
                    <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 700 }}>신설 — 본 강령에 없던 정체성 명시</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 700 }}>협동조합</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제27조 + 제8조의2</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>잉여금 + 자기 보도 (강화)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' }}>부록 · 신설 조항 상호 참조</h2>
            <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              본 강령 내부 일관성을 위해 세 군데 cross-reference를 박았다:
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '1rem', color: '#334155', fontWeight: 700, width: '20%' }}>조항</th>
                    <th style={{ padding: '1rem', color: '#334155', fontWeight: 700, width: '40%' }}>참조</th>
                    <th style={{ padding: '1rem', color: '#334155', fontWeight: 700, width: '40%' }}>의미</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>제4조 ③</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>부칙 제4조</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>적용 사례 매년 공개</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>제8조의2 ③</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제8조 (이해관계 회피)</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>조합원 보도 처리 절차</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>제22조의2 ②</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제17조의2 (사진·영상의 진실성)</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>제보 사진 검증 기준</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 600 }}>부칙 제5조</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>본문 7개 신설 조항</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>보강 시행일 명시</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              이 cross-reference로 한 조항만 떼어 보는 사례를 줄이고, 분쟁 발생 시 관련 조항이 자동으로 함께 적용된다.
            </p>
          </section>

        </div>

        {/* Footer Info */}
        <div style={{ marginTop: '3rem', textAlign: 'right', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8' }}>
          <p style={{ margin: 0 }}>2026년 4월 30일 제정 (제1차 보강 포함)</p>
          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>다산어보 언론협동조합</p>
          <p style={{ margin: 0 }}>편집국장 이득규 / 이사장 강상우</p>
          <p style={{ margin: 0 }}>editor@dasaneobo.kr</p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .ethics-content h2 {
          font-size: 1.5rem;
          color: #1e293b;
          margin: 0 0 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
          font-family: 'Nanum Myeongjo', serif;
        }
        .ethics-content section {
          margin-bottom: 4rem;
        }
        .ethics-content .article {
          margin-bottom: 1.5rem;
        }
        .ethics-content .article-title {
          display: block;
          font-weight: 800;
          color: #334155;
          margin-bottom: 0.5rem;
          font-size: 1.05rem;
        }
        .ethics-content p {
          margin: 0;
          color: #475569;
          line-height: 1.6;
        }
        .amend-marker {
          font-size: 0.75em;
          color: #1F5946;
          font-weight: 400;
          margin-left: 6px;
        }
      `}} />

      <Footer />

    </main>
  );
}
