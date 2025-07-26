'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchFilterProps {
  initialSearch: string
}

export default function SearchFilter({ initialSearch }: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(initialSearch)

  useEffect(() => {
    setSearchInput(initialSearch)
  }, [initialSearch])

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }
    
    // Reset to page 1 when searching
    params.delete('page')
    
    const queryString = params.toString()
    const newUrl = queryString ? `/companions?${queryString}` : '/companions'
    
    router.push(newUrl)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchInput)
  }

  const handleClear = () => {
    setSearchInput('')
    const params = new URLSearchParams(searchParams)
    params.delete('search')
    params.delete('page')
    
    const queryString = params.toString()
    const newUrl = queryString ? `/companions?${queryString}` : '/companions'
    
    router.push(newUrl)
  }

  return (
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search companions by name..."
              className="block w-full pl-12 pr-20 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-colors"
            />
            
            {searchInput && (
              <div className="absolute inset-y-0 right-16 flex items-center">
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="submit"
                className="h-full px-6 text-white font-medium rounded-r-xl transition-colors hover:opacity-90"
                style={{backgroundColor: '#47709B'}}
              >
                Search
              </button>
            </div>
          </div>
        </form>
        
        {initialSearch && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Searching for: <strong>"{initialSearch}"</strong></span>
            </div>
            <button
              onClick={handleClear}
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{color: '#47709B'}}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}