export async function register() {
  // Only validate env vars at runtime, not during build
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    const { validateEnv } = await import('@/lib/security')
    validateEnv()
  }
}
