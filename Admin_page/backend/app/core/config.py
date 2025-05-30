from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "new_password"
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str = "admin_page_db"
    CORS_ORIGINS: list[str] = ["*"]  # TODO: Change to your frontend DNS in production

    @property
    def database_url(self):
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"

settings = Settings() 