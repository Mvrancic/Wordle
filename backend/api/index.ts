// Vercel Serverless Function entry point
// Este archivo permite que Vercel detecte automáticamente la función serverless
// Vercel compilará este archivo y src/index.ts automáticamente

import app from '../src/index';

// Para Vercel, simplemente exportamos la app de Express
// Vercel automáticamente la convierte en una serverless function
// El middleware de CORS en src/index.ts ya maneja OPTIONS correctamente
export default app;

