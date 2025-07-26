function getBaseUrl() {
  const isDev = process.env.NODE_ENV === 'development'
  const customUrl = process.env.VERCEL_URL
  const fallbackUrl = 'https://mini-teach.vercel.app'
  
  let baseUrl: string
  
  if (isDev) {
    baseUrl = 'http://localhost:3000'
  } else if (customUrl) {
    baseUrl = customUrl
  } else {
    baseUrl = fallbackUrl
  }
  
  console.log('🌐 API Base URL:', {
    isDev,
    customUrl,
    fallbackUrl,
    finalUrl: baseUrl
  })
  
  return baseUrl
}

export function getApiUrl(path: string) {
  return `${getBaseUrl()}${path}`
}

// Helper function specifically for API routes
export function getApiRoute(route: string) {
  return getApiUrl(`/api${route}`)
}