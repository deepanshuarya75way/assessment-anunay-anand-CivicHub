export const logger = {
  info: (msg: string, ...meta: any[]) => console.log(`[${new Date().toISOString()}] [INFO] ${msg}`, ...meta),
  error: (msg: string, ...meta: any[]) => console.error(`[${new Date().toISOString()}] [ERROR] ${msg}`, ...meta),
  warn: (msg: string, ...meta: any[]) => console.warn(`[${new Date().toISOString()}] [WARN] ${msg}`, ...meta),
  debug: (msg: string, ...meta: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] [DEBUG] ${msg}`, ...meta);
    }
  },
};
