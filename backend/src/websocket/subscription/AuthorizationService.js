export class AuthorizationService {
  /**
   * Validates if a user has permission to subscribe to a specific channel
   * @param {any} user
   * @param {{ prefix: string, symbol: string, modifier?: string }} parsedChannel
   * @returns {{ authorized: boolean, reason?: string }}
   */
  static authorizeSubscription(user, parsedChannel) {
    if (!user) {
      return { authorized: false, reason: 'Authentication required for real-time market data access' };
    }

    // Role-based or tier-based authorization checks can be extended here
    // In our system, authenticated users have standard tier access
    return { authorized: true };
  }
}
