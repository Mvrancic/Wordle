const logLevels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
} as const;

type LogLevel = typeof logLevels[keyof typeof logLevels];

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[${logLevels.INFO}] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[${logLevels.WARN}] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[${logLevels.ERROR}] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logLevels.DEBUG}] ${message}`, ...args);
    }
  },
};

