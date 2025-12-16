import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();

// 🔥 CRÍTICO: Manejar OPTIONS ANTES de CUALQUIER otra cosa
// Esto es especialmente importante en Vercel Serverless Functions
// Este middleware DEBE estar antes de cualquier otro middleware
app.use((req, res, next) => {
  // Manejar preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin as string | undefined;
    const allowedOrigin = env.FRONTEND_URL;
    
    // Log para debugging (solo en desarrollo)
    if (env.NODE_ENV === 'development') {
      logger.info(`OPTIONS request from origin: ${origin}, allowed: ${allowedOrigin}`);
    }
    
    // Siempre responder a OPTIONS, pero solo agregar headers CORS si el origin está permitido
    if (origin && (origin === allowedOrigin || allowedOrigin.includes(origin))) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400'); // 24 horas
    } else if (origin) {
      // Si hay origin pero no coincide, aún responder 200 (algunos navegadores lo requieren)
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
    
    return res.sendStatus(200);
  }
  next();
});

// Configurar CORS para todas las demás requests
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length'],
    maxAge: 86400, // 24 horas
  })
);

// 🔥 CRÍTICO para Vercel: Manejar todas las rutas OPTIONS explícitamente (backup)
// Esto asegura que incluso si el middleware anterior falla, OPTIONS siempre funciona
app.options('*', (req, res) => {
  const origin = req.headers.origin as string | undefined;
  const allowedOrigin = env.FRONTEND_URL;
  
  if (origin && (origin === allowedOrigin || allowedOrigin.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
  }
  return res.sendStatus(200);
});

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter que ignora OPTIONS
const limiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => req.method === 'OPTIONS', // Ignorar OPTIONS en rate limiting
});
app.use('/api/', limiter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Wordle API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Wordle API',
    version: '1.0.0',
  });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

// 🔥 CRÍTICO para Vercel: Solo hacer listen si NO estamos en un entorno serverless
// Vercel usa serverless functions, no necesita app.listen()
const PORT = env.PORT;
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

if (!isVercel) {
  app.listen(PORT, () => {
    logger.info(`🚀 Wordle API server is running on port ${PORT}`);
    logger.info(`📍 Environment: ${env.NODE_ENV}`);
    logger.info(`🔗 http://localhost:${PORT}`);
  });
}

// Exportar para Vercel Serverless Functions
export default app;
