import { metricsCollector } from './MetricsCollector.js';

export class ConnectionManager {
  constructor() {
    /** @type {Map<string, import('./ConnectionSession.js').ConnectionSession>} */
    this.sessionsById = new Map();
    /** @type {Map<import('ws').WebSocket, import('./ConnectionSession.js').ConnectionSession>} */
    this.sessionsByWs = new Map();
    /** @type {Map<string, Set<import('./ConnectionSession.js').ConnectionSession>>} */
    this.sessionsByUser = new Map();
  }

  /**
   * Registers a new connection session
   * @param {import('./ConnectionSession.js').ConnectionSession} session
   */
  register(session) {
    this.sessionsById.set(session.id, session);
    this.sessionsByWs.set(session.ws, session);

    if (session.user && (session.user.id || session.user._id)) {
      const userId = String(session.user.id || session.user._id);
      if (!this.sessionsByUser.has(userId)) {
        this.sessionsByUser.set(userId, new Set());
      }
      this.sessionsByUser.get(userId).add(session);
    }

    metricsCollector.recordConnection();
  }

  /**
   * Updates user association when session is authenticated after handshake
   * @param {import('./ConnectionSession.js').ConnectionSession} session
   * @param {any} user
   */
  associateUser(session, user) {
    session.setUser(user);
    const userId = String(user.id || user._id);
    if (!this.sessionsByUser.has(userId)) {
      this.sessionsByUser.set(userId, new Set());
    }
    this.sessionsByUser.get(userId).add(session);
  }

  /**
   * Removes a connection session
   * @param {import('ws').WebSocket} ws
   * @returns {import('./ConnectionSession.js').ConnectionSession|null}
   */
  unregister(ws) {
    const session = this.sessionsByWs.get(ws);
    if (!session) return null;

    this.sessionsByWs.delete(ws);
    this.sessionsById.delete(session.id);

    if (session.user && (session.user.id || session.user._id)) {
      const userId = String(session.user.id || session.user._id);
      const userSessions = this.sessionsByUser.get(userId);
      if (userSessions) {
        userSessions.delete(session);
        if (userSessions.size === 0) {
          this.sessionsByUser.delete(userId);
        }
      }
    }

    session.clearSubscriptions();
    metricsCollector.recordDisconnection();
    return session;
  }

  getByWs(ws) {
    return this.sessionsByWs.get(ws) || null;
  }

  getById(id) {
    return this.sessionsById.get(id) || null;
  }

  getByUser(userId) {
    return this.sessionsByUser.get(String(userId)) || new Set();
  }

  getAll() {
    return Array.from(this.sessionsById.values());
  }

  count() {
    return this.sessionsById.size;
  }
}
