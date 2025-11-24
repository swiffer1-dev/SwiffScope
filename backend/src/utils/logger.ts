export function logInfo(msg: string, meta?: any) {
  console.log('[INFO]', msg, meta || '');
}

export function logError(msg: string, meta?: any) {
  console.error('[ERROR]', msg, meta || '');
}
