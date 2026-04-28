-- 마을 리포터 등록 정보 (회원)
CREATE TABLE IF NOT EXISTS village_reporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  pen_name TEXT,
  email TEXT NOT NULL UNIQUE,
  contact_phone TEXT NOT NULL,
  birth_date DATE NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('강진','고흥','보성','장흥','기타')),
  interests TEXT[] NOT NULL,
  intro TEXT NOT NULL CHECK (char_length(intro) BETWEEN 100 AND 300),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly','monthly','seasonal','flexible')),
  referrer TEXT,
  photo_url TEXT,
  is_minor BOOLEAN DEFAULT false,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_consent_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','contacted','active','dormant')),
  registered_at TIMESTAMPTZ,
  reviewer_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 제보 (일반 제보 + 등록 리포터 제보 통합)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES village_reporters(id), -- NULL이면 익명/일반 제보
  contact_email TEXT, -- 익명 제보는 reporter_id NULL + contact_email 입력
  contact_phone TEXT,
  who TEXT,
  when_text TEXT,
  where_text TEXT,
  what TEXT NOT NULL,
  why TEXT,
  how TEXT,
  memo TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  region TEXT CHECK (region IN ('강진','고흥','보성','장흥','기타')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewing','published','rejected')),
  published_article_id UUID REFERENCES articles(id), -- 기사화 후 연결
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_reporter ON submissions(reporter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status, created_at DESC);
