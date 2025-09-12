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

function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
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

  useEffect(() => {
    let done = false
    const finish = () => { if (!done) { done = true; setIsReady(true) } }

    const onLoad = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(finish).catch(finish)
      } else {
        finish()
      }
    }

    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    const timeout = setTimeout(finish, 6000)
    return () => { window.removeEventListener('load', onLoad); clearTimeout(timeout) }
  }, [])

  return (
    <div className="App">
      {!isReady && <Preloader />}
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
  )
}

export default App 