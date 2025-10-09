CREATE DATABASE filoradb;



-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                
    name VARCHAR(100) NOT NULL,            
    email VARCHAR(150) UNIQUE NOT NULL,    
    password TEXT NOT NULL, 
    storage_limit BIGINT DEFAULT 10737418240,                 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- FOLDERS TABLE
CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- ✅ Folder can be public or private
    is_public BOOLEAN DEFAULT FALSE,

    UNIQUE (owner_id, parent_id, name)
);

CREATE INDEX idx_folders_parent ON folders (parent_id);


-- FILES TABLE
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(255) UNIQUE NOT NULL,
    size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE,
    uuid TEXT UNIQUE,
    -- ✅ File can be public or private
    is_public BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_files_owner ON files (owner_id);

