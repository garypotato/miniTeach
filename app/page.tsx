import Link from 'next/link'
import CompanionsSection from './components/CompanionsSection'

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
    const response = await fetch('http://localhost:3000/api/products', {
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

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)'}}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{color: '#47709B'}}>MiniTeach</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:opacity-80 font-medium">
                Home
              </Link>
              <Link href="/companions" className="text-gray-700 hover:opacity-80 font-medium">
                All Companions
              </Link>
              <Link href="/about" className="text-gray-700 hover:opacity-80 font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="block" style={{color: '#47709B'}}>Child Companion</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {`Connect with qualified, caring educators and companions who will nurture your child's growth and development in a safe, supportive environment.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/companions"
              className="text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90 inline-block text-center"
              style={{backgroundColor: '#47709B'}}
            >
              Browse Companions
            </Link>
            <button 
              className="border-2 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50"
              style={{borderColor: '#47709B', color: '#47709B'}}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Featured Companions - Client Component */}
      <CompanionsSection initialCompanions={initialCompanions} />

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MiniTeach?</h3>
            <p className="text-lg text-gray-600">
              We connect families with qualified, caring professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{backgroundColor: '#AFC8DA'}}
              >
                <svg className="w-8 h-8" style={{color: '#47709B'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Verified Professionals</h4>
              <p className="text-gray-600">All companions are thoroughly vetted with proper qualifications and background checks.</p>
            </div>

            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{backgroundColor: '#AFC8DA'}}
              >
                <svg className="w-8 h-8" style={{color: '#47709B'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Personalized Care</h4>
              <p className="text-gray-600">{`Each companion provides individualized attention tailored to your child's unique needs.`}</p>
            </div>

            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{backgroundColor: '#AFC8DA'}}
              >
                <svg className="w-8 h-8" style={{color: '#47709B'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Educational Focus</h4>
              <p className="text-gray-600">Our companions combine fun activities with learning opportunities for holistic development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-2xl font-bold mb-4" style={{color: '#47709B'}}>MiniTeach</h5>
              <p className="text-gray-400">
                Connecting families with qualified child companions and educators.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Services</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/companions" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Find Companions</Link></li>
                <li><Link href="/about" className="hover:opacity-80" style={{color: '#AFC8DA'}}>About Us</Link></li>
                <li><Link href="/contact" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Help Center</Link></li>
                <li><Link href="/safety" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Safety</Link></li>
                <li><Link href="/terms" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Terms</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Connect</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Facebook</Link></li>
                <li><Link href="#" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Instagram</Link></li>
                <li><Link href="#" className="hover:opacity-80" style={{color: '#AFC8DA'}}>Twitter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MiniTeach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}