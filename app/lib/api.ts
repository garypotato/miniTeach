function getBaseUrl() {
  // In development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // In production, use custom VERCEL_URL from .env file
  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL
  }
  
  // Fallback to default production domain
  return 'https://mini-teach.vercel.app'
}

export function getApiUrl(path: string) {
  return `${getBaseUrl()}${path}`
}

// Helper function specifically for API routes
export function getApiRoute(route: string) {
  return getApiUrl(`/api${route}`)
}