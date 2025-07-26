'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

interface CompanionsSectionProps {
  initialCompanions: Companion[]
}

const extractTextFromHtml = (html: string) => {
  // Use consistent server/client approach
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&') // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

async function fetchMoreCompanions(excludeIds: number[]): Promise<Companion[]> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collection_id: '491355177275' }),
    })
    
    const data = await response.json()
    if (data.success && data.data) {
      // Filter out companions that are already displayed
      const availableCompanions = data.data.filter((companion: Companion) => 
        !excludeIds.includes(companion.id)
      )
      
      // Shuffle the available companions
      const shuffled = [...availableCompanions]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      
      // Return up to 8 more companions
      return shuffled.slice(0, 8)
    }
    return []
  } catch (error) {
    console.error('Error fetching more companions:', error)
    return []
  }
}

export default function CompanionsSection({ initialCompanions }: CompanionsSectionProps) {
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMoreAvailable, setHasMoreAvailable] = useState(true)

  const loadMoreCompanions = async () => {
    setLoadingMore(true)
    
    try {
      // Get IDs of currently displayed companions
      const currentIds = companions.map(c => c.id)
      
      // Fetch more companions excluding current ones
      const moreCompanions = await fetchMoreCompanions(currentIds)
      
      if (moreCompanions.length > 0) {
        setCompanions(prev => [...prev, ...moreCompanions])
      }
      
      // If we got fewer than 8, we might be running low on companions
      if (moreCompanions.length < 8) {
        setHasMoreAvailable(false)
      }
    } catch (error) {
      console.error('Error loading more companions:', error)
    } finally {
      setTimeout(() => {
        setLoadingMore(false)
      }, 300)
    }
  }

  const resetCompanions = () => {
    // Reset to initial companions and shuffle them
    const shuffled = [...initialCompanions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    setCompanions(shuffled)
    setHasMoreAvailable(true)
    document.getElementById('companions-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="companions-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Companions</h3>
          <p className="text-lg text-gray-600">
            {`Discover caring professionals ready to support your child's journey`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companions.map((companion) => (
            <Link 
              href={`/companion/${companion.id}`} 
              key={companion.id}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-opacity-60">
                <div 
                  className="aspect-square relative overflow-hidden"
                  style={{background: 'linear-gradient(to bottom right, #AFC8DA, #e2eef7)'}}
                >
                  {companion.image?.src ? (
                    <Image
                      src={companion.image.src}
                      alt={companion.image.alt || companion.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{backgroundColor: '#AFC8DA'}}
                      >
                        <span className="text-2xl font-bold" style={{color: '#47709B'}}>
                          {companion.title.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {companion.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {truncateText(extractTextFromHtml(companion.body_html), 120)}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium" style={{color: '#47709B'}}>
                    <span>View Profile</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMoreAvailable && (
          <div className="text-center mt-12">
            <button 
              onClick={loadMoreCompanions}
              disabled={loadingMore}
              className="inline-flex items-center text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{backgroundColor: '#47709B'}}
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading More...
                </>
              ) : (
                <>
                  View More Companions
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Showing {companions.length} companions
            </p>
          </div>
        )}

        {!hasMoreAvailable && companions.length > 8 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              {`You've seen ${companions.length} companions!`} 
            </p>
            <button 
              onClick={resetCompanions}
              className="inline-flex items-center border-2 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50"
              style={{borderColor: '#47709B', color: '#47709B'}}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Show Different Companions
            </button>
          </div>
        )}
      </div>
    </section>
  )
}