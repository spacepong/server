declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      FRONTEND_URL: string;
      BACKEND_URL: string;
      JWT_ACCESS_TOKEN_SECRET: string;
      INTRA42_CLIENT_ID: string;
      INTRA42_CLIENT_SECRET: string;
      INTRA42_CALLBACK_URL: string;
    }
  }
}

export {};
