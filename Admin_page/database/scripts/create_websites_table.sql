CREATE TABLE IF NOT EXISTS websites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    organization_name VARCHAR(100),
    organization_type VARCHAR(50),
    tagline VARCHAR(255),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(30),
    address VARCHAR(255),
    logo_url VARCHAR(255),
    favicon_url VARCHAR(255),
    primary_color VARCHAR(20),
    secondary_color VARCHAR(20),
    font VARCHAR(50),
    hero_image_url VARCHAR(255),
    banner_image_url VARCHAR(255),
    intro_text TEXT,
    photo_gallery_urls JSON,
    video_youtube_link VARCHAR(255),
    about TEXT,
    mission TEXT,
    history TEXT,
    services_offerings JSON,
    team_members JSON,
    social_media_links JSON,
    paid_till DATE,
    domain VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    page_no INT,
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id)
); 