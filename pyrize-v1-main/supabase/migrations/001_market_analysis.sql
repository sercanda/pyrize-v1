-- Market Analysis Cache Table
CREATE TABLE IF NOT EXISTS market_analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  province TEXT,
  district TEXT,
  neighborhood TEXT,
  
  -- Market Data
  sqm_avg NUMERIC(12, 2),
  six_month_trend NUMERIC(12, 2)[] DEFAULT '{}',
  sale_duration_days INTEGER,
  demand_change_percent NUMERIC(5, 2),
  active_listings_count INTEGER,
  
  -- Metadata
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  data_source TEXT[] DEFAULT '{}', -- ['endeksa', 'zingat', etc.]
  scrape_status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed', 'partial'
  error_message TEXT,
  
  -- Indexes for fast lookup
  CONSTRAINT unique_location UNIQUE (location)
);

-- Index for location lookups
CREATE INDEX IF NOT EXISTS idx_market_analysis_location ON market_analysis_cache(location);
CREATE INDEX IF NOT EXISTS idx_market_analysis_last_updated ON market_analysis_cache(last_updated);
CREATE INDEX IF NOT EXISTS idx_market_analysis_district ON market_analysis_cache(district);
CREATE INDEX IF NOT EXISTS idx_market_analysis_province ON market_analysis_cache(province);

-- Function to get or create market analysis
CREATE OR REPLACE FUNCTION get_market_analysis(
  p_location TEXT,
  p_max_age_hours INTEGER DEFAULT 48
)
RETURNS TABLE (
  id UUID,
  location TEXT,
  sqm_avg NUMERIC,
  six_month_trend NUMERIC[],
  sale_duration_days INTEGER,
  demand_change_percent NUMERIC,
  active_listings_count INTEGER,
  last_updated TIMESTAMPTZ,
  is_stale BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mac.id,
    mac.location,
    mac.sqm_avg,
    mac.six_month_trend,
    mac.sale_duration_days,
    mac.demand_change_percent,
    mac.active_listings_count,
    mac.last_updated,
    CASE 
      WHEN mac.last_updated < NOW() - (p_max_age_hours || ' hours')::INTERVAL 
      THEN TRUE 
      ELSE FALSE 
    END as is_stale
  FROM market_analysis_cache mac
  WHERE mac.location = p_location
  ORDER BY mac.last_updated DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies (if needed)
ALTER TABLE market_analysis_cache ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow read access to market analysis" ON market_analysis_cache
  FOR SELECT USING (true);

-- Allow service role to insert/update
CREATE POLICY "Allow service role full access" ON market_analysis_cache
  FOR ALL USING (auth.role() = 'service_role');

