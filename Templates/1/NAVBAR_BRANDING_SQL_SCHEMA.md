# Navbar & Branding Database Schema

## Table: `navbar_settings`

This table stores the main navbar and branding configuration for the temple website.

```sql
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
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

## Table: `navigation_items`

This table stores the navigation menu items with their order and links.

```sql
CREATE TABLE navigation_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    navbar_settings_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    display_order INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    target_type ENUM('_self', '_blank') DEFAULT '_self',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (navbar_settings_id) REFERENCES navbar_settings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_order_per_navbar (navbar_settings_id, display_order)
);
```

## Table: `navbar_settings_history`

This table maintains a history of navbar changes for audit purposes.

```sql
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
```

## Field Descriptions

### navbar_settings table:

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | INT | Primary key | AUTO_INCREMENT |
| `temple_name` | VARCHAR(100) | Temple name displayed in navbar | NOT NULL, Max 100 chars |
| `logo_path` | VARCHAR(255) | File path to uploaded logo | NULL allowed |
| `logo_filename` | VARCHAR(100) | Original filename of logo | NULL allowed |
| `logo_file_size` | INT | Logo file size in bytes | NULL allowed |
| `logo_mime_type` | VARCHAR(50) | MIME type of logo file | NULL allowed |
| `tab_title` | VARCHAR(60) | Browser tab title | NOT NULL, Max 60 chars |
| `tab_icon_path` | VARCHAR(255) | File path to favicon | NULL allowed |
| `tab_icon_filename` | VARCHAR(100) | Original filename of favicon | NULL allowed |
| `tab_icon_file_size` | INT | Favicon file size in bytes | NULL allowed |
| `tab_icon_mime_type` | VARCHAR(50) | MIME type of favicon | NULL allowed |
| `is_active` | BOOLEAN | Whether settings are active | Default TRUE |
| `created_at` | TIMESTAMP | Record creation time | AUTO |
| `updated_at` | TIMESTAMP | Last update time | AUTO UPDATE |
| `created_by` | INT | User who created record | FK to users |
| `updated_by` | INT | User who last updated | FK to users |

### navigation_items table:

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | INT | Primary key | AUTO_INCREMENT |
| `navbar_settings_id` | INT | Reference to navbar settings | NOT NULL, FK |
| `name` | VARCHAR(50) | Menu item display name | NOT NULL |
| `url` | VARCHAR(255) | Menu item URL/path | NOT NULL |
| `display_order` | INT | Order of menu item | NOT NULL |
| `is_active` | BOOLEAN | Whether item is visible | Default TRUE |
| `target_type` | ENUM | Link target behavior | '_self' or '_blank' |
| `created_at` | TIMESTAMP | Record creation time | AUTO |
| `updated_at` | TIMESTAMP | Last update time | AUTO UPDATE |

## File Storage Structure

```
/uploads/navbar/
├── logos/
│   ├── {timestamp}_{original_filename}
│   └── thumbs/
│       └── {timestamp}_{original_filename}
└── favicons/
    └── {timestamp}_{original_filename}
```

## API Endpoints Required

### GET `/api/navbar-settings`
Retrieve current navbar settings and navigation items.

### POST `/api/navbar-settings`
Create or update navbar settings with file uploads.

### PUT `/api/navbar-settings/{id}`
Update specific navbar settings.

### DELETE `/api/navbar-settings/{id}`
Delete navbar settings (soft delete recommended).

### POST `/api/navigation-items`
Add new navigation item.

### PUT `/api/navigation-items/{id}`
Update navigation item.

### DELETE `/api/navigation-items/{id}`
Remove navigation item.

### POST `/api/navigation-items/reorder`
Reorder navigation items.

## File Upload Specifications

### Logo Requirements:
- **Max Size**: 2MB
- **Formats**: PNG, JPG, JPEG, SVG, WEBP
- **Recommended Size**: 40x40px to 80x80px
- **Storage**: Generate thumbnail versions
- **Validation**: Check dimensions and file type

### Favicon Requirements:
- **Max Size**: 500KB
- **Formats**: PNG, ICO, SVG
- **Recommended Size**: 16x16px, 32x32px, or 64x64px
- **Storage**: Convert to .ico if needed
- **Validation**: Ensure square dimensions

## Sample Insert Queries

```sql
-- Insert default navbar settings
INSERT INTO navbar_settings (
    temple_name, 
    tab_title, 
    created_by, 
    updated_by
) VALUES (
    'Hindu Temple', 
    'Hindu Temple - Sacred Space for Worship',
    1, 
    1
);

-- Insert default navigation items
INSERT INTO navigation_items (navbar_settings_id, name, url, display_order) VALUES
(1, 'Home', '/', 1),
(1, 'Services', '/services', 2),
(1, 'Events', '/events', 3),
(1, 'Contact Us', '/contact', 4);
```

## Indexes for Performance

```sql
-- Index for active navbar settings
CREATE INDEX idx_navbar_active ON navbar_settings(is_active);

-- Index for navigation items ordering
CREATE INDEX idx_nav_items_order ON navigation_items(navbar_settings_id, display_order);

-- Index for active navigation items
CREATE INDEX idx_nav_items_active ON navigation_items(is_active);

-- Index for navbar history tracking
CREATE INDEX idx_navbar_history_date ON navbar_settings_history(changed_at);
```

## Security Considerations

1. **File Upload Security**:
   - Validate file types and sizes
   - Scan uploaded files for malware
   - Store files outside web root
   - Generate unique filenames

2. **Input Validation**:
   - Sanitize all text inputs
   - Validate URLs for navigation items
   - Check character limits

3. **Access Control**:
   - Only admin users can modify navbar settings
   - Log all changes for audit trail
   - Implement role-based permissions 