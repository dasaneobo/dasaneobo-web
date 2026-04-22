/**
 * News Platform Template v1.0 - Configuration
 * 모든 신문사 공통 설정값들을 여기서 관리합니다.
 */

export const SITE_CONFIG = {
  name: "다산어보",
  englishName: "DASANEOBO",
  slogan: "전남·광주 독립언론 · LOCAL MEDIA",
  description: "지속가능한 지역 저널리즘을 꿈꾸는 독립 언론",
  
  // 브랜딩 컬러
  colors: {
    primary: "#2E7D52", // 다산어보 시그니처 그린
    primaryDark: "#1e5436",
    accent: "#ACE1AF", // 청자색
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
    { label: '기획연재', href: '/region' },
    { label: '포토', href: '/region' },
    { label: '기사제보', href: '/admin/report', accent: true },
  ] as { label: string; href: string; region?: boolean; accent?: boolean }[],
  
  // 연락처 및 하단 정보
  contact: {
    email: "contact@dasaneobo.kr",
    address: "전라남도 강진군 강진읍",
    registrationNumber: "123-45-67890",
  }
};
