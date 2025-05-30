#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Function to run SQL script
run_sql_script() {
    local script=$1
    local message=$2
    
    print_message "🔄 $message..."
    if mysql -u root -pnew_password < "$script"; then
        print_message "✅ $message completed successfully"
    else
        print_error "❌ Error during $message"
        exit 1
    fi
}

# Main menu
case "$1" in
    "create")
        run_sql_script "database/scripts/create_database.sql" "Creating database and tables"
        run_sql_script "database/scripts/create_websites_table.sql" "Creating websites table"
        ;;
    "drop")
        run_sql_script "database/scripts/drop_database.sql" "Dropping database"
        ;;
    "reset")
        run_sql_script "database/scripts/drop_database.sql" "Dropping database"
        run_sql_script "database/scripts/create_database.sql" "Creating database and tables"
        run_sql_script "database/scripts/create_websites_table.sql" "Creating websites table"
        ;;
    "seed")
        run_sql_script "database/scripts/seed_test_data.sql" "Seeding test data"
        ;;
    "reset-seed")
        run_sql_script "database/scripts/drop_database.sql" "Dropping database"
        run_sql_script "database/scripts/create_database.sql" "Creating database and tables"
        run_sql_script "database/scripts/create_websites_table.sql" "Creating websites table"
        run_sql_script "database/scripts/seed_test_data.sql" "Seeding test data"
        ;;
    "create-user")
        run_sql_script "database/scripts/create_user.sql" "Creating application user"
        ;;
    "setup-all")
        run_sql_script "database/scripts/drop_database.sql" "Dropping database"
        run_sql_script "database/scripts/create_database.sql" "Creating database and tables"
        run_sql_script "database/scripts/create_websites_table.sql" "Creating websites table"
        run_sql_script "database/scripts/seed_test_data.sql" "Seeding test data"
        run_sql_script "database/scripts/create_user.sql" "Creating application user"
        ;;
    *)
        echo "Usage: $0 {create|drop|reset|seed|reset-seed|create-user|setup-all}"
        echo "  create      - Create database and tables"
        echo "  drop        - Drop database"
        echo "  reset       - Drop and recreate database"
        echo "  seed        - Seed test data into database"
        echo "  reset-seed  - Drop, recreate database and seed test data"
        echo "  create-user - Create application user with limited permissions"
        echo "  setup-all   - Complete setup: drop, create, seed, and create user"
        exit 1
        ;;
esac 