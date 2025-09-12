import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const BookPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '' // stores ONLY digits after country code (max 9)
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
      // Accept input typed as "+971..." or just digits; keep only 9 digits AFTER the country code
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
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
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
      const body = new URLSearchParams({ 'form-name': 'booking', name: formData.name, email: formData.email, mobile: formattedMobile }).toString()
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      })
      setIsSubmitted(true)
    } catch (_) {
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const Header = () => (
    <header className="bg-white border-b border-gray-200 w-full flex-shrink-0">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <Link to="/" className="text-3xl font-medium text-black hover:opacity-80 transition-opacity">Hornbill</Link>
        </div>
        <div className="justify-self-center">
          <p className="text-sm text-gray-500 hidden sm:block">We ship throughout UAE</p>
        </div>
        <div className="justify-self-end">
          <img src="/images/HORNBILL-LOGO.png" alt="Hornbill Logo" className="h-8 w-auto" />
        </div>
      </div>
    </header>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>
      <Header />
      <main className="flex-1 w-full flex flex-col overflow-hidden">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 w-full gap-4 lg:gap-8 h-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4 sm:pt-6">
          
          {/* Mobile hero on top (hidden on success to center content) */}
          {!isSubmitted && (
            <div className="block lg:hidden order-1 mb-2">
              <div className="relative w-full h-56 sm:h-72 overflow-hidden rounded-2xl">
                <img src="/images/ChatGPT Image Aug 15, 2025, 02_02_29 PM.png" alt={carouselImages[0].alt} className="w-full h-full object-cover" />
              </div>
              <div className="w-full h-px bg-gray-200 mt-4" />
            </div>
          )}

          <div className="lg:col-span-4 order-2 lg:order-2 flex flex-col h-full">
            <form name="booking" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit} className="flex flex-col h-full">
              <input type="hidden" name="form-name" value="booking" />
              <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
              
              <div className="flex-shrink-0">
                {!isSubmitted && (
                  <div className="mb-8">
                    <h1 className="text-5xl lg:text-6xl text-gray-900 leading-none mb-0 sm:mb-0">
                      <span className="text-gray-400 font-medium">Book your</span><br />
                      <span className="text-gray-900 font-medium">Hornbill</span>
                    </h1>
                  </div>
                )}

                {!isSubmitted && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Name.</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition ${errors.name && 'ring-2 ring-red-500'}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Email ID.</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email address" className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition ${errors.email && 'ring-2 ring-red-500'}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Mobile number.</label>
                      <input type="tel" name="mobile" value={formatUaeMobile(formData.mobile)} onChange={handleInputChange} inputMode="numeric" autoComplete="tel" placeholder="+971 xx xxxx xxx" className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition ${errors.mobile && 'ring-2 ring-red-500'}`} />
                      {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-grow flex flex-col justify-center">
                  {!isSubmitted ? (
                    <>
                      <div className="w-full h-px bg-gray-200 mb-4 lg:mb-8"></div>
                      <div className="text-center py-4 lg:py-8 max-w-sm mx-auto">
                          <p className="text-sm text-gray-400">We ship <span className="font-medium text-black">throughout UAE</span></p>
                          <div className="mt-4 space-y-1">
                            <p className="text-xs text-gray-500">Prefer a quick chat? Call us at <a href="tel:+97143438005" className="text-gray-700 underline hover:text-black">+971 4 343 8005</a>.</p>
                            <p className="text-xs text-gray-500">Or write to <a href="mailto:connect@hornbillinc.com" className="text-gray-700 underline hover:text-black">connect@hornbillinc.com</a> — we typically reply within a day.</p>
                          </div>
                      </div>
                      <div className="w-full h-px bg-gray-200 mt-4 lg:mt-8"></div>
                    </>
                  ) : (
                    <div className="flex-1 success-hero py-10 min-h-[50vh]">
                      <div className="mx-auto mb-6">
                        <span className="success-check-circle">
                          <svg className="h-12 w-12 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path className="success-check-path" d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      </div>
                      <h2 className="text-3xl font-semibold text-gray-900">All set!</h2>
                      <p className="text-gray-600 mt-2">Thanks {formData.name}. We’ve received your request and will reach out shortly.</p>
                      <div className="mt-6 flex justify-center">
                        <Link to="/" className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800">Back to Home</Link>
                      </div>
                    </div>
                  )}
              </div>

              {!isSubmitted && (
                <div className="flex-shrink-0">
                  <div className="text-center my-6">
                    <p className="text-gray-500" style={{ fontSize: '11px' }}>Jebel Ali Building Warehouse no#2, Al Quoz 3 Near Mashreq Bank - Sheikh Zayed Rd - Dubai</p>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 rounded-lg font-medium text-base hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center">
                    {isLoading ? 'Processing...' : 'Book Now'}
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="hidden lg:block lg:col-span-8 order-2 lg:order-1 h-full w-full">
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              {carouselImages.map((image, index) => (
                <div key={index} className={`absolute inset-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </div>
              ))}
              {/* Dots hidden on all sizes */}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default BookPage 