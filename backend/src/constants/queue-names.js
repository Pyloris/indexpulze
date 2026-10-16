/**
 * Queue Names Enum Definitions
 *
 * Centralized registry of BullMQ queue identifiers used across
 * publishers, consumers, and workers.
 */
export const QUEUE_NAMES = Object.freeze({
  TICK_INGESTOR_QUEUE: 'tick.ingestor.queue',
  VOLUME_PROFILE_QUEUE: 'volume.profile.queue',
  INDEX_VOLUME_PROFILE_QUEUE: 'index.volume.profile.queue',
});

export default QUEUE_NAMES;
