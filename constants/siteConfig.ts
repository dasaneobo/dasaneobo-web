/**
 * News Platform Template v1.0 - Configuration
 * 모든 신문사 공통 설정값들을 여기서 관리합니다.
 */

export const SITE_CONFIG = {
  name: "다산어보",
  englishName: "DASANEOBO",
  slogan: "전남 4개 권역 밀착 보도 · LOCAL MEDIA",
  description: "강진·장흥·고흥·보성 4개 권역 밀착 독립언론. 투명한 보도와 주민 참여로 지역의 미래를 씁니다.",
  
  // 브랜딩 컬러
  colors: {
    primary: "#2E7D52", // 다산어보 시그니처 그린
    primaryDark: "#1e5436",
    accent: "#ACE1AF", // 청자색
  },
  
  // UI 라벨 (영문 대문자 한글화)
  labels: {
    topNews: "주요 뉴스",
    importantNews: "추천 기사",
    community: "독자 참여",
    subscription: "구독",
    report: "제보",
    ad: "광고",
  },
  
  // 지역 설정 (날씨 등)
  location: {
    city: "Gangjin",
    cityKR: "강진",
  },
  
  // 메뉴 카테고리
  categories: [
    { label: '전체기사', href: '/region' },
    { label: '강진', href: '/gangjin', region: true },
    { label: '고흥', href: '/goheung', region: true },
    { label: '보성', href: '/boseong', region: true },
    { label: '장흥', href: '/jangheung', region: true },
    { label: '행정', href: '/administration' },
    { label: '정치', href: '/politics' },
    { label: '경제', href: '/economy' },
    { label: '사회', href: '/society' },
    { label: '문화', href: '/culture' },
    { label: '칼럼', href: '/column' },
    // { label: '기획연재', href: '/series', enabled: false }, // 콘텐츠 추가 시 활성화
    // { label: '포토', href: '/photo', enabled: false },     // 콘텐츠 추가 시 활성화
    { label: '이용안내', href: '/guide' },
    { label: '기사제보', href: '/report', accent: true },
  ] as { label: string; href: string; region?: boolean; accent?: boolean; enabled?: boolean }[],
  
  // 등록 상태
  isRegistered: false,
  
  // 연락처 및 하단 정보
  contact: {
    publisher: "강상우",
    editor: "이득규",
    youthProtector: "강상우",
    corporation: "다산어보 언론협동조합",
    registrationNumber: "전남, 아00000",
    registrationDate: "2026-XX-XX",
    address: "전라남도 강진군 강진읍 오감길",
    phone: "061-000-0000",
    fax: "061-000-0001",
    email: "editor@dasaneobo.kr",
    temporaryContact: {
      label: '연락처',
      value: '대표 이메일로 문의 부탁드립니다',
      email: 'editor@dasaneobo.kr',
    },
  },
  url: "https://www.dasaneobo.kr"
};

