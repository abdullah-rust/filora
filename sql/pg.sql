CREATE DATABASE filoradb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,                
    name VARCHAR(100) NOT NULL,            
    email VARCHAR(150) UNIQUE NOT NULL,    
    password TEXT NOT NULL,                  
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE files (
    -- Unique ID for the file
    id SERIAL PRIMARY KEY,

    -- File ka naam jo user ko dikhega (e.g., "vacation_photo.jpg")
    name VARCHAR(255) NOT NULL,

    -- File ka unique naam jo MinIO bucket mein store hoga
    -- Yeh UUID ya hash ho sakta hai (e.g., "a3b4c5d6-e7f8-9a0b-1c2d3e4f5g6h")
    storage_key VARCHAR(255) UNIQUE NOT NULL,

    -- File ka size bytes mein
    size BIGINT NOT NULL,

    -- File type (e.g., "image/jpeg", "application/pdf")
    mime_type VARCHAR(100) NOT NULL,

    -- Foreign Key: Kis user ki file hai
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Foreign Key: Kis folder mein hai (NULL agar root folder mein ho)
    folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,

    -- File ko aakhri baar kab upload/update kiya gaya
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Aakhri baar access/download kab kiya gaya
    last_accessed TIMESTAMP WITH TIME ZONE
);

-- Optimization: owner_id par index zaroori hai taa-ke user ki files tez load hon
CREATE INDEX idx_files_owner ON files (owner_id);


CREATE TABLE folders (
    -- Unique ID for the folder
    id SERIAL PRIMARY KEY,

    -- Folder ka naam (e.g., "Documents", "Personal")
    name VARCHAR(255) NOT NULL,

    -- Foreign Key: Kis user ka folder hai
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Self-Referencing Foreign Key: Parent folder ki ID
    -- NULL agar folder root (main directory) mein ho
    parent_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,

    -- Kab banaya gaya
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique Constraint: Ek hi parent folder mein ek hi naam ke do folders nahi ho sakte
    UNIQUE (owner_id, parent_id, name)
);

-- Optimization: Folder ki hierarchy tez nikalne ke liye
CREATE INDEX idx_folders_parent ON folders (parent_id);


CREATE TABLE sharing (
    -- Unique ID
    id SERIAL PRIMARY KEY,

    -- File ID (NULL agar folder share ho raha ho)
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,

    -- Folder ID (NULL agar file share ho rahi ho)
    folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,

    -- Foreign Key: Kis user ne share kiya (original owner)
    shared_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Foreign Key: Kis user ke saath share kiya
    shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Permission type (e.g., 'view', 'edit', 'download')
    permission VARCHAR(20) NOT NULL DEFAULT 'view',

    -- Kis waqt sharing ki gayi
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraint: Ek waqt mein ya to file_id ya folder_id hona zaroori hai
    CONSTRAINT chk_file_or_folder CHECK (
        (file_id IS NOT NULL AND folder_id IS NULL) OR 
        (file_id IS NULL AND folder_id IS NOT NULL)
    ),

    -- Constraint: Ek user ko ek file/folder sirf ek baar share ho sakti hai
    UNIQUE (file_id, folder_id, shared_with_user_id)
);






domain/api/file/uuid 



{
    folder1:{
        images:{
           image1: {name:"imagename ",size :"2mb".etc wagerah }
        }

    }

   file: {name:"file name ",size :"10mb".etc wagerah }
}