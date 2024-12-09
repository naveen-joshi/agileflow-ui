export interface AppConfig {
  production: boolean;
  apiUrl: string;
  wsUrl: string;
  useMockData: boolean;
  mockUser: {
    email: string;
    password: string;
  };
}
