import HomePage from './components/HomePage'
import { getProducts } from './lib/shopify'

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

const shuffleArray = (array: Companion[]) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

async function getInitialCompanions(): Promise<Companion[]> {
  try {
    console.log('🔍 Server-side: Getting companions directly from Shopify')
    
    const result = await getProducts({ collection_id: '491355177275' })
    
    console.log('📦 Shopify result:', JSON.stringify(result, null, 2))
    
    if (result.success && result.data) {
      console.log(`✅ Found ${result.data.length} companions, returning ${Math.min(8, result.data.length)}`)
      return shuffleArray(result.data).slice(0, 8)
    }
    
    console.log('⚠️ Shopify returned no data or unsuccessful response:', result.error)
    return []
  } catch (error) {
    console.error('❌ Error fetching initial companions:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

export default async function Home() {
  const initialCompanions = await getInitialCompanions()

  return <HomePage initialCompanions={initialCompanions} />
}