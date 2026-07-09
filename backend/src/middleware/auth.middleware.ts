import { Request, Response, NextFunction } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { env } from '../config/env';
import { ApiResponse } from '../types';

interface SupabaseAccessTokenPayload {
  sub: string;
}

const jwks = createRemoteJWKSet(
  new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

async function verifySupabaseToken(token: string): Promise<SupabaseAccessTokenPayload> {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: `${env.SUPABASE_URL}/auth/v1`,
  });
  return payload as unknown as SupabaseAccessTokenPayload;
}

/**
 * Verifies the Supabase-issued access token sent by the frontend and
 * attaches the authenticated user's id to the request. Endpoints that use
 * this must read the user id from req.userId, never from a URL/body param,
 * so a caller can't act on another user's data by changing an id.
 */
export async function requireAuth(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ success: false, error: 'Missing authorization token' });
    return;
  }

  try {
    const payload = await verifySupabaseToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

/**
 * Same verification as requireAuth, but lets the request through when no
 * (or an invalid) token is present — for endpoints guests can also use.
 * Only sets req.userId when the token actually checks out.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (token) {
    try {
      const payload = await verifySupabaseToken(token);
      req.userId = payload.sub;
    } catch {
      // Ignore invalid tokens on optional routes — treat as a guest.
    }
  }

  next();
}
