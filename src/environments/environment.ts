import { AppConfig } from '../app/core/config/app.config';

export const environment: AppConfig = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'http://localhost:3000', // Add WebSocket URL
  useMockData: true,
  mockUser: {
    email: 'admin@example.com',
    password: 'admin123',
  },
};
