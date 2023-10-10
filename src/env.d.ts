declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DEBUG: string;
      WS_DEBUG: string;
      ADMIN: string;
      DATABASE_URL: string;
      FRONTEND_URL: string;
      BACKEND_URL: string;
      TWO_FACTOR_AUTHENTICATION_APP_NAME: string;
      JWT_ACCESS_TOKEN_SECRET: string;
      INTRA42_CLIENT_ID: string;
      INTRA42_CLIENT_SECRET: string;
      INTRA42_CALLBACK_URL: string;
    }
  }
}

export {};
