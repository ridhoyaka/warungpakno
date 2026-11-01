-- Warung Pak No - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url VARCHAR(300),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table (simple, password stored as plain for demo; use Supabase Auth in production)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read menu_categories and menu_items
CREATE POLICY "Public read menu_categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);

-- Only service role can modify (admin uses service role via API route)
CREATE POLICY "Service role full access categories" ON menu_categories USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access items" ON menu_items USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access admin" ON admin_users USING (auth.role() = 'service_role');

-- Seed categories
INSERT INTO menu_categories (name, slug) VALUES
  ('Kremesan', 'kremesan'),
  ('Penyetan', 'penyetan')
ON CONFLICT (slug) DO NOTHING;

-- Seed menu items
INSERT INTO menu_items (category_id, name, description, price, image_url) VALUES
  -- Kremesan (category_id = 1)
  (1, 'Ayam Kremes', 'Ayam goreng renyah berlapis kremesan gurih, disajikan dengan nasi dan sambal.', 18000, '/menu/ayamkremes.jpeg'),
  (1, 'Bebek Kremes', 'Bebek empuk dengan balutan kremesan crispy, cocok untuk pencinta bebek.', 22000, '/menu/bebekkremes.jpeg'),
  (1, 'Lele Kremes', 'Ikan lele segar digoreng dengan kremesan lezat, renyah di luar lembut di dalam.', 15000, '/menu/lelekremes.jpeg'),
  (1, 'Tahu Tempe Kremes', 'Tahu dan tempe berlapis kremesan gurih, pilihan hemat dan lezat.', 10000, '/menu/tempetahukremes.jpeg'),
  (1, 'Ati Kremes', 'Ati ayam digoreng dengan kremesan renyah, kaya rasa dan bergizi.', 13000, '/menu/atikremes.jpeg'),
  -- Penyetan (category_id = 2)
  (2, 'Ayam Penyet Kremes', 'Ayam penyet dengan kremesan extra, diulek bersama sambal bawang pedas.', 20000, '/menu/ayamkremes-penyet.jpeg'),
  (2, 'Bebek Penyet Kremes', 'Bebek penyet berbalut kremesan, disajikan dengan sambal terasi khas.', 25000, '/menu/bebekkremes-penyet.jpeg'),
  (2, 'Tahu Tempe Penyet Kremes', 'Tahu tempe dipenyet dengan sambal dan kremesan, sederhana tapi nikmat.', 12000, '/menu/tempetahukremes-penyet.jpeg'),
  (2, 'Ati Penyet Kremes', 'Ati ayam dipenyet dengan sambal pedas dan kremesan gurih.', 15000, '/menu/atikremes-penyet.jpeg')
ON CONFLICT DO NOTHING;

-- Seed default admin (username: admin, password: admin123 — CHANGE THIS!)
INSERT INTO admin_users (username, password) VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;
