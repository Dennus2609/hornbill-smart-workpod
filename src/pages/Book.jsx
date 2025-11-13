import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const BookPage = () => {
  const GOOGLE_SHEETS_ENDPOINT = import.meta.env.VITE_BOOKING_ENDPOINT
  
  // Debug: Log environment variable on component mount
  useEffect(() => {
    console.log('🔍 Environment check:')
    console.log('  VITE_BOOKING_ENDPOINT:', GOOGLE_SHEETS_ENDPOINT || 'NOT SET')
    console.log('  All env vars:', import.meta.env)
  }, [])
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '' // stores ONLY digits after country code (max 9)
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)

  const isCarouselPaused = true

  const formatUaeMobile = (digits) => {
    const d = (digits || '').replace(/\D/g, '').slice(0, 9)
    const part1 = d.slice(0, 2)
    const part2 = d.slice(2, 6)
    const part3 = d.slice(6, 9)
    const spaced = [part1, part2, part3].filter(Boolean).join(' ')
    return spaced ? `+971 ${spaced}` : '+971 '
  }

  useEffect(() => {
    if (isCarouselPaused) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [isCarouselPaused])

  const carouselImages = [
    { src: "/images/Generated Image September 12, 2025 - 8_19AM (1).png", alt: "Hornbill Workspace - Ergonomic Features" },
    { src: "/images/ChatGPT Image Aug 15, 2025, 02_01_40 PM.png", alt: "Hornbill Workspace - Premium Quality" },
    { src: "/images/h6.HEIC", alt: "Hornbill Workspace - Modern Design" }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'mobile') {
      const digits = value.replace(/\D/g, '')
      const afterCode = digits.startsWith('971') ? digits.slice(3) : digits
      const onlyNine = afterCode.slice(0, 9)
      setFormData(prev => ({ ...prev, mobile: onlyNine }))
      if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }))
      return
    }
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    // Email is optional, but if provided, must be valid
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (formData.mobile.replace(/\D/g, '').length !== 9) newErrors.mobile = 'Enter a valid UAE number: +971 xx xxxx xxx'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const formattedMobile = formatUaeMobile(formData.mobile)
      let submissionSucceeded = false

      // 1) Preferred: send to Google Sheets Apps Script endpoint (if configured)
      if (GOOGLE_SHEETS_ENDPOINT) {
        try {
          console.log('Submitting to Google Sheets:', GOOGLE_SHEETS_ENDPOINT)
          // Use application/x-www-form-urlencoded to avoid CORS preflight with Apps Script
          const urlEncodedBody = new URLSearchParams({
            name: formData.name.trim(),
            email: formData.email.trim(),
            mobile: formattedMobile
          }).toString()

          const response = await fetch(GOOGLE_SHEETS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: urlEncodedBody
          })

          console.log('Google Sheets response status:', response.status, response.statusText)
          const responseText = await response.text().catch(() => '')
          if (responseText) console.log('Google Sheets response:', responseText)

          // Treat any 2xx as success (Apps Script often returns plain text)
          if (response.ok) {
            let isSuccess = false
            try {
              const json = JSON.parse(responseText || '{}')
              isSuccess = json.success !== false
            } catch {
              isSuccess = (responseText || '').toLowerCase().includes('ok')
            }
            if (isSuccess) {
              submissionSucceeded = true
              console.log('✅ Submitted to Google Sheets')
            } else {
              console.warn('Google Sheets responded but did not confirm success, will fall back to Netlify Forms.')
            }
          }
        } catch (err) {
          // fall back to Netlify Forms
          console.error('❌ Google Sheets endpoint failed, falling back to Netlify Forms.', err)
        }
      } else {
        console.log('⚠️ No Google Sheets endpoint configured, using Netlify Forms only')
      }

      // 2) Fallback: Netlify Forms capture (keeps a backup log in Netlify)
      if (!submissionSucceeded) {
        const body = new URLSearchParams({
          'form-name': 'booking',
          name: formData.name,
          email: formData.email,
          mobile: formattedMobile
        }).toString()
        try {
          const netlifyResp = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
          })
          if (netlifyResp.ok) {
            submissionSucceeded = true
          }
        } catch (err) {
          console.error('Netlify Forms submission failed.', err)
        }
      }

      setIsSubmitted(true)
    } catch (_) {
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const Header = () => (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 w-full flex-shrink-0 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <Link to="/" className="text-2xl font-medium text-black hover:opacity-70 transition-opacity" style={{ letterSpacing: '-0.02em' }}>Hornbill</Link>
        </div>
        <div className="justify-self-center">
          <p className="text-xs text-gray-500 hidden sm:block font-light">We ship <span className="font-normal text-black">throughout UAE</span></p>
        </div>
        <div className="justify-self-end">
          <img src="/images/HORNBILL-LOGO.png" alt="Hornbill Logo" className="h-7 w-auto opacity-80" />
        </div>
      </div>
    </header>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>
      <Header />
      <main className="flex-1 w-full flex items-center py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-6 lg:gap-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 lg:min-h-[85vh]">
          
          {/* Mobile hero on top */}
          {!isSubmitted && (
            <div className="block lg:hidden order-1 mb-2">
              <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-3xl shadow-xl">
                <img src="/images/booknow_mobile_image.png" alt="Hornbill SmartPod - Mobile View" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          )}

          <div className="lg:col-span-5 order-2 lg:order-2 flex">
            <form name="booking" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="flex flex-col w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-7 lg:p-8">
              <input type="hidden" name="form-name" value="booking" />
              <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
              
              <div className="flex-shrink-0">
                {!isSubmitted && (
                  <>
                    <div className="mb-5">
                      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-black/5 border border-black/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                        <span className="text-xs font-medium text-black/70 tracking-wide">BOOK NOW</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl text-black font-normal leading-[1.1] mb-3" style={{ letterSpacing: '-0.03em', fontWeight: 400 }}>
                        Book to<br />experience<br />Hornbill
                    </h1>
                      <p className="text-sm text-gray-600 leading-relaxed font-light max-w-md">
                        Share your details and we'll arrange an appointment for you to experience the Hornbill Smart Workpod firsthand.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="John Doe" 
                          className={`w-full px-4 py-3 bg-white border-2 ${focusedField === 'name' ? 'border-black' : 'border-gray-200'} ${errors.name ? 'border-red-500' : ''} rounded-2xl text-black placeholder-gray-400 focus:outline-none transition-all duration-200 font-light`}
                          style={{ fontSize: '15px' }}
                        />
                        {errors.name && (
                          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                          Email <span className="text-gray-400 normal-case">(Optional)</span>
                        </label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="john@example.com" 
                          className={`w-full px-4 py-3 bg-white border-2 ${focusedField === 'email' ? 'border-black' : 'border-gray-200'} ${errors.email ? 'border-red-500' : ''} rounded-2xl text-black placeholder-gray-400 focus:outline-none transition-all duration-200 font-light`}
                          style={{ fontSize: '15px' }}
                        />
                        {errors.email && (
                          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Mobile Number</label>
                        <input 
                          type="tel" 
                          name="mobile" 
                          value={formatUaeMobile(formData.mobile)} 
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('mobile')}
                          onBlur={() => setFocusedField(null)}
                          inputMode="numeric" 
                          autoComplete="tel" 
                          placeholder="+971 50 1234 567" 
                          className={`w-full px-4 py-3 bg-white border-2 ${focusedField === 'mobile' ? 'border-black' : 'border-gray-200'} ${errors.mobile ? 'border-red-500' : ''} rounded-2xl text-black placeholder-gray-400 focus:outline-none transition-all duration-200 font-light`}
                          style={{ fontSize: '15px' }}
                        />
                        {errors.mobile && (
                          <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            {errors.mobile}
                          </p>
                        )}
                    </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-grow flex flex-col justify-end">
                  {!isSubmitted ? (
                    <>
                      <div className="my-5 pt-5 border-t border-gray-100">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="mt-1">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 leading-relaxed font-light">
                              Jebel Ali Building Warehouse no#2, Al Quoz 3<br />Near Mashreq Bank - Sheikh Zayed Rd - Dubai
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <a href="tel:+97143438005" className="text-gray-600 hover:text-black transition-colors flex items-center gap-1.5 font-light">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            +971 4 343 8005
                          </a>
                          <a href="mailto:connect@hornbillinc.com" className="text-gray-600 hover:text-black transition-colors flex items-center gap-1.5 font-light">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            Email us
                          </a>
                          </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-black text-white py-4 rounded-2xl font-medium text-base hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            Book Now
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                      <div className="mb-8 relative">
                        <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center">
                          <svg className="h-10 w-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                      </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-75" />
                      </div>
                      <h2 className="text-3xl font-medium text-black mb-3" style={{ letterSpacing: '-0.02em' }}>All set!</h2>
                      <p className="text-gray-600 mb-8 max-w-sm font-light leading-relaxed">
                        Thanks <span className="font-medium text-black">{formData.name}</span>. We've received your request and will reach out shortly to schedule your visit.
                      </p>
                      <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all font-medium group"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Back to Home
                      </Link>
                    </div>
                  )}
              </div>
            </form>
          </div>

          <div className="hidden lg:block lg:col-span-7 order-2 lg:order-1">
            <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
              {carouselImages.map((image, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" style={{ transform: 'scale(1.1)' }} />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default BookPage 
