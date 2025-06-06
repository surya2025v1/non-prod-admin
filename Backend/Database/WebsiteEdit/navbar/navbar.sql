

CREATE TABLE navbar_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    temple_name VARCHAR(100) NOT NULL,
    logo_path VARCHAR(255) NULL,
    logo_filename VARCHAR(100) NULL,
    logo_file_size INT NULL,
    logo_mime_type VARCHAR(50) NULL,
    tab_title VARCHAR(60) NOT NULL,
    tab_icon_path VARCHAR(255) NULL,
    tab_icon_filename VARCHAR(100) NULL,
    tab_icon_file_size INT NULL,
    tab_icon_mime_type VARCHAR(50) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    publish_status ENUM('Published','Draft','Need-Review','Expire') DEFAULT 'Draft',
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);



CREATE TABLE navbar_settings_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    navbar_settings_id INT NOT NULL,
    temple_name VARCHAR(100) NOT NULL,
    tab_title VARCHAR(60) NOT NULL,
    action_type ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    change_description TEXT NULL,
    changed_by INT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values JSON NULL,
    new_values JSON NULL,
    FOREIGN KEY (navbar_settings_id) REFERENCES navbar_settings(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);
