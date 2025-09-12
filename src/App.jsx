import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import HomePage from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Services from './pages/Services'
import Contact from './pages/Contact'
import BookPage from './pages/Book'
import TermsPage from './pages/Terms'
import PressPage from './pages/Press'
import NewsroomPage from './pages/Newsroom'
import PrivacyPage from './pages/Privacy'

function Preloader({ fadeOut = false }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 350ms ease' }}
    >
      <div className="relative">
        {/* Thin gradient stroke ring */}
        <svg
          className="animate-spin"
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'blur(0.2px)' }}
        >
          <defs>
            <linearGradient id="hbGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DD2C00"/>
              <stop offset="50%" stopColor="#F26722"/>
              <stop offset="100%" stopColor="#FEC300"/>
            </linearGradient>
            <mask id="dashMask">
              <circle cx="36" cy="36" r="30" stroke="white" strokeWidth="6" strokeDasharray="150 200" strokeLinecap="round"/>
            </mask>
          </defs>
          {/* background faint ring */}
          <circle cx="36" cy="36" r="30" stroke="#E5E7EB" strokeWidth="2" />
          {/* gradient arc */}
          <g mask="url(#dashMask)">
            <circle cx="36" cy="36" r="30" stroke="url(#hbGrad)" strokeWidth="4" strokeLinecap="round"/>
          </g>
        </svg>
        {/* Soft blend for premium feel */}
        <div className="absolute inset-0 rounded-full bg-white/40 mix-blend-screen" />
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full animate-[pulseRing_1300ms_ease-out_infinite]" style={{ boxShadow: '0 0 0 0 rgba(0,0,0,0.08)' }} />
      </div>
    </div>
  )
}

function App() {
  const [isReady, setIsReady] = useState(false)
  const [hidePreloader, setHidePreloader] = useState(false)

  useEffect(() => {
    let cancelled = false

    const onWindowLoad = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })

    const onFonts = (document.fonts && document.fonts.ready) ? document.fonts.ready.catch(() => {}) : Promise.resolve()

    const heroPoster = new Promise((resolve) => {
      const img = new Image()
      img.src = '/images/smartworkpod-hero-desktop.jpg'
      if (img.complete) resolve()
      else {
        img.onload = () => resolve()
        img.onerror = () => resolve()
      }
    })

    const preloadImage = (src) => new Promise((resolve) => {
      const i = new Image()
      i.src = src
      if (i.complete) resolve()
      else {
        i.onload = () => resolve()
        i.onerror = () => resolve()
      }
    })

    // Preload Book page hero/carousel images as requested
    const bookImages = [
      '/images/ChatGPT Image Aug 15, 2025, 02_02_29 PM.png',
      '/images/Generated Image September 12, 2025 - 8_19AM (1).png',
      '/images/ChatGPT Image Aug 15, 2025, 02_01_40 PM.png',
      '/images/h6.HEIC',
      '/images/HORNBILL-LOGO.png'
    ]

    const bookPreloads = Promise.all(bookImages.map(preloadImage))

    const heroVideoMeta = new Promise((resolve) => {
      try {
        const v = document.createElement('video')
        v.preload = 'metadata'
        v.muted = true
        v.src = '/images/WhatsApp Video 2025-09-08 at 6.21.18 AM.mp4'
        const done = () => resolve()
        v.addEventListener('loadeddata', done, { once: true })
        v.addEventListener('error', done, { once: true })
        v.load()
      } catch {
        resolve()
      }
    })

    const minimumShow = new Promise((r) => setTimeout(r, 500))
    const hardTimeout = new Promise((r) => setTimeout(r, 10000))

    Promise.race([
      Promise.all([minimumShow, onWindowLoad, onFonts, heroPoster, heroVideoMeta, bookPreloads]),
      hardTimeout
    ]).then(() => { if (!cancelled) setIsReady(true) })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!isReady) return
    const t = setTimeout(() => setHidePreloader(true), 600)
    return () => clearTimeout(t)
  }, [isReady])

  return (
    <>
      {!hidePreloader && <Preloader fadeOut={isReady} />}
      <div className="App" style={{ opacity: isReady ? 1 : 0, transition: 'opacity 400ms ease' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/newsroom" element={<NewsroomPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App 