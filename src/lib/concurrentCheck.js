// Concurrent check utilities for optimistic concurrency control

/**
 * Stamp a record with an update timestamp
 */
export function stampRecord(record) {
  return { ...record, _updatedAt: Date.now() }
}

/**
 * Check if there's a conflict (record was modified since we last read it)
 */
export function hasConflict(readTimestamp, currentTimestamp) {
  if (!readTimestamp || !currentTimestamp) return false
  return currentTimestamp > readTimestamp
}

/**
 * Generate a conflict error message in Thai
 */
export function conflictMessage(entityName) {
  return `ข้อมูล${entityName}ถูกแก้ไขโดยผู้ใช้อื่น กรุณาโหลดข้อมูลใหม่`
}
