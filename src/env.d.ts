declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
      JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
      JWT_ACCESS_TOKEN_SECRET: string;
      JWT_REFRESH_TOKEN_SECRET: string;
      INTRA42_CLIENT_ID: string;
      INTRA42_CLIENT_SECRET: string;
      INTRA42_CALLBACK_URL: string;
    }
  }
}

export {}
