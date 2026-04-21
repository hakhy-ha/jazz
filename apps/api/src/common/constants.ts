export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'super-secret-jwt-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key'
};
