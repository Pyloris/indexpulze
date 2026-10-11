export class MetricsCollector {
  constructor() {
    this.connectionsTotal = 0;
    this.connectionsActive = 0;
    this.connectionsClosed = 0;
    this.connectionsRejected = 0;

    this.messagesIn = 0;
    this.messagesOut = 0;
    this.bytesOut = 0;

    this.subscriptionsActive = 0;
    this.eventsProcessed = 0;
    this.eventsDroppedSlowClient = 0;
    this.authFailures = 0;
    this.errorsTotal = 0;

    this.subscriptionsByChannel = new Map();
  }

  recordConnection() {
    this.connectionsTotal++;
    this.connectionsActive++;
  }

  recordDisconnection() {
    this.connectionsActive = Math.max(0, this.connectionsActive - 1);
    this.connectionsClosed++;
  }

  recordRejection() {
    this.connectionsRejected++;
  }

  recordInboundMessage() {
    this.messagesIn++;
  }

  recordOutboundMessage(bytes = 0) {
    this.messagesOut++;
    this.bytesOut += bytes;
  }

  recordSubscription(channel) {
    this.subscriptionsActive++;
    const count = this.subscriptionsByChannel.get(channel) || 0;
    this.subscriptionsByChannel.set(channel, count + 1);
  }

  recordUnsubscription(channel) {
    this.subscriptionsActive = Math.max(0, this.subscriptionsActive - 1);
    const count = this.subscriptionsByChannel.get(channel) || 0;
    if (count <= 1) {
      this.subscriptionsByChannel.delete(channel);
    } else {
      this.subscriptionsByChannel.set(channel, count - 1);
    }
  }

  recordEventProcessed() {
    this.eventsProcessed++;
  }

  recordDroppedEvent() {
    this.eventsDroppedSlowClient++;
  }

  recordAuthFailure() {
    this.authFailures++;
  }

  recordError() {
    this.errorsTotal++;
  }

  getSnapshot() {
    return {
      connections: {
        active: this.connectionsActive,
        total: this.connectionsTotal,
        closed: this.connectionsClosed,
        rejected: this.connectionsRejected
      },
      throughput: {
        messagesIn: this.messagesIn,
        messagesOut: this.messagesOut,
        bytesOut: this.bytesOut,
        eventsProcessed: this.eventsProcessed,
        eventsDroppedSlowClient: this.eventsDroppedSlowClient
      },
      subscriptions: {
        totalActive: this.subscriptionsActive,
        uniqueChannels: this.subscriptionsByChannel.size
      },
      security: {
        authFailures: this.authFailures,
        errorsTotal: this.errorsTotal
      }
    };
  }
}

export const metricsCollector = new MetricsCollector();
