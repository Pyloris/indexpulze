/**
 * Queue Names Enum Definitions
 *
 * Centralized registry of BullMQ queue identifiers used across
 * publishers, consumers, and workers.
 */
export const QUEUE_NAMES = Object.freeze({
  TICK_INGESTOR_QUEUE: 'tick.ingestor.queue',
});

export default QUEUE_NAMES;
