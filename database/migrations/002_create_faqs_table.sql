-- Create FAQs table for dynamic FAQ management
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  page_slug VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faqs_page_slug ON faqs(page_slug);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

-- Create trigger for updated_at (assuming the function already exists from schema.sql)
CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON faqs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for FAQs
CREATE POLICY "Enable read access for all users" ON faqs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Enable all access for service role" ON faqs
    FOR ALL USING (auth.role() = 'service_role');

-- Insert sample FAQ data for the homepage
INSERT INTO faqs (question, answer, page_slug, category, display_order) VALUES
('What are the benefits of partnering with an eLearning company in Bangalore?', 'Bangalore is a global hub for technology and innovation, offering access to a vast pool of talent and resources. Partnering with an eLearning company in Bangalore gives you access to cutting-edge solutions, cost-effective services, and a culture of excellence. Swift Solution, as the top eLearning company in Bangalore, combines local expertise with global standards to deliver exceptional results.', 'homepage', 'ELEARNING IN BANGALORE', 1),
('How does Swift Solution''s AI-enabled approach differ from other eLearning providers?', 'Our AI-enabled approach goes beyond simple automation. We use AI to create personalized learning paths, provide real-time feedback, and generate data-driven insights to continuously improve learning outcomes. This allows us to deliver a truly adaptive and engaging learning experience that is tailored to the unique needs of each learner.', 'homepage', 'ELEARNING IN BANGALORE', 2),
('Why is Swift Solution considered the best eLearning company in Bangalore?', 'Our 20+ years of experience, our impressive client portfolio (including Google, Microsoft, and Siemens), our commitment to innovation, and our focus on delivering measurable results are just a few of the reasons why we are considered the best eLearning company in Bangalore. But don''t just take our word for it - our client testimonials and case studies speak for themselves.', 'homepage', 'ELEARNING IN BANGALORE', 3);