-- Add new fields to reporter_applications for the expanded application form

ALTER TABLE reporter_applications
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS occupation text,
ADD COLUMN IF NOT EXISTS interests jsonb,
ADD COLUMN IF NOT EXISTS agreement_eligibility boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS agreement_volunteer boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS agreement_ethics boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS agreement_privacy boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS guardian_name text,
ADD COLUMN IF NOT EXISTS guardian_contact text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Update existing records if necessary
UPDATE reporter_applications SET status = 'pending' WHERE status IS NULL;
