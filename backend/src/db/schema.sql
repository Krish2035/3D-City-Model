-- PostgreSQL Schema for 3D Real Estate Society Platform

DO $$ BEGIN
    CREATE TYPE plot_status AS ENUM ('AVAILABLE', 'RESERVED', 'BOOKED', 'SOLD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    model_url VARCHAR(500) NOT NULL,
    total_plots INT DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plots (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    plot_number INT NOT NULL UNIQUE,
    model_object_name VARCHAR(100) NOT NULL UNIQUE,
    area NUMERIC(10, 2) NOT NULL,
    length NUMERIC(10, 2) NOT NULL,
    width NUMERIC(10, 2) NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    status plot_status NOT NULL DEFAULT 'AVAILABLE',
    facing VARCHAR(50) DEFAULT 'East',
    corner_plot BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    plot_id INT REFERENCES plots(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plots_project_id ON plots(project_id);
CREATE INDEX IF NOT EXISTS idx_plots_model_name ON plots(model_object_name);
CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);
