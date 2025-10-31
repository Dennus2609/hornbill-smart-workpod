import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'

const AboutPage = () => {
	// Motion preferences
	const [reduceMotion, setReduceMotion] = useState(false)
	useEffect(() => {
		try {
			const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
			setReduceMotion(mq.matches)
			const handler = (e) => setReduceMotion(e.matches)
			mq.addEventListener?.('change', handler)
			return () => mq.removeEventListener?.('change', handler)
		} catch {}
	}, [])

	// Scroll to top function
	const scrollToTop = () => {
		const startTime = performance.now()
		const startScroll = window.pageYOffset
		const duration = 1200
		
		const easeInOutCubic = (t) => {
			return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
		}
		
		const animateScroll = (currentTime) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)
			const easedProgress = easeInOutCubic(progress)
			
			window.scrollTo(0, startScroll * (1 - easedProgress))
			
			if (progress < 1) {
				requestAnimationFrame(animateScroll)
			}
		}
		
		requestAnimationFrame(animateScroll)
	}

	// Observe sections for header color change
	const heroRef = useRef(null)
	const [isHeroVisible, setIsHeroVisible] = useState(true)
	const [isDarkSection, setIsDarkSection] = useState(false)
	
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => setIsHeroVisible(entry.isIntersecting),
			{ rootMargin: "0px 0px -80% 0px" }
		)
		const currentHero = heroRef.current
		if (currentHero) observer.observe(currentHero)
		return () => {
			if (currentHero) observer.unobserve(currentHero)
		}
	}, [])

	// Observe dark sections (black background) for header color change
	useEffect(() => {
		const darkSections = document.querySelectorAll('[data-dark-section]')
		const observer = new IntersectionObserver(
			(entries) => {
				const isInDarkSection = entries.some(entry => entry.isIntersecting)
				setIsDarkSection(isInDarkSection)
			},
			{ rootMargin: "0px 0px -50% 0px" }
		)
		
		darkSections.forEach(section => observer.observe(section))
		return () => darkSections.forEach(section => observer.unobserve(section))
	}, [])

	// Reveal animations for sections
	useEffect(() => {
		if (reduceMotion) return

		const sections = Array.from(document.querySelectorAll('[data-reveal-section]'))
		
		sections.forEach((section) => {
			const elements = section.querySelectorAll('[data-reveal]')
			elements.forEach((el, i) => {
				el.style.opacity = '0'
				el.style.transform = 'translateY(20px)'
				el.style.transition = `opacity 700ms ease, transform 700ms cubic-bezier(.22,.61,.36,1)`
				el.style.transitionDelay = `${i * 100}ms`
			})

			const io = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						elements.forEach(el => {
							el.style.opacity = '1'
							el.style.transform = 'none'
						})
						io.disconnect()
					}
				})
			}, { threshold: 0.2 })
			
			io.observe(section)
		})
	}, [reduceMotion])

	// Final CTA section
	const finalCtaRef = useRef(null)
	const [ctaGlow, setCtaGlow] = useState(1)
	const [headerIsUnstuck, setHeaderIsUnstuck] = useState(false)

	// Desktop: unstick header when final CTA is visible
	useEffect(() => {
		if (typeof window === 'undefined') return
		if (window.innerWidth < 1024) return
		const el = finalCtaRef.current
		if (!el) return
		const ctaTop = (() => {
			const rect = el.getBoundingClientRect()
			return rect.top + window.scrollY
		})()
		const onScroll = () => {
			const rect = el.getBoundingClientRect()
			const viewportH = window.innerHeight || 1
			const fullyVisible = rect.top >= 0 && rect.bottom <= viewportH
			if (fullyVisible) {
				setHeaderIsUnstuck(true)
			} else if (window.scrollY < ctaTop - 10) {
				setHeaderIsUnstuck(false)
			}
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => {
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
		}
	}, [])

	// Mobile CTA glow effect
	useEffect(() => {
		const section = finalCtaRef.current
		if (!section) return
		let raf = 0
		const onScroll = () => {
			if (raf) cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				if (window.innerWidth >= 1024) { setCtaGlow(1); return }
				const rect = section.getBoundingClientRect()
				const viewportH = window.innerHeight || 1
				const raw = 1 - Math.max(0, Math.min(1, rect.top / viewportH))
				const ease = raw < 0.5 ? (2 * raw * raw) : (1 - Math.pow(-2 * raw + 2, 2) / 2)
				setCtaGlow(0.10 + ease * 0.99)
			})
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => { 
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
			if (raf) cancelAnimationFrame(raf)
		}
	}, [])

	// Mobile sticky button
	const mobileStickyBtnRef = useRef(null)
	const mobileStickyWrapRef = useRef(null)

	useEffect(() => {
		const wrap = mobileStickyWrapRef.current
		const btn = mobileStickyBtnRef.current
		const cta = finalCtaRef.current
		if (!wrap || !btn || !cta) return

		wrap.style.willChange = 'transform'

		const BASE = 220
		const MAX = 440
		const GROW_ZONE = 1.0

		let ctaInView = false
		const io = new IntersectionObserver(
			([entry]) => { ctaInView = entry.isIntersecting },
			{ threshold: 0 }
		)
		io.observe(cta)

		let raf = 0
		const onScroll = () => {
			if (raf) cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				const viewportH = window.innerHeight || 1
				const rect = cta.getBoundingClientRect()

				const growStart = viewportH * GROW_ZONE
				const growProgress = Math.max(
					0,
					Math.min(1, (growStart - Math.max(0, rect.top)) / Math.max(1, growStart))
				)
				const targetWidth = Math.min(
					BASE + (MAX - BASE) * growProgress,
					Math.round(window.innerWidth * 0.96)
				)
				btn.style.width = `${targetWidth}px`

				if (ctaInView) {
					const overshoot = Math.max(0, viewportH - rect.bottom)
					wrap.style.transform = `translate3d(0, ${-overshoot}px, 0)`
					btn.style.opacity = '1'
					btn.style.pointerEvents = 'auto'
				} else {
					wrap.style.transform = 'translate3d(0, 0, 0)'
					if (rect.bottom <= 0) {
						btn.style.opacity = '0'
						btn.style.pointerEvents = 'none'
					} else {
						btn.style.opacity = '1'
						btn.style.pointerEvents = 'auto'
					}
				}
			})
		}

		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => {
			io.disconnect()
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
			if (raf) cancelAnimationFrame(raf)
		}
	}, [])

	return (
		<>
			{/* Top Bar */}
			<header className={`hidden sm:block ${headerIsUnstuck ? 'absolute' : 'fixed'} top-0 left-0 w-full z-50 py-4 md:py-6`}>
				<div className="w-full px-8 sm:px-12 lg:px-16">
					<div className="flex items-center justify-between">
						<Link 
							to="/"
							className={`text-xl sm:text-2xl md:text-3xl font-medium tracking-wide transition-all duration-300 hover:opacity-80 ${isHeroVisible || isDarkSection ? 'text-white' : 'text-black'}`} 
							style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
							aria-label="Go to Home"
						>
							Hornbill
						</Link>
						<div
							className={`${isHeroVisible || isDarkSection
								? 'bg-white/10 border border-white/25 backdrop-blur-md shadow-lg'
								: 'bg-white/85 border border-black/10 shadow-md'} rounded-full inline-flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5`}
							role="group"
							aria-label="Brand and booking"
						>
							<div className="hidden sm:flex items-center gap-2">
								<img src="/images/HORNBILL-LOGO.png" alt="Hornbill Logo" className="w-4 h-4 object-contain" />
								<span className={`${isHeroVisible || isDarkSection ? 'text-white/90' : 'text-black/80'} font-medium text-sm`} style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>Hornbill Smart Pod</span>
							</div>
							<span className={`${isHeroVisible || isDarkSection ? 'bg-white/20' : 'bg-black/10'} h-5 w-px mx-2 hidden sm:block`} aria-hidden="true" />
							<Link
								to="/book"
								className="hidden sm:inline-flex items-center justify-center rounded-full text-sm font-medium px-3.5 md:px-5 py-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 bg-white text-black hover:bg-white/90 focus-visible:ring-black/20 border border-black/10"
								style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
								aria-label="Book a demo"
							>
								Book a demo
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile sticky button */}
			<div
				ref={mobileStickyWrapRef}
				className="sm:hidden fixed inset-x-0 z-50 pointer-events-none"
				style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
			>
				<div className="flex justify-center">
					<Link
						to="/book"
						ref={mobileStickyBtnRef}
						className="pointer-events-auto bg-white text-black text-[14px] leading-none font-medium px-10 py-4 rounded-[6px] text-center shadow-md active:scale-95 transition-transform"
						style={{
							width: '240px',
							mixBlendMode: 'difference',
							WebkitMixBlendMode: 'difference',
							isolation: 'isolate',
							fontFamily: 'General Sans, Inter, system-ui, sans-serif'
						}}
					>
						Book a demo
					</Link>
				</div>
			</div>

			{/* Mobile top bar */}
			<div className="sm:hidden fixed top-0 inset-x-0 z-50" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 4px)' }}>
				<div className="px-4 py-3 flex items-center justify-between">
				<Link 
					to="/"
					className={`text-[1.4rem] font-medium hover:opacity-80 transition-all duration-300 ${isHeroVisible || isDarkSection ? 'text-white' : 'text-black'}`} 
					style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
					aria-label="Go to Home"
				>
					Hornbill
				</Link>
					<div className="w-7 h-7 flex items-center justify-center">
						<img src="/images/HORNBILL-LOGO.png" alt="Hornbill Logo" className="w-full h-full object-contain" />
					</div>
				</div>
				<div className={`h-px ${isHeroVisible || isDarkSection ? 'bg-white/15' : 'bg-black/15'}`} />
			</div>

			{/* Hero Section */}
			<section ref={heroRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #A1080E 0%, #E44008 41%, #000000 100%)' }}>
				{/* Texture overlay */}
				<div className="absolute inset-0 opacity-15">
					<img src="/images/Frame 2087325391.png" alt="Background texture" className="w-full h-full object-cover" />
				</div>
				
				{/* Hornbill bird image overlay */}
				<div className="absolute inset-0 opacity-10">
					<img src="/images/ChatGPT Image Oct 8, 2025, 08_44_32 AM.png" alt="Hornbill bird" className="w-full h-full object-cover object-center" />
				</div>

				{/* Content */}
				<div className="relative z-10 px-6 sm:px-10 lg:px-16 text-center max-w-5xl mx-auto">
					{/* Badge */}
					<div 
						className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
						style={{ 
							background: 'rgba(255, 255, 255, 0.08)',
							animation: reduceMotion ? 'none' : 'slideInFromBottom 0.8s ease-out both'
						}}
					>
						<div className="w-2 h-2 rounded-full bg-white/80" />
						<span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>About Hornbill</span>
					</div>

					<h1 
						className="text-white font-medium leading-[0.95] mb-6"
						style={{ 
							fontFamily: 'General Sans, Inter, system-ui, sans-serif',
							fontSize: 'clamp(44px, 7vw, 88px)',
							letterSpacing: '-0.03em',
							textShadow: '0 2px 20px rgba(0,0,0,0.3)',
							animation: reduceMotion ? 'none' : 'slideInFromBottom 1s ease-out 0.1s both'
						}}
					>
						Workspaces that<br/>adapt to you
					</h1>
					<p 
						className="text-white/85 max-w-3xl mx-auto leading-relaxed"
						style={{ 
							fontFamily: 'General Sans, Inter, system-ui, sans-serif',
							fontSize: 'clamp(17px, 1.4vw, 22px)',
							textShadow: '0 1px 10px rgba(0,0,0,0.2)',
							animation: reduceMotion ? 'none' : 'slideInFromBottom 1s ease-out 0.2s both'
						}}
					>
						For over two decades, we've been designing workplaces that evolve with how people work. Now, we're bringing that expertise into your space.
					</p>
				</div>

				{/* Modern scroll indicator - Desktop only */}
				<div 
					className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-3"
					style={{ 
						animation: reduceMotion ? 'none' : 'slideInFromBottom 1s ease-out 0.4s both'
					}}
				>
					<span 
						className="text-white/60 text-xs font-medium tracking-widest uppercase"
						style={{ 
							fontFamily: 'General Sans, Inter, system-ui, sans-serif',
							letterSpacing: '0.15em'
						}}
					>
						Scroll
					</span>
					<div className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center p-2 relative overflow-hidden">
						<div 
							className="w-1 h-2 bg-white/60 rounded-full"
							style={{ 
								animation: reduceMotion ? 'none' : 'scrollBounce 2s ease-in-out infinite',
								transformOrigin: 'center'
							}}
						/>
					</div>
				</div>
			</section>

			{/* Our Story Section */}
			<section className="relative w-full bg-white text-black py-20 sm:py-28 lg:py-36" data-reveal-section>
				<div className="px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
						<div className="lg:col-span-5">
							<div className="lg:sticky lg:top-24">
								<div className="inline-flex items-center gap-2 mb-4 group" data-reveal>
									<span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:bg-black/10 group-hover:scale-110">1</span>
									<span className="text-base text-black/60 transition-colors duration-300 group-hover:text-black/80">Our Foundation</span>
								</div>
								<h2 
									className="font-medium leading-tight transition-colors duration-300 hover:text-black/80"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(32px, 4vw, 48px)',
										letterSpacing: '-0.01em'
									}}
									data-reveal
								>
									Two decades of expertise
								</h2>
							</div>
						</div>
						<div className="lg:col-span-7">
							<div className="space-y-6">
								<p 
									className="text-black/70 leading-relaxed transition-colors duration-300 hover:text-black/85"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(16px, 1.2vw, 20px)'
									}}
									data-reveal
								>
									For over two decades, our parent company Innerspace has been designing and building diverse workplaces internationally—ranging from commercial offices and coworking hubs to thoughtfully designed residential work environments.
								</p>
								<p 
									className="text-black/70 leading-relaxed transition-colors duration-300 hover:text-black/85"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(16px, 1.2vw, 20px)'
									}}
									data-reveal
								>
									This deep experience has given us a front-row view of how the nature of work continues to evolve.
								</p>
							</div>
						</div>
					</div>
				</div>
				
				{/* Elegant divider */}
				<div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 mt-20 sm:mt-28">
					<div className="h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
				</div>
			</section>

			{/* The Spark Section */}
			<section className="relative w-full bg-[#F2F0EE] text-black py-20 sm:py-28 lg:py-36" data-reveal-section>
				{/* Subtle top glow */}
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
				
				<div className="px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
						<div className="lg:col-span-5">
							<div className="lg:sticky lg:top-24">
								<div className="inline-flex items-center gap-2 mb-4 group" data-reveal>
									<span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:bg-black/10 group-hover:scale-110">2</span>
									<span className="text-base text-black/60 transition-colors duration-300 group-hover:text-black/80">Our Inspiration</span>
								</div>
								<h2 
									className="font-medium leading-tight transition-colors duration-300 hover:text-black/80"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(32px, 4vw, 48px)',
										letterSpacing: '-0.01em'
									}}
									data-reveal
								>
									The Spark Behind Hornbill
								</h2>
							</div>
						</div>
						<div className="lg:col-span-7">
							<div className="space-y-6">
								<p 
									className="text-black/70 leading-relaxed transition-colors duration-300 hover:text-black/85"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(16px, 1.2vw, 20px)'
									}}
									data-reveal
								>
									When the world shifted dramatically toward hybrid and work-from-home models after COVID-19, we saw a new challenge emerge: professionals needed compact, private, elegant, and flexible workspaces that could seamlessly blend into both home and office settings.
								</p>
								<p 
									className="text-black/70 leading-relaxed transition-colors duration-300 hover:text-black/85"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(16px, 1.2vw, 20px)'
									}}
									data-reveal
								>
									To address this, we embarked on extensive research and collaborated with leading Italian designers to create the Hornbill Smart Workpod—a beautifully engineered pod that combines ergonomic design, smart features, and timeless aesthetics.
								</p>
								<p 
									className="text-black/70 leading-relaxed transition-colors duration-300 hover:text-black/85"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(16px, 1.2vw, 20px)'
									}}
									data-reveal
								>
									Whether set up in a villa office, an apartment, or within an office floor plan, Hornbill is built to elevate productivity while preserving comfort and privacy.
								</p>
							</div>
						</div>
					</div>
				</div>
				
				{/* Elegant divider */}
				<div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 mt-20 sm:mt-28">
					<div className="h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
				</div>
			</section>

			{/* Why Hornbill Section */}
			<section className="relative w-full bg-black text-white py-20 sm:py-28 lg:py-36" data-reveal-section data-dark-section>
				{/* Subtle top glow */}
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				
				<div className="absolute inset-0 opacity-20">
					<img src="/images/Background texture.png" alt="Background texture" className="w-full h-full object-cover" />
				</div>
				
				<div className="relative px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
					<div className="text-center mb-16 sm:mb-20 lg:mb-24">
						<div className="inline-flex items-center gap-2 mb-4 group" data-reveal>
							<span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:bg-white/15 group-hover:scale-110">3</span>
							<span className="text-base text-white/60 transition-colors duration-300 group-hover:text-white/80">Our Name</span>
						</div>
						<h2 
							className="font-medium leading-tight mb-6 transition-colors duration-300 hover:text-white/90"
							style={{ 
								fontFamily: 'General Sans, Inter, system-ui, sans-serif',
								fontSize: 'clamp(32px, 4vw, 48px)',
								letterSpacing: '-0.01em'
							}}
							data-reveal
						>
							Why the Name "Hornbill"?
						</h2>
						<p 
							className="text-white/70 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 hover:text-white/85"
							style={{ 
								fontFamily: 'General Sans, Inter, system-ui, sans-serif',
								fontSize: 'clamp(16px, 1.2vw, 20px)'
							}}
							data-reveal
						>
							The Hornbill is one of nature's most extraordinary birds, instantly recognizable for its striking beak and casque. Across cultures, it is celebrated as a symbol of resilience, protection, and harmony with the environment.
						</p>
					</div>

					{/* Three Values - Enhanced */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
						{/* Loyalty */}
						<div className="group" data-reveal>
							<div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 h-full transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-[#FFA01B]/10 hover:-translate-y-1">
								{/* Gradient glow on hover */}
								<div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at top, rgba(255,160,27,0.1), transparent 70%)' }} />
								
								<div className="relative">
									<div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-white/15 group-hover:scale-110">
										<svg className="w-6 h-6 text-[#FFA01B] transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
										</svg>
									</div>
									<h3 
										className="font-medium mb-4 transition-colors duration-300 group-hover:text-white"
										style={{ 
											fontFamily: 'General Sans, Inter, system-ui, sans-serif',
											fontSize: 'clamp(24px, 2vw, 28px)'
										}}
									>
										Loyalty
									</h3>
									<p 
										className="text-white/70 leading-relaxed transition-colors duration-300 group-hover:text-white/85"
										style={{ 
											fontFamily: 'General Sans, Inter, system-ui, sans-serif',
											fontSize: 'clamp(15px, 1vw, 17px)'
										}}
									>
										Hornbills are known for forming lifelong pair bonds, with the male faithfully supporting and feeding his partner while she nests. Inspired by this devotion, we take a long-term approach in every client relationship, building trust and reliability that lasts.
									</p>
								</div>
							</div>
						</div>

						{/* Beauty */}
						<div className="group" data-reveal>
							<div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 h-full transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-[#FFA01B]/10 hover:-translate-y-1">
								{/* Gradient glow on hover */}
								<div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at top, rgba(255,160,27,0.1), transparent 70%)' }} />
								
								<div className="relative">
									<div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-white/15 group-hover:scale-110">
										<svg className="w-6 h-6 text-[#FFA01B] transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
									</div>
									<h3 
										className="font-medium mb-4 transition-colors duration-300 group-hover:text-white"
										style={{ 
											fontFamily: 'General Sans, Inter, system-ui, sans-serif',
											fontSize: 'clamp(24px, 2vw, 28px)'
										}}
									>
										Beauty
									</h3>
									<p 
										className="text-white/70 leading-relaxed transition-colors duration-300 group-hover:text-white/85"
										style={{ 
											fontFamily: 'General Sans, Inter, system-ui, sans-serif',
											fontSize: 'clamp(15px, 1vw, 17px)'
										}}
									>
										With their vibrant plumage and distinctive casque, hornbills stand out as some of the most aesthetically striking birds in the world. In the same way, we are committed to designing workpods that are not only highly functional but also elegant, ergonomic, and a joy to experience.
									</p>
								</div>
							</div>
						</div>

						{/* Caring */}
						<div className="group" data-reveal>
							<div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 h-full transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-[#FFA01B]/10 hover:-translate-y-1">
								{/* Gradient glow on hover */}
								<div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at top, rgba(255,160,27,0.1), transparent 70%)' }} />
								
								<div className="relative">
									<div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-white/15 group-hover:scale-110">
										<svg className="w-6 h-6 text-[#FFA01B] transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
									</div>
									<h3 
										className="font-medium mb-4 transition-colors duration-300 group-hover:text-white"
										style={{ 
											fontFamily: 'General Sans, Inter, system-ui, sans-serif',
											fontSize: 'clamp(24px, 2vw, 28px)'
										}}
									>
										Caring
									</h3>
									<p 
										className="text-white/70 leading-relaxed transition-colors duration-300 group-hover:text-white/85"
										style={{ 
											fontFamily: 'General Sans, Inter, system-ui, sans-serif',
											fontSize: 'clamp(15px, 1vw, 17px)'
										}}
									>
										The hornbill's nurturing instinct is legendary: the male tirelessly cares for his mate and chicks, ensuring their survival. This reflects our own ethos of unwavering support for our users, ensuring each workspace meets both personal comfort and professional needs.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/* Elegant divider */}
				<div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 mt-20 sm:mt-28">
					<div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				</div>
			</section>

			{/* Vision Section */}
			<section className="relative w-full bg-white text-black py-20 sm:py-28 lg:py-36" data-reveal-section>
				{/* Subtle top glow */}
				<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
				
				<div className="px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
						{/* Text content */}
						<div className="lg:col-span-7 text-center lg:text-left">
							<div className="inline-flex items-center gap-2 mb-6 group" data-reveal>
								<span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:bg-black/10 group-hover:scale-110">4</span>
								<span className="text-base text-black/60 transition-colors duration-300 group-hover:text-black/80">Our Vision</span>
							</div>
							<h2 
								className="font-medium leading-tight mb-8 transition-colors duration-300 hover:text-black/80"
								style={{ 
									fontFamily: 'General Sans, Inter, system-ui, sans-serif',
									fontSize: 'clamp(32px, 4vw, 48px)',
									letterSpacing: '-0.01em'
								}}
								data-reveal
							>
								More than just a workspace
							</h2>
							<p 
								className="text-black/70 leading-relaxed transition-colors duration-300 hover:text-black/85"
								style={{ 
									fontFamily: 'General Sans, Inter, system-ui, sans-serif',
									fontSize: 'clamp(16px, 1.2vw, 20px)'
								}}
								data-reveal
							>
								Hornbill Smart Workpod is more than just a workspace—it's a step toward redefining how people live, work, and balance their worlds. We envision a future where anyone, anywhere, can enjoy a dedicated, smart, and inspiring environment that makes work effortless and fulfilling.
							</p>
						</div>
						{/* Image - maintains 9:16 aspect ratio */}
						<div className="lg:col-span-5 flex justify-center lg:justify-end" data-reveal>
							<div className="w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[200px] xl:max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
								<img 
									src="/images/Horn_Bill_LastFrame.png" 
									alt="Hornbill Vision" 
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section ref={finalCtaRef} className="relative isolate z-10 w-full min-h-screen bg-black text-white overflow-hidden">
				<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
					<div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#DD2C00] via-[#F26722] to-[#D81A00]" />
				</div>
				
				{/* Mobile Layout */}
				<div className="lg:hidden min-h-screen relative">
					<div className="absolute top-0 left-0 right-0 z-10 px-6 pt-32 sm:pt-40 md:pt-48">
						<div className="max-w-md mx-auto text-center" style={{ filter: `brightness(${Math.min(1.0, 0.3 + ctaGlow)})` }}>
							<h2
								className="text-white font-medium leading-[1.05] mb-4 sm:mb-5 md:mb-6"
								style={{
									fontFamily: 'General Sans, Inter, system-ui, sans-serif',
									fontSize: 'clamp(32px,4.8vw,56px)',
									letterSpacing: '-0.01em',
									whiteSpace: 'nowrap'
								}}
							>
								Experience Hornbill today.
							</h2>
							<p
								className="text-white/70 text-sm sm:text-base max-w-md mx-auto mt-1 sm:mt-2"
								style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
							>
								Your all-in-one smart workspace.
							</p>
						</div>
					</div>
					
					<div className="absolute inset-0 w-full h-full">
						<img src="/images/ChatGPT Image Sep 12, 2025, 06_09_37 PM.png" alt="Hornbill SmartPod hands on screen" className="w-full h-full object-cover object-center" style={{ filter: `brightness(${ctaGlow})` }} />
						<div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,${Math.max(0.2, 0.55/ctaGlow)}), transparent 55%)` }} />
					</div>
				</div>

				{/* Desktop Layout */}
				<div className="hidden lg:grid lg:grid-cols-12 lg:items-center min-h-screen">
					<div className="lg:col-span-4 px-16 py-0">
						<div className="max-w-lg text-left">
							<h2 className="text-white font-medium leading-[1.05] mb-4" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(28px,3.2vw,42px)', letterSpacing: '-0.01em', filter: `brightness(${Math.min(1.0, 0.3 + ctaGlow)})` }}>
								Bring one
								<br/>home today.
							</h2>
							<p className="text-white/70 text-sm sm:text-base mb-6 max-w-md" style={{ filter: `brightness(${Math.min(1.0, 0.3 + ctaGlow)})` }}>
								Your all-in-one smart workspace.
							</p>
							<Link to="/book" className="btn-square-white inline-flex">
								Book a demo
							</Link>
						</div>
					</div>
					
					<div className="lg:col-span-8 relative h-screen">
						<img src="/images/vtapicture.png" alt="Hornbill SmartPod hands on screen" className="absolute inset-0 w-full h-full object-cover object-left"/>
						<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
					</div>
				</div>
			</section>

			<Footer />
		</>
	)
}

export default AboutPage

