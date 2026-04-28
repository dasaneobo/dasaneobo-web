-- Add featured fields to articles table
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS pin_until TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_articles_featured
  ON articles(is_featured, pin_until DESC NULLS LAST, created_at DESC)
  WHERE is_featured = true;

COMMENT ON COLUMN articles.is_featured IS '편집국 초점 픽 여부';
COMMENT ON COLUMN articles.pin_until IS '픽 만료 시점. NULL이면 영구 픽. 만료되면 fallback 최신 기사로 자동 교체. 일반적으로 게재 후 5일로 설정.';
