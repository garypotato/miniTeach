'use client'

import { useState } from 'react'
import Link from 'next/link'
import CompanionsSection from './CompanionsSection'
import LanguageSwitch from './LanguageSwitch'
import GoToTop from './GoToTop'
import { useLanguage } from '../hooks/useLanguage'

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

interface HomePageProps {
  initialCompanions: Companion[]
}

export default function HomePage({ initialCompanions }: HomePageProps) {
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)'}}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{color: '#47709B'}}>MiniTeach</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-gray-700 hover:opacity-80 font-medium">
                {t('nav.home')}
              </Link>
              <Link href="/companions" className="text-gray-700 hover:opacity-80 font-medium">
                {t('nav.allCompanions')}
              </Link>
              <Link href="/about" className="text-gray-700 hover:opacity-80 font-medium">
                {t('nav.about')}
              </Link>
              <LanguageSwitch />
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <LanguageSwitch />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:opacity-80 focus:outline-none focus:opacity-80"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu - Overlay */}
          <div className={`md:hidden absolute top-16 left-0 right-0 z-50 bg-white border-t shadow-lg transform transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                href="/companions" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.allCompanions')}
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
            <span className="block" style={{color: '#47709B'}}>{t('hero.subtitle')}</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/companions"
              className="text-white px-8 py-3 rounded-full font-semibold transition-colors hover:opacity-90 inline-block text-center"
              style={{backgroundColor: '#47709B'}}
            >
              {t('hero.browseCompanions')}
            </Link>
            <button 
              className="border-2 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-50"
              style={{borderColor: '#47709B', color: '#47709B'}}
            >
              {t('hero.learnMore')}
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
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('features.title')}</h3>
            <p className="text-lg text-gray-600">
              {t('features.subtitle')}
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
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('features.verified.title')}</h4>
              <p className="text-gray-600">{t('features.verified.description')}</p>
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
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('features.personalized.title')}</h4>
              <p className="text-gray-600">{t('features.personalized.description')}</p>
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
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('features.educational.title')}</h4>
              <p className="text-gray-600">{t('features.educational.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-2xl font-bold mb-4" style={{color: '#47709B'}}>{t('footer.company')}</h5>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">{t('footer.services')}</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/companions" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.findCompanions')}</Link></li>
                <li><Link href="/about" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.aboutUs')}</Link></li>
                <li><Link href="/contact" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">{t('footer.support')}</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.helpCenter')}</Link></li>
                <li><Link href="/safety" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.safety')}</Link></li>
                <li><Link href="/terms" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.terms')}</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">{t('footer.connect')}</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.facebook')}</Link></li>
                <li><Link href="#" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.instagram')}</Link></li>
                <li><Link href="#" className="hover:opacity-80" style={{color: '#AFC8DA'}}>{t('footer.twitter')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Go to Top Button */}
      <GoToTop />
    </div>
  )
}