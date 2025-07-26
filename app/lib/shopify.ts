import shopify from '../api/initialShopify'

export async function getProducts(options?: { collection_id?: string }) {
  try {
    console.log('🛍️ Fetching products directly from Shopify with options:', options)
    
    const products = await shopify.product.list(options || {})
    
    console.log(`📦 Retrieved ${products.length} products from Shopify`)
    
    return {
      success: true,
      data: products,
      error: null
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Shopify API error:', errorMessage)
    
    return {
      success: false,
      data: null,
      error: errorMessage
    }
  }
}