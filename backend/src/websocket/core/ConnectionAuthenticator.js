import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app-config.js';

export class ConnectionAuthenticator {
  /**
   * Attempts to authenticate a WebSocket connection during HTTP upgrade
   * Supports:
   * 1. Authorization: Bearer <token> in headers
   * 2. Sec-WebSocket-Protocol: token, <token>
   * 3. ?token=<token> in URL query string
   *
   * @param {import('http').IncomingMessage} request
   * @returns {{ user: any | null, token: string | null }}
   */
  static authenticateUpgrade(request) {
    let token = null;

    // 1. Check Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Check query string (?token=...)
    if (!token && request.url) {
      try {
        const host = request.headers.host || 'localhost';
        const parsedUrl = new URL(`http://${host}${request.url}`);
        token = parsedUrl.searchParams.get('token');
      } catch (err) {
        // ignore parse error
      }
    }

    // 3. Check Sec-WebSocket-Protocol
    if (!token && request.headers['sec-websocket-protocol']) {
      const protocols = request.headers['sec-websocket-protocol'].split(',').map(s => s.trim());
      const tokenIndex = protocols.indexOf('token');
      if (tokenIndex !== -1 && protocols[tokenIndex + 1]) {
        token = protocols[tokenIndex + 1];
      }
    }

    if (!token) {
      return { user: null, token: null };
    }

    try {
      const decoded = jwt.verify(token, appConfig.JWT_SECRET);
      return { user: decoded, token };
    } catch (err) {
      return { user: null, token, error: err.message };
    }
  }

  /**
   * Verifies an application-level token payload
   * @param {string} token
   * @returns {{ user: any | null, error?: string }}
   */
  static verifyToken(token) {
    if (!token) return { user: null, error: 'Token is required' };
    try {
      const decoded = jwt.verify(token, appConfig.JWT_SECRET);
      return { user: decoded };
    } catch (err) {
      return { user: null, error: 'Invalid or expired token' };
    }
  }
}
