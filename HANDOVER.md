# 다산어보(Dasan-Eobo) 뉴스 플랫폼 기술 인수인계 문서

본 문서는 다산어보 지역 독립언론 플랫폼의 원활한 운영 및 유지보수를 위해 작성되었습니다.

---

## 1. 프로젝트 개요
- **목적**: 강진, 고흥, 보성, 장흥 지역 밀착형 독립언론 플랫폼
- **주요 특징**: 주민 리포터 시스템, 정기/평생 구독 모델, 지역 광고 시스템, 투명성 지표 관리

## 2. 기술 스택 (Tech Stack)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS (Global & Scoped)
- **Database/Auth**: Supabase (PostgreSQL)
- **Email Service**: EmailJS (클라이언트 사이드 폼 전송)
- **Deployment**: Vercel

---

## 3. 환경 변수 설정 (.env.local)
프로젝트 구동을 위해 다음 변수들이 설정되어야 합니다.

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS 설정 (구독/광고 알림용)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 4. 주요 기능 및 로직 설명

### 4.1. 기사 관리 및 에디터 (`/app/admin/new`)
- **에디터**: `@uiw/react-md-editor` 기반 마크다운 에디터 사용.
- **사진 추가**: 툴바의 **[사진추가]** 버튼 클릭 시 Supabase Storage(`article-images` 버킷)에 자동 업로드 후 본문에 마크다운 코드가 삽입됩니다.
- **발행 프로세스**: 리포터가 작성 시 `pending`(승인 대기), 편집국/관리자가 작성 시 `published`(발행) 상태로 저장됩니다.

### 4.2. 구독 시스템 (`/app/subscribe`)
- **구좌 선택**: 1~5구좌 선택에 따라 결제 금액이 실시간으로 자동 계산됩니다 (`pricePerUnit` 상수 기반).
- **데이터 관리**: 서버에 저장하지 않고 신청 즉시 **EmailJS**를 통해 관리자에게 메일로 전송되며, 사용자는 본인 신청 내역을 `.txt` 파일로 다운로드할 수 있습니다.

### 4.3. 광고 및 추천인 시스템 (`/app/ad-apply`)
- **추천인 필드**: 모든 신청 폼(회원가입, 구독, 광고)에 추천인 입력란이 있습니다.
- **광고 관리**: 관리자 페이지의 '사이트 설정' 탭에서 메인 상단 빌보드와 사이드바 광고를 실시간으로 제어(이미지 교체, 링크 변경, 노출 여부)할 수 있습니다.

### 4.4. 관리자 페이지 (편집국, `/app/admin`)
- **대시보드**: 승인 대기 기사, 마을 제보 내역, 사이트 투명성 지표(구독자 수 등)를 관리합니다.
- **회원 관리**: `/admin/users`에서 전체 회원 목록을 확인하고 권한(관리자, 기자, 리포터, 일반)을 조정할 수 있으며, 전체 명단을 CSV로 다운로드할 수 있습니다.

---

## 5. 데이터베이스 구조 (Supabase)
- `articles`: 기사 정보 (제목, 본문, 상태, 카테고리, 지역 등)
- `profiles`: 사용자 프로필 (이름, 권한, 추천인 정보)
- `village_reports`: 리포터 제보 내역
- `ad_applications`: 광고주 신청 내역
- `site_settings`: 사이트 전역 설정 (구독자 수 등)
- `ads`: 배너 광고 설정

---

## 6. 운영 시 주의사항
1. **이미지 업로드**: Supabase Storage의 `article-images` 버킷 권한이 'Public'으로 설정되어 있어야 이미지가 외부에서 보입니다.
2. **EmailJS 템플릿**: EmailJS 대시보드에서 템플릿 변수(`{{units}}`, `{{amount}}`, `{{recommender}}` 등)를 코드와 일치하게 설정해야 정보가 누락되지 않습니다.
3. **권한 관리**: 새로운 리포터가 등록되면 관리자가 `profiles` 테이블에서 해당 사용자의 `role`을 `reporter`로 변경해 주어야 기사 작성이 가능합니다.

---

**작성일**: 2026년 4월 23일
**작성자**: Antigravity AI Assistant
