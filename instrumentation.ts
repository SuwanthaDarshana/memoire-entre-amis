export async function register() {
  const { validateEnv } = await import('@/lib/security')
  validateEnv()
}
