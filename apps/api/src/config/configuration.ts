export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  corsOrigins: string[];
}

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  secret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
  refreshCookieName: string;
}

export default (): {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
} => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT) || 8080,
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
    corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    refreshCookieName: process.env.JWT_REFRESH_COOKIE_NAME ?? 'refreshToken',
  },
});
