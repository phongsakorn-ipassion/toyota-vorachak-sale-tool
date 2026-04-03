ALTER TABLE leads ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'new_lead';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS test_drive_status TEXT;

-- Migrate existing data
UPDATE leads SET stage = 'close_won' WHERE level = 'won';
UPDATE leads SET stage = 'close_lost' WHERE level = 'lost';
UPDATE leads SET stage = 'new_lead' WHERE stage IS NULL OR stage = '';
UPDATE leads SET test_drive_status = 'scheduled' WHERE lead_type = 'test_drive' AND test_drive_status IS NULL;

CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
