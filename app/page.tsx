import HomePage from './components/HomePage'
import { getApiRoute } from './lib/api'

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
    const response = await fetch(getApiRoute('/products'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collection_id: '491355177275' }),
      cache: 'no-store' // Ensure fresh data on each request
    })
    
    const data = await response.json()
    if (data.success && data.data) {
      return shuffleArray(data.data).slice(0, 8)
    }
    return []
  } catch (error) {
    console.error('Error fetching initial companions:', error)
    return []
  }
}

export default async function Home() {
  const initialCompanions = await getInitialCompanions()

  return <HomePage initialCompanions={initialCompanions} />
}