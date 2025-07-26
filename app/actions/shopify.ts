'use server'

import { getProducts } from '../lib/shopify'

interface Companion {
  id: number
  title: string
  body_html: string
  handle: string
  image?: {
    src: string
    alt: string | null
  }
}

export async function getCompanionsAction(options?: { collection_id?: string }): Promise<{
  success: boolean
  data: Companion[] | null
  error: string | null
}> {
  try {
    const result = await getProducts(options)
    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Server action error:', errorMessage)
    
    return {
      success: false,
      data: null,
      error: errorMessage
    }
  }
}