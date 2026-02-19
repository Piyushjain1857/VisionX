-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Farmer',
    full_name VARCHAR(100),
    location TEXT,
    state VARCHAR(100),
    city VARCHAR(100),
    mobile VARCHAR(20),
    email VARCHAR(100),
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Land Table
CREATE TABLE IF NOT EXISTS land (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(id),
    land_name VARCHAR(100),
    area_size DECIMAL(10, 2),
    location TEXT,
    state VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Fields Table (Optional but kept for structure)
CREATE TABLE IF NOT EXISTS fields (
    id SERIAL PRIMARY KEY,
    land_id INTEGER REFERENCES land(id),
    name VARCHAR(100),
    area DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(id),
    land_id INTEGER REFERENCES land(id),
    crop_name VARCHAR(100),
    variety VARCHAR(100),
    planted_date DATE,
    estimated_harvest_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create History Table
CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(id),
    land_id INTEGER REFERENCES land(id),
    crop_id INTEGER REFERENCES crops(id),
    year INTEGER,
    yield_amount DECIMAL(10, 2),
    disease_record TEXT,
    treatment_record TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
