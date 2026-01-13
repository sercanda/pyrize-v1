
-- Revenue Planner Table
CREATE TABLE IF NOT EXISTS revenue_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Step 1: Revenue Target
  target_revenue NUMERIC(12, 2) NOT NULL, -- Monthly revenue target
  commission_rate NUMERIC(4, 2) NOT NULL DEFAULT 2.0, -- Percentage (e.g., 2.0 for 2%)
  avg_property_price NUMERIC(15, 2) NOT NULL, -- Average property sale price
  
  -- Step 2: Current Performance
  current_active_listings INTEGER NOT NULL DEFAULT 0,
  avg_monthly_sales NUMERIC(4, 1) NOT NULL DEFAULT 0, -- Can be decimal (e.g. 1.5 sales/month)
  credit_eligible_ratio NUMERIC(5, 2) NOT NULL DEFAULT 50.0, -- Percentage of listings eligible for credit
  avg_sales_cycle_days INTEGER NOT NULL DEFAULT 60,
  
  -- Step 3: Conversion Rates
  listing_conversion_rate NUMERIC(5, 2) NOT NULL DEFAULT 20.0, -- % of listings that sell
  client_conversion_rate NUMERIC(5, 2) NOT NULL DEFAULT 5.0, -- % of clients that buy
  meeting_conversion_rate NUMERIC(5, 2) NOT NULL DEFAULT 25.0, -- % of meetings that become clients
  credit_bonus_coefficient NUMERIC(3, 2) NOT NULL DEFAULT 1.2, -- Multiplier for credit-eligible properties
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_revenue_plans_user_id ON revenue_plans(user_id);

-- RLS Policies
ALTER TABLE revenue_plans ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own plan
CREATE POLICY "Users can view their own revenue plan" ON revenue_plans
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own plan
CREATE POLICY "Users can insert their own revenue plan" ON revenue_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own plan
CREATE POLICY "Users can update their own revenue plan" ON revenue_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own plan
CREATE POLICY "Users can delete their own revenue plan" ON revenue_plans
  FOR DELETE USING (auth.uid() = user_id);
