import os
import logging
from typing import Optional, List, Dict, Any
from sqlalchemy import create_engine, text, inspect, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError, OperationalError
from app.core.config import settings

logger = logging.getLogger(__name__)

class ClientDatabaseManager:
    """Manages client-specific databases"""
    
    def __init__(self):
        self.main_engine = create_engine(settings.database_url, echo=True)
        self.client_engines = {}
        self.client_sessions = {}
    
    def _get_client_db_name(self, domain: str, owner_id: int = None) -> str:
        """Generate database name from domain and optionally owner_id"""
        # Clean domain name to be valid for database naming
        db_name = domain.lower().replace('.', '_').replace('-', '_')
        # Remove any non-alphanumeric characters except underscore
        db_name = ''.join(c for c in db_name if c.isalnum() or c == '_')
        
        if owner_id is not None:
            return f"{db_name}_{owner_id}"
        else:
            # Backward compatibility for old naming convention
            return f"client_{db_name}"
    
    def _get_client_db_url(self, db_name: str) -> str:
        """Generate database URL for client database"""
        # Extract components from main database URL
        parts = settings.database_url.split('/')
        base_url = '/'.join(parts[:-1])
        return f"{base_url}/{db_name}"
    
    def _get_server_url(self) -> str:
        """Generate server URL without database for creating databases"""
        return f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}"
    
    def database_exists(self, domain: str, owner_id: int = None) -> bool:
        """Check if database exists for given domain and optionally owner_id"""
        db_name = self._get_client_db_name(domain, owner_id)
        
        try:
            with self.main_engine.connect() as conn:
                result = conn.execute(text(
                    "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = :db_name"
                ), {"db_name": db_name})
                return result.fetchone() is not None
        except Exception as e:
            logger.error(f"Error checking database existence for {domain}: {e}")
            return False
    
    def create_database(self, domain: str, owner_id: int = None) -> bool:
        """Create database for given domain and optionally owner_id"""
        db_name = self._get_client_db_name(domain, owner_id)
        
        try:
            # Create engine connecting to MySQL server (without specific database)
            server_url = self._get_server_url()
            temp_engine = create_engine(server_url, isolation_level="AUTOCOMMIT")
            
            with temp_engine.connect() as conn:
                conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
                logger.info(f"Created database: {db_name}")
            
            temp_engine.dispose()
            return True
        except Exception as e:
            logger.error(f"Error creating database {db_name}: {e}")
            return False
    
    def get_client_session(self, domain: str, owner_id: int = None):
        """Get database session for client domain and optionally owner_id"""
        db_name = self._get_client_db_name(domain, owner_id)
        
        if db_name not in self.client_sessions:
            db_url = self._get_client_db_url(db_name)
            try:
                engine = create_engine(db_url, echo=True)
                SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
                self.client_engines[db_name] = engine
                self.client_sessions[db_name] = SessionLocal
            except Exception as e:
                logger.error(f"Error creating session for {db_name}: {e}")
                return None
        
        try:
            session = self.client_sessions[db_name]()
            return session
        except Exception as e:
            logger.error(f"Error getting session for {db_name}: {e}")
            return None
    
    def create_users_table_only(self, domain: str, owner_id: int = None) -> bool:
        """Create only the users table in client database using SQL file"""
        db_name = self._get_client_db_name(domain, owner_id)
        db_url = self._get_client_db_url(db_name)
        
        try:
            # Read SQL file
            sql_file_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                'database', 'client_tables', 'create_tables.sql'
            )
            
            if not os.path.exists(sql_file_path):
                logger.error(f"SQL file not found: {sql_file_path}")
                return False
            
            with open(sql_file_path, 'r') as file:
                sql_content = file.read()
            
            # Extract only the users table creation statement
            lines = sql_content.split('\n')
            users_table_sql = []
            in_users_table = False
            
            for line in lines:
                if 'CREATE TABLE IF NOT EXISTS users' in line:
                    in_users_table = True
                    users_table_sql.append(line)
                elif in_users_table:
                    users_table_sql.append(line)
                    if line.strip().endswith(');'):
                        break
            
            if not users_table_sql:
                logger.error("Could not extract users table SQL")
                return False
            
            users_sql = '\n'.join(users_table_sql)
            
            # Create engine for client database
            engine = create_engine(db_url, echo=True)
            
            with engine.connect() as conn:
                trans = conn.begin()
                try:
                    conn.execute(text(users_sql))
                    trans.commit()
                    logger.info(f"Created users table in database: {db_name}")
                    return True
                except Exception as e:
                    trans.rollback()
                    logger.error(f"Error creating users table: {e}")
                    return False
            
        except Exception as e:
            logger.error(f"Error creating users table in {db_name}: {e}")
            return False
    
    def create_tables(self, domain: str, owner_id: int = None) -> bool:
        """Create tables in client database using SQL file"""
        db_name = self._get_client_db_name(domain, owner_id)
        db_url = self._get_client_db_url(db_name)
        
        try:
            # Read SQL file
            sql_file_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                'database', 'client_tables', 'create_tables.sql'
            )
            
            if not os.path.exists(sql_file_path):
                logger.error(f"SQL file not found: {sql_file_path}")
                return False
            
            with open(sql_file_path, 'r') as file:
                sql_content = file.read()
            
            # Create engine for client database
            engine = create_engine(db_url, echo=True)
            
            # Split SQL content by statements and execute
            statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
            
            with engine.connect() as conn:
                trans = conn.begin()
                try:
                    for statement in statements:
                        if statement and not statement.startswith('--'):
                            try:
                                conn.execute(text(statement))
                            except Exception as e:
                                # Skip duplicate key errors for INSERT statements
                                if ("Duplicate entry" not in str(e) and 
                                    "duplicate key" not in str(e).lower() and
                                    "already exists" not in str(e).lower()):
                                    logger.warning(f"Error executing statement: {e}")
                    trans.commit()
                except Exception as e:
                    trans.rollback()
                    logger.error(f"Error in transaction: {e}")
                    return False
            
            logger.info(f"Created tables in database: {db_name}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating tables in {db_name}: {e}")
            return False
    
    def table_exists(self, domain: str, table_name: str, owner_id: int = None) -> bool:
        """Check if table exists in client database"""
        try:
            session = self.get_client_session(domain, owner_id)
            if session is None:
                return False
            
            inspector = inspect(session.bind)
            tables = inspector.get_table_names()
            session.close()
            
            return table_name in tables
        except Exception as e:
            logger.error(f"Error checking table existence for {domain}.{table_name}: {e}")
            return False
    
    def get_table_columns(self, domain: str, table_name: str, exclude_columns: List[str] = None, owner_id: int = None) -> Optional[List[Dict[str, Any]]]:
        """Get column information for a table, excluding specified columns"""
        if exclude_columns is None:
            exclude_columns = []
        
        try:
            session = self.get_client_session(domain, owner_id)
            if session is None:
                return None
            
            inspector = inspect(session.bind)
            columns = inspector.get_columns(table_name)
            session.close()
            
            # Filter out excluded columns
            filtered_columns = []
            for col in columns:
                if col['name'] not in exclude_columns:
                    filtered_columns.append({
                        'name': col['name'],
                        'type': str(col['type']),
                        'nullable': col['nullable'],
                        'default': col.get('default'),
                        'primary_key': col.get('primary_key', False)
                    })
            
            return filtered_columns
            
        except Exception as e:
            logger.error(f"Error getting columns for {domain}.{table_name}: {e}")
            return None
    
    def get_users_data(self, domain: str, owner_id: int, exclude_columns: List[str] = None) -> Optional[List[Dict[str, Any]]]:
        """Get all user records from the users table, excluding specified columns"""
        if exclude_columns is None:
            exclude_columns = ['password_hash', 'salt', 'reset_token', 'verification_token']
        
        try:
            session = self.get_client_session(domain, owner_id)
            if session is None:
                return None
            
            # Get column information first
            inspector = inspect(session.bind)
            columns = inspector.get_columns('users')
            
            # Build column list excluding sensitive columns
            safe_columns = [col['name'] for col in columns if col['name'] not in exclude_columns]
            
            if not safe_columns:
                session.close()
                return []
            
            # Build SQL query
            columns_str = ', '.join(safe_columns)
            sql = f"SELECT {columns_str} FROM users"
            
            result = session.execute(text(sql))
            rows = result.fetchall()
            
            # Convert to list of dictionaries
            users_data = []
            for row in rows:
                user_dict = {}
                for i, column_name in enumerate(safe_columns):
                    value = row[i]
                    # Convert datetime objects to string for JSON serialization
                    if hasattr(value, 'isoformat'):
                        value = value.isoformat()
                    user_dict[column_name] = value
                users_data.append(user_dict)
            
            session.close()
            return users_data
            
        except Exception as e:
            logger.error(f"Error getting users data for {domain}: {e}")
            return None
    
    def close_connections(self):
        """Close all client database connections"""
        for session_factory in self.client_sessions.values():
            try:
                session_factory.close_all()
            except:
                pass
        
        for engine in self.client_engines.values():
            try:
                engine.dispose()
            except:
                pass
        
        self.client_sessions.clear()
        self.client_engines.clear()

# Global instance
client_db_manager = ClientDatabaseManager() 