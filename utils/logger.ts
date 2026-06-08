// utils/logger.ts
const isDev = __DEV__;
export const logger = {
  log: (...args: unknown[]) => isDev && console.log(...args),
  error: (...args: unknown[]) => isDev && console.error(...args),
};