import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Home as HomeIcon, Move, VolumeX, Radio, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react'

const HomePage = () => {
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

	// Hero video
  const videoRef = useRef(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
	const heroRef = useRef(null)
	const [heroParallax, setHeroParallax] = useState(0)

	// Choose mobile-specific hero video on small screens
	const [isMobileViewport, setIsMobileViewport] = useState(() => {
		try {
			return window.matchMedia('(max-width: 639px)').matches
		} catch {
			return false
		}
	})
	const heroVideoSrc = isMobileViewport
		? '/images/HornBill_Shot_01_Mobile_V03.mp4'
		: '/images/WhatsApp Video 2025-09-08 at 6.21.18 AM.mp4'

	useEffect(() => {
		try {
			const mq = window.matchMedia('(max-width: 639px)')
			const handler = (e) => setIsMobileViewport(e.matches)
			mq.addEventListener?.('change', handler)
			return () => mq.removeEventListener?.('change', handler)
		} catch {}
	}, [])

	// When the source changes, reset fade-in and reload the video
	useEffect(() => {
		setIsVideoLoaded(false)
		const v = videoRef.current
		try { v?.load?.() } catch {}
	}, [heroVideoSrc])

	// Pause/resume hero video when off-screen
	useEffect(() => {
		const v = videoRef.current
		if (!v) return
		const io = new IntersectionObserver(([entry]) => {
			if (!v) return
			if (entry.isIntersecting) {
				v.play?.()
			} else {
				v.pause?.()
			}
		}, { threshold: 0.15 })
		io.observe(v)
		return () => io.disconnect()
	}, [])

	// Subtle parallax on hero (disabled if reduced motion)
	useEffect(() => {
		if (reduceMotion) return
		const handleScroll = () => {
			const hero = heroRef.current
			if (!hero) return
			const rect = hero.getBoundingClientRect()
			const viewportH = window.innerHeight || 1
			// amount -1..1 as section scrolls
			const progress = Math.max(-1, Math.min(1, (viewportH - rect.top) / (rect.height + viewportH)))
			setHeroParallax(progress)
		}
		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [reduceMotion])


	// Page 2: gradient text highlight
	const secondPageWrapperRef = useRef(null)
	const [highlightProgress, setHighlightProgress] = useState(0)
	const scrollingTextWords = useMemo(
		() => {
			const firstPart = 'The Hornbill SmartPod is a complete workspace designed for modern professionals. It transforms any space into a productive hub in seconds with sit-stand flexibility, multi-device connectivity and a clutter-free setup where Italian design meets smart functionality.'.split(' ')
			const secondPart = 'This is the future of work, distilled into one smart pod.'.split(' ')
			return [...firstPart, '\n', ...secondPart]
		},
		[]
	)
	const getWordOpacity = (index) => {
		const perWord = 1 / scrollingTextWords.length
    const threshold = perWord * (index + 1)
		return highlightProgress >= threshold ? 1 : 0.3
	}

	// Final line emphasis helpers
	const finalLineStartIndex = useMemo(() => {
		const idx = scrollingTextWords.findIndex(w => w === '\n')
		return idx >= 0 ? idx + 1 : scrollingTextWords.length
	}, [scrollingTextWords])
	const totalWords = scrollingTextWords.length
	const finalLineStartRatio = finalLineStartIndex / Math.max(1, totalWords)
	const isFinalLineActive = highlightProgress >= finalLineStartRatio
	const finalLineProgress = Math.max(0, Math.min(1, (highlightProgress - finalLineStartRatio) / Math.max(0.0001, 1 - finalLineStartRatio)))

	useEffect(() => {
		const wrapper = secondPageWrapperRef.current
		if (!wrapper) return
		const handleScroll = () => {
			const rect = wrapper.getBoundingClientRect()
			const scrollDistance = wrapper.scrollHeight - window.innerHeight
			if (scrollDistance <= 0) return
			const currentScroll = -rect.top
			const progress = Math.max(0, Math.min(1, currentScroll / scrollDistance))
			setHighlightProgress(progress)
		}
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Page 3: sticky chapters (Focus, Wellness, Elegance)
	const chapters = [
		{
			badge: '1',
			title: 'Focus',
			description: 'Everything you need for peak productivity, ready in seconds. The Hornbill SmartPod keeps your essentials within reach — wireless charging, storage, monitor, keyboard, mouse, and Wi-Fi dongle — so you can get to work instantly, free from clutter, cables, or wasted time.',
			image: '/images/focus.jpg',
			alt: 'Top-down desk with coffee, keyboard and mouse'
		},
		{
			badge: '2',
			title: 'Wellness',
			description: 'Work shouldn\'t wear you down. With seamless sit-stand adjustment, fully controllable lighting, and an adjustable swivel monitor arm, the Hornbill SmartPod supports movement, eases strain, and keeps you energized. Comfort and ergonomics are built directly into your day—so you can work healthier, longer.',
			image: '/images/elegance.png',
			alt: 'Sit-stand desk with monitor and ergonomic setup'
		},
		{
			badge: '3',
			title: 'Elegance',
			description: 'Minimal, clutter-free, and wireless. The Hornbill SmartPod fits naturally into any space—home, office, or even a coffee shop. Italian design, sound-absorbing acoustic fabric, and thoughtful details make it as beautiful as it is functional.',
			image: '/images/elegance.jpg',
			alt: 'Minimal workspace with acoustic panels and elegant design'
		}
	]

	// Preload chapter images
	useEffect(() => {
		chapters.forEach(chapter => {
			const img = new Image();
			img.src = chapter.image;
		});
	}, [])

	const stickySectionRef = useRef(null)
	const [isChaptersVisible, setIsChaptersVisible] = useState(false);
	const [isARVisible, setIsARVisible] = useState(false);
	
	// Observe when the chapters section is in view to change header text color
  useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => setIsChaptersVisible(entry.isIntersecting),
			{ rootMargin: "0px 0px -50% 0px" }
		);
		const currentSection = stickySectionRef.current;
		if (currentSection) observer.observe(currentSection);
		return () => {
			if (currentSection) observer.unobserve(currentSection);
		};
	}, [])

	// Observe when the AR section is in view to change header text color
	const arSectionRef = useRef(null);
	const finalCtaRef = useRef(null);
	const mobileStickyBtnRef = useRef(null);
	const mobileStickyWrapRef = useRef(null);
	const [ctaGlow, setCtaGlow] = useState(1);
	// Desktop: once final CTA is fully visible, unstick header (switch from fixed to absolute)
	const [headerIsUnstuck, setHeaderIsUnstuck] = useState(false)
	useEffect(() => {
		if (typeof window === 'undefined') return
		if (window.innerWidth < 1024) return // desktop only
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
				// If user scrolls back above the start of CTA, re-enable sticking
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
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => setIsARVisible(entry.isIntersecting),
			{ rootMargin: "0px 0px -100% 0px" }
		);
		const currentSection = arSectionRef.current;
		if (currentSection) observer.observe(currentSection);
		return () => {
			if (currentSection) observer.unobserve(currentSection);
		};
	}, [])

	// Remove sticky progress-driven chapter switching; page 3 scrolls normally now

	// Page 4 (Spotlight film) helpers
	const spotlightVideoId = 'cBpGq-vDr2Y'
	const [isVideoIframeLoaded, setIsVideoIframeLoaded] = useState(false)
	const [hasUserInitiatedVideo, setHasUserInitiatedVideo] = useState(false)
	const spotlightRef = useRef(null)
	const [spotlightParallax, setSpotlightParallax] = useState(0)
	const [spotlightProgress, setSpotlightProgress] = useState(0)

	useEffect(() => {
		const section = spotlightRef.current
		if (!section) return

		const onScroll = () => {
			const rect = section.getBoundingClientRect()
			const viewportH = window.innerHeight || 1
			// Parallax amount
			const progress = Math.max(0, Math.min(1, 1 - rect.top / viewportH))
			setSpotlightParallax(reduceMotion ? 0 : (progress * 12))
			// Progress rail across visible portion of page 4
			const total = rect.height + viewportH
			const current = Math.min(total, Math.max(0, viewportH - rect.top))
			setSpotlightProgress(Math.max(0, Math.min(1, current / total)))
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [reduceMotion])

	// Lazy load iframe when in view or user clicks
	const litePlayerRef = useRef(null)
	useEffect(() => {
		// Remove intersection auto-load; iframe will load only on explicit click
	}, [])

	const buildYouTubeSrc = (id) => `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;

	// Page 5: highlights carousel
	const highlightSlides = [
		{ src: '/images/Generated Image September 11, 2025 - 5_54PM.png', alt: 'Clean, minimalist design—arrives ready to work with zero setup.', title: 'Clean, minimalist design—arrives ready to work with zero setup.' },
		{ src: '/images/ChatGPT Image Aug 15, 2025, 02_03_12 PM.png', alt: 'One-touch panel adjusts height, lighting, and power instantly and safely.', title: 'One-touch panel adjusts height, lighting, and power instantly and safely.' },
		{ src: '/images/Generated Image September 11, 2025 - 6_47PM 1.jpg', alt: 'Swivel monitor arm positions screens for perfect viewing and posture.', title: 'Swivel monitor arm positions screens for perfect viewing and posture.' },
		{ src: '/images/ChatGPT Image Aug 15, 2025, 02_03_15 PM.png', alt: 'Built-in wireless charging and seamless device integration keep you productive.', title: 'Built-in wireless charging and seamless device integration keep you productive.' },
		{ src: '/images/Generated Image September 11, 2025 - 6_56PM.png', alt: 'Acoustic panels and dimmable LEDs create a calm, focused environment.', title: 'Acoustic panels and dimmable LEDs create a calm, focused environment.' }
	]
	const highlightsContainerRef = useRef(null)
	const [activeHighlightIndex, setActiveHighlightIndex] = useState(0)
	const isHighlightAnimating = useRef(false)
	const highlightsHeaderRef = useRef(null)
	const highlightsParagraphRef = useRef(null)
	const [controlsTop, setControlsTop] = useState(0)

	// Page 8: vertical portrait carousel (like page 5, portrait images)
	const verticalSlides = [
		{ src: '/images/clean no cables.jpg', alt: 'Clean Workspace', label: 'Clean Workspace', title: 'One button powers a clean, cable-less minimal workspace.' },
		{ src: '/images/multi device conttectivity.png', alt: 'Multi-Device Connectivity', label: 'Multi-Device', title: 'Seamlessly link phones, tablets, and laptops in one workspace.' },
		{ src: '/images/storage units .png', alt: 'Integrated Storage', label: 'Integrated Storage', title: 'Seamlessly built-in drawers keep essentials hidden.' },
		{ src: '/images/app controlled.png', alt: 'App Controlled', label: 'App Controlled', title: 'Adjust height, lighting, and power from the Hornbill app.' },
		{ src: '/images/ChatGPT Image Aug 15, 2025, 01_55_50 PM.png', alt: 'Recessed Cup Holder', label: 'Recessed Cup Holder', title: 'Recessed holder keeps drinks steady and surfaces safe.' },
		{ src: '/images/wireless phone charger.png', alt: 'Wireless Charging', label: 'Wireless Charging', title: 'Integrated Qi pad powers your phone wirelessly' },
		{ src: '/images/laptop holder .png', alt: 'Vertical Laptop Stand', label: 'Vertical Laptop Stand', title: 'Dedicated storage space for your laptop' }
	]
	const verticalContainerRef = useRef(null)
	const [activeVerticalIndex, setActiveVerticalIndex] = useState(0)
	const isVerticalAnimating = useRef(false)
	const verticalHeaderRef = useRef(null)
	const verticalParagraphRef = useRef(null)
	const [controlsTop8, setControlsTop8] = useState(0)

	// Page 11: FAQ content
	const faqs = [
		{
			title: 'What is the Hornbill Smart Work Pod?',
			answer: (
				<p>The Hornbill Smart Work Pod is a fully equipped, ergonomic, and stylish workspace solution designed for both home and office environments. It provides a distraction-free zone that enhances productivity, wellness, and style.</p>
			)
		},
		{
			title: 'Who is the Smart Work Pod designed for?',
			answer: (
				<ul className="list-disc ml-5 space-y-1">
					<li>Remote-working professionals</li>
					<li>Corporate employees</li>
					<li>Entrepreneurs and consultants</li>
					<li>Freelancers and creatives</li>
					<li>Students</li>
					<li>Anyone seeking a dedicated, professional workspace at home</li>
				</ul>
			)
		},
		{
			title: 'How much space does the pod require?',
			answer: (
				<p>The pod has a compact footprint of 0.7 m² and fits seamlessly into any room. Equipped with caster wheels, it can be moved easily and securely positioned wherever needed.</p>
			)
		},
		{
			title: 'What features does the Hornbill Pod include?',
			answer: (
				<div className="space-y-3">
					<div>
						<div className="font-medium mb-1">Core Features</div>
						<ul className="list-disc ml-5 space-y-1">
							<li>Ergonomic Sit-Stand Workstation – promotes healthy posture and flexibility</li>
							<li>Adjustable Lighting – optimized for eye comfort and reduced fatigue</li>
							<li>Ample Storage Solutions – keeps your workspace organized and clutter-free</li>
							<li>Device Connectivity – seamless integration via USB‑C</li>
							<li>Integrated Power & Wireless Charging</li>
							<li>Noise-Reduction & Privacy – distraction-free environment</li>
							<li>Premium Finishes – modern, stylish materials</li>
							<li>Easy-Move Caster Wheels with Lock</li>
							<li>Smart Environment Control – manage lighting, ventilation, comfort via mobile app</li>
							<li>Easy-Access Cup Holder</li>
						</ul>
					</div>
					<div>
						<div className="font-medium mb-1">Optional add-ons</div>
						<ul className="list-disc ml-5 space-y-1">
							<li>Dedicated Internet Communicator – seamless, independent connectivity</li>
							<li>Wireless Keyboard & Mouse</li>
							<li>Swivel Monitor Arm</li>
						</ul>
					</div>
				</div>
			)
		},
		{
			title: 'Can the pod be customized?',
			answer: (
				<p>Yes. Customization is available for bulk or large orders. Please contact the Hornbill team to discuss options.</p>
			)
		},
		{
			title: 'How does the pod improve productivity and wellness?',
			answer: (
				<ul className="list-disc ml-5 space-y-1">
					<li>Ergonomic design (motorized sit‑stand feature) reduces back and wrist strain</li>
					<li>Adjustable lighting minimizes eye fatigue</li>
					<li>Phone charging and power points within arm's reach</li>
					<li>Dedicated work environment promotes focus and reduces distractions</li>
					<li>Clear work‑life separation supports better mental wellness</li>
				</ul>
			)
		},
		{
			title: 'What about internet and connectivity?',
			answer: (
				<p>Each pod can be equipped with an optional dedicated internet dongle, along with multiple power outlets, USB ports, and wireless charging. This ensures your work internet remains separate from your home network. The dongle is portable, allowing you to continue working securely from other locations such as coffee shops.</p>
			)
		},
		{
			title: 'What is the cost of a Hornbill Smart Work Pod?',
			answer: (
				<p>Pricing depends on the size, features, and customization required. Contact us for a free consultation, product experience, and a tailored quotation.</p>
			)
		},
		{
			title: 'Do you offer a warranty?',
			answer: (
				<p>Yes. All Hornbill pods come with a 1‑year warranty covering structure, electricals, and installations.</p>
			)
		},
		{
			title: 'How do I get started?',
			answer: (
				<ol className="list-decimal ml-5 space-y-1">
					<li>Book a free product experience</li>
					<li>Select your preferred features</li>
					<li>Receive delivery and installation of your Hornbill pod</li>
				</ol>
			)
		},
		{
			title: "Why the name 'Hornbill'?",
			answer: (
				<div className="space-y-3">
					<ul className="list-disc ml-5 space-y-1">
						<li>Loyalty – Hornbills mate for life, symbolizing long‑term partnerships with our clients</li>
						<li>Caring – Both parents care for their chicks, reflecting our commitment to user needs</li>
						<li>Beauty – The Hornbill's striking appearance mirrors our focus on aesthetic and ergonomic design</li>
					</ul>
					<p>At Hornbill Inc., our core values are: Loyalty, Caring and Beauty.</p>
				</div>
			)
		}
	]

	// FAQ: show only first five by default, allow expanding
	const [showAllFaqs, setShowAllFaqs] = useState(false)

	const [openFaqIndex, setOpenFaqIndex] = useState(4)
	const toggleFaq = useCallback((index) => {
		setOpenFaqIndex(prev => (prev === index ? -1 : index))
		// Ensure the opened item is visible on small screens
		if (typeof window !== 'undefined' && window.innerWidth < 1024) {
			setTimeout(() => {
				const region = document.getElementById(`faq-panel-${index}`)
				if (region) {
					region.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
				}
			}, 60)
		}
	}, [])

	// If user collapses the list, close any open item beyond the first five
	useEffect(() => {
		if (!showAllFaqs && openFaqIndex > 4) {
			setOpenFaqIndex(-1)
		}
	}, [showAllFaqs, openFaqIndex])

	// Page 9: specification list and equal-height layout
	const specificationItems = [
		{
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			),
			title: 'Dimensions',
			value: 'L1000 x W850 x H1140 mm'
		},
		{
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
				</svg>
			),
			title: 'Weight',
			value: '80 Kg'
		},
		{
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
				</svg>
			),
			title: 'Table top height adjustment',
			value: '720-1060 mm'
		},
		{
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
			),
			title: 'Materials',
			value: 'High-grade acoustic fabric, durable wood in veneer, laminate and polyurethane finishes. Rigid metal support framework. Heavy duty castor wheels with breaks.'
		}
	]
	const specRightRef = useRef(null)
	const [specEqualHeight, setSpecEqualHeight] = useState(0)
	useEffect(() => {
		const handleResize = () => {
			const rightEl = specRightRef.current
			if (!rightEl) return
			const rightHeight = rightEl.offsetHeight
			const maxDesktopHeight = Math.round(window.innerHeight * 0.86)
			setSpecEqualHeight(Math.min(rightHeight, maxDesktopHeight))
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

  useEffect(() => {
		highlightSlides.forEach(s => { const img = new Image(); img.src = s.src })
	}, [])

	useEffect(() => {
		verticalSlides.forEach(s => { const img = new Image(); img.src = encodeURI(s.src) })
	}, [])

	// Preload final CTA images
	useEffect(() => {
		const img1 = new Image()
		img1.src = '/images/vtapicture.png'
		const img2 = new Image()
		img2.src = '/images/Frame 2087325386.png'
	}, [])

	useEffect(() => {
		const computeControlsTop = () => {
			const headerEl = highlightsHeaderRef.current
			const pEl = highlightsParagraphRef.current
			if (!headerEl || !pEl) return
			const headerRect = headerEl.getBoundingClientRect()
			const pRect = pEl.getBoundingClientRect()
			setControlsTop(pRect.top - headerRect.top)
		}
		computeControlsTop()
		window.addEventListener('resize', computeControlsTop)
		return () => window.removeEventListener('resize', computeControlsTop)
	}, [])

	useEffect(() => {
		const computeControlsTop = () => {
			const headerEl = verticalHeaderRef.current
			const pEl = verticalParagraphRef.current
			if (!headerEl || !pEl) return
			const headerRect = headerEl.getBoundingClientRect()
			const pRect = pEl.getBoundingClientRect()
			setControlsTop8(pRect.top - headerRect.top)
		}
		computeControlsTop()
		window.addEventListener('resize', computeControlsTop)
		return () => window.removeEventListener('resize', computeControlsTop)
	}, [])

	const scrollToHighlight = useCallback((index) => {
		const container = highlightsContainerRef.current
		if (!container) return
		const clamped = Math.max(0, Math.min(index, highlightSlides.length - 1))
		const child = container.children[clamped]
		if (!child) return
		const left = child.offsetLeft - parseInt(getComputedStyle(container).paddingLeft || '0', 10)
		container.scrollTo({ left, behavior: 'smooth' })
		setActiveHighlightIndex(clamped)
	}, [highlightSlides.length])

	const nextHighlight = useCallback(() => {
		if (isHighlightAnimating.current) return
		isHighlightAnimating.current = true
		scrollToHighlight((activeHighlightIndex + 1) % highlightSlides.length)
		setTimeout(() => { isHighlightAnimating.current = false }, 450)
	}, [activeHighlightIndex, highlightSlides.length, scrollToHighlight])

	const prevHighlight = useCallback(() => {
		if (isHighlightAnimating.current) return
		isHighlightAnimating.current = true
		scrollToHighlight((activeHighlightIndex - 1 + highlightSlides.length) % highlightSlides.length)
		setTimeout(() => { isHighlightAnimating.current = false }, 450)
	}, [activeHighlightIndex, highlightSlides.length, scrollToHighlight])

	const scrollToVertical = useCallback((index) => {
		const container = verticalContainerRef.current
		if (!container) return
		const clamped = Math.max(0, Math.min(index, verticalSlides.length - 1))
		const child = container.children[clamped]
		if (!child) return
		const left = child.offsetLeft - parseInt(getComputedStyle(container).paddingLeft || '0', 10)
		container.scrollTo({ left, behavior: 'smooth' })
		setActiveVerticalIndex(clamped)
	}, [verticalSlides.length])

	const nextVertical = useCallback(() => {
		if (isVerticalAnimating.current) return
		isVerticalAnimating.current = true
		scrollToVertical((activeVerticalIndex + 1) % verticalSlides.length)
		setTimeout(() => { isVerticalAnimating.current = false }, 450)
	}, [activeVerticalIndex, verticalSlides.length, scrollToVertical])

	const prevVertical = useCallback(() => {
		if (isVerticalAnimating.current) return
		isVerticalAnimating.current = true
		scrollToVertical((activeVerticalIndex - 1 + verticalSlides.length) % verticalSlides.length)
		setTimeout(() => { isVerticalAnimating.current = false }, 450)
	}, [activeVerticalIndex, verticalSlides.length, scrollToVertical])

	// Premium FAANG-level smooth scroll to top
	const scrollToTop = () => {
		const startTime = performance.now()
		const startScroll = window.pageYOffset
		const duration = 1200 // 1.2 seconds for premium feel
		
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

	// Highlights: inner-pan parallax and directional caption animation (refined, subtle)
	useEffect(() => {
		const container = highlightsContainerRef.current
		if (!container) return
		const slides = Array.from(container.querySelectorAll('[data-hl-item]'))
		const images = Array.from(container.querySelectorAll('[data-hl-image]'))
		const captions = Array.from(container.querySelectorAll('[data-hl-caption]'))
		if (reduceMotion) {
			images.forEach(img => { img.style.transform = 'none' })
			captions.forEach(cap => { cap.style.transform = 'none'; cap.style.opacity = '1' })
			return
		}
		// Smooth transitions for elegant trailing
		images.forEach(img => { img.style.transition = 'transform 500ms cubic-bezier(.22,.61,.36,1)'; })
		captions.forEach(cap => { cap.style.transition = 'transform 400ms cubic-bezier(.22,.61,.36,1), opacity 400ms ease-out'; })
		let rafId = 0
		const update = () => {
			const containerRect = container.getBoundingClientRect()
			const containerCenter = containerRect.left + containerRect.width / 2
			slides.forEach((slide, idx) => {
				const rect = slide.getBoundingClientRect()
				const slideCenter = rect.left + rect.width / 2
				// progress around center in range roughly -1..1
				let progress = (slideCenter - containerCenter) / rect.width
				// clamp
				progress = Math.max(-1, Math.min(1, progress))
				// ease for elegance (easeOutQuad on magnitude)
				const abs = Math.abs(progress)
				const easedAbs = 1 - Math.pow(1 - abs, 2)
				const easedProgress = Math.sign(progress) * easedAbs * 0.45 // reduced amplitude
				// proximity to center for opacity
				const proximity = 1 - abs
				const img = images[idx]
				const cap = captions[idx]
				if (img) {
					// Subtle inner pan with light zoom
					const panMax = Math.max(10, Math.min(26, rect.width * 0.02))
					const panPx = -easedProgress * panMax
					const scale = 1.015
					img.style.transform = `translateX(${panPx}px) scale(${scale}) translateZ(0)`
				}
				if (cap) {
					const capTranslateX = easedProgress * 10
					const capOpacity = 0.72 + Math.max(0, proximity) * 0.28 // 0.72 → 1
					cap.style.transform = `translateX(${capTranslateX}px)`
					cap.style.opacity = String(Math.max(0.72, Math.min(1, capOpacity)))
				}
			})
		}
		const onScroll = () => {
			if (rafId) cancelAnimationFrame(rafId)
			rafId = requestAnimationFrame(update)
		}
		update()
		container.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => {
			container.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
			if (rafId) cancelAnimationFrame(rafId)
		}
	}, [reduceMotion])

	// Gallery: inner-pan parallax and directional caption animation (same as highlights)
	useEffect(() => {
		const container = verticalContainerRef.current
		if (!container) return
		const slides = Array.from(container.querySelectorAll('[data-vg-item]'))
		const images = Array.from(container.querySelectorAll('[data-vg-image]'))
		const captions = Array.from(container.querySelectorAll('[data-vg-caption]'))
		if (reduceMotion) {
			images.forEach(img => { img.style.transform = 'none' })
			captions.forEach(cap => { cap.style.transform = 'none'; cap.style.opacity = '1' })
			return
		}
		// Smooth transitions for elegant trailing
		images.forEach(img => { img.style.transition = 'transform 500ms cubic-bezier(.22,.61,.36,1)'; })
		captions.forEach(cap => { cap.style.transition = 'transform 400ms cubic-bezier(.22,.61,.36,1), opacity 400ms ease-out'; })
		let rafId = 0
		const update = () => {
			const containerRect = container.getBoundingClientRect()
			const containerCenter = containerRect.left + containerRect.width / 2
			slides.forEach((slide, idx) => {
				const rect = slide.getBoundingClientRect()
				const slideCenter = rect.left + rect.width / 2
				// progress around center in range roughly -1..1
				let progress = (slideCenter - containerCenter) / rect.width
				// clamp
				progress = Math.max(-1, Math.min(1, progress))
				// ease for elegance (easeOutQuad on magnitude)
				const abs = Math.abs(progress)
				const easedAbs = 1 - Math.pow(1 - abs, 2)
				const easedProgress = Math.sign(progress) * easedAbs * 0.45 // reduced amplitude
				// proximity to center for opacity
				const proximity = 1 - abs
				const img = images[idx]
				const cap = captions[idx]
				if (img) {
					// Subtle inner pan with light zoom
					const panMax = Math.max(10, Math.min(26, rect.width * 0.02))
					const panPx = -easedProgress * panMax
					const scale = 1.015
					img.style.transform = `translateX(${panPx}px) scale(${scale}) translateZ(0)`
				}
				if (cap) {
					const capTranslateX = easedProgress * 10
					const capOpacity = 0.72 + Math.max(0, proximity) * 0.28 // 0.72 → 1
					cap.style.transform = `translateX(${capTranslateX}px)`
					cap.style.opacity = String(Math.max(0.72, Math.min(1, capOpacity)))
				}
			})
		}
		const onScroll = () => {
			if (rafId) cancelAnimationFrame(rafId)
			rafId = requestAnimationFrame(update)
		}
		update()
		container.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => {
			container.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onScroll)
			if (rafId) cancelAnimationFrame(rafId)
		}
	}, [reduceMotion])

	// Page 5/6: narrative and grid reveals
	useEffect(() => {
		const sections = []
		const page5 = document.querySelector('[data-p5]')
		const page6Cards = Array.from(document.querySelectorAll('[data-p6-card]'))
		if (page5) sections.push(page5)
		if (reduceMotion) {
			if (page5) {
				page5.style.opacity = '1'
				const children = page5.querySelectorAll('[data-reveal]')
				children.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none' })
			}
			page6Cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none' })
			return
		}
		// Page 5 headline/subtext
		if (page5) {
			page5.style.opacity = '1'
			const children = page5.querySelectorAll('[data-reveal]')
			children.forEach((el, i) => {
				el.style.opacity = '0'
				el.style.transform = 'translateY(14px)'
				el.style.transition = `opacity 700ms ease, transform 700ms cubic-bezier(.22,.61,.36,1)`
				el.style.transitionDelay = `${i * 90}ms`
			})
			const io5 = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						children.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
						io5.disconnect()
					}
				})
			}, { threshold: 0.25 })
			io5.observe(page5)
		}
		// Page 6 cards
		if (page6Cards.length) {
			page6Cards.forEach((card, i) => {
				card.style.opacity = '0'
				card.style.transform = 'translateY(18px)'
				card.style.transition = 'opacity 650ms ease, transform 650ms cubic-bezier(.22,.61,.36,1)'
				card.style.transitionDelay = `${i * 110}ms`
			})
			const io6 = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						page6Cards.forEach(card => { card.style.opacity = '1'; card.style.transform = 'none' })
						io6.disconnect()
					}
				})
			}, { threshold: 0.2 })
			io6.observe(page6Cards[0])
		}
	}, [reduceMotion])

	// Page 6: enhance cards with subtle tilt and icon glow
	useEffect(() => {
		if (reduceMotion) return
		const cards = Array.from(document.querySelectorAll('[data-p6-card]'))
		const cleanup = cards.map(card => {
			const onMove = (e) => {
				const rect = card.getBoundingClientRect()
				const x = (e.clientX - rect.left) / rect.width - 0.5
				const y = (e.clientY - rect.top) / rect.height - 0.5
				card.style.transform = `translateY(0px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`
			}
			const onLeave = () => {
				card.style.transform = 'none'
			}
			card.style.transformStyle = 'preserve-3d'
			card.style.transition = 'transform 400ms cubic-bezier(.22,.61,.36,1)'
			card.addEventListener('mousemove', onMove)
			card.addEventListener('mouseleave', onLeave)
			return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
		})
		return () => cleanup.forEach(fn => fn && fn())
	}, [reduceMotion])

	// Specification page: reveal + parallax + list stagger
	useEffect(() => {
		const specSection = document.querySelector('[data-spec]')
		if (!specSection) return
		const blueprint = specSection.querySelector('[data-spec-blueprint]')
		const copyEls = specSection.querySelectorAll('[data-spec-reveal]')
		const listItems = specSection.querySelectorAll('[data-spec-item]')
		if (reduceMotion) {
			copyEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
			listItems.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
			return
		}
		copyEls.forEach((el, i) => {
			el.style.opacity = '0'
			el.style.transform = 'translateY(12px)'
			el.style.transition = 'opacity 600ms ease, transform 600ms cubic-bezier(.22,.61,.36,1)'
			el.style.transitionDelay = `${i * 90}ms`
		})
		const ioCopy = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					copyEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
					ioCopy.disconnect()
				}
			})
		}, { threshold: 0.2 })
		ioCopy.observe(specSection)
		// Stagger list
		listItems.forEach((el, i) => {
			el.style.opacity = '0'
			el.style.transform = 'translateY(10px)'
			el.style.transition = 'opacity 500ms ease, transform 500ms ease'
			el.style.transitionDelay = `${200 + i * 80}ms`
		})
		const ioList = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					listItems.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
					ioList.disconnect()
				}
			})
		}, { threshold: 0.15 })
		ioList.observe(specSection)
		// Parallax blueprint
		let rafId = 0
		const onScroll = () => {
			if (!blueprint) return
			if (rafId) cancelAnimationFrame(rafId)
			rafId = requestAnimationFrame(() => {
				const rect = specSection.getBoundingClientRect()
				const progress = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight))
				const translate = (progress - 0.5) * 14 // px
				blueprint.style.transform = `translateY(${translate.toFixed(1)}px)`
			})
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => { window.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId) }
	}, [reduceMotion])

	// AR section: reveal + parallax
	useEffect(() => {
		const ar = document.querySelector('[data-ar]')
		if (!ar) return
		const copyEls = ar.querySelectorAll('[data-ar-reveal]')
		const card = ar.querySelector('[data-ar-card]')
		const parallaxWrap = ar.querySelector('[data-ar-parallax]')
		if (reduceMotion) {
			copyEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
			if (card) card.style.transform = 'none'
			return
		}
		copyEls.forEach((el, i) => {
			el.style.opacity = '0'
			el.style.transform = 'translateY(12px)'
			el.style.transition = 'opacity 600ms ease, transform 600ms cubic-bezier(.22,.61,.36,1)'
			el.style.transitionDelay = `${i * 90}ms`
		})
		if (card) {
			card.style.willChange = 'transform'
			card.style.transform = 'scale(0.985)'
			card.style.transition = 'transform 800ms cubic-bezier(.16,1,.3,1)'
		}
		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					copyEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none' })
					if (card) card.style.transform = 'scale(1)'
					io.disconnect()
				}
			})
		}, { threshold: 0.25 })
		io.observe(ar)
		// Parallax image
		let rafId = 0
		const onScroll = () => {
			if (!parallaxWrap) return
			if (rafId) cancelAnimationFrame(rafId)
			rafId = requestAnimationFrame(() => {
				const rect = ar.getBoundingClientRect()
				const viewportH = window.innerHeight || 1
				const t = Math.min(1, Math.max(0, 1 - rect.top / viewportH))
				const translate = (t - 0.5) * 18
				parallaxWrap.style.transform = `translateY(${translate.toFixed(1)}px)`
			})
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => { window.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId) }
	}, [reduceMotion])

	// Mobile sticky button: widen until CTA fills screen; push while CTA visible; hide after CTA
	useEffect(() => {
		const wrap = mobileStickyWrapRef.current
		const btn  = mobileStickyBtnRef.current
		const cta  = finalCtaRef.current
		if (!wrap || !btn || !cta) return
	  
		// keep bottom fixed in CSS; we'll only use transform to push
		wrap.style.willChange = 'transform'
	  
		const BASE = 220        // start width
		const MAX  = 440        // max width
		const GROW_ZONE = 1.0   // how much of the viewport height above CTA we start growing (1.0 = full viewport)
	  
		let ctaInView = false
		// Observe CTA so we only push while it's visible
		const io = new IntersectionObserver(
		  ([entry]) => { ctaInView = entry.isIntersecting; },
		  { threshold: 0 } // any intersection
		)
		io.observe(cta)
	  
		let raf = 0
		const onScroll = () => {
		  if (raf) cancelAnimationFrame(raf)
		  raf = requestAnimationFrame(() => {
			const viewportH = window.innerHeight || 1
			const rect = cta.getBoundingClientRect()
	  
			// Width grow only when CTA approaches the top (0) from below
			// progress 0..1 when rect.top goes from viewportH * GROW_ZONE down to 0
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
	  
			// Push up ONLY while CTA is on screen, using transform (no bottom changes)
			if (ctaInView) {
			  const overshoot = Math.max(0, viewportH - rect.bottom) // 0..viewportH
			  wrap.style.transform = `translate3d(0, ${-overshoot}px, 0)`
			  btn.style.opacity = '1'
			  btn.style.pointerEvents = 'auto'
			} else {
			  wrap.style.transform = 'translate3d(0, 0, 0)'
			  // If CTA has been passed (fully above), hide the sticky
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

	// Mobile CTA spotlight/brightness as you scroll into the final CTA (after FAQ)
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
				const raw = 1 - Math.max(0, Math.min(1, rect.top / viewportH)) // 0→1
				const ease = raw < 0.5 ? (2 * raw * raw) : (1 - Math.pow(-2 * raw + 2, 2) / 2)
				// Brightness only: 0.30 → 1.00
				setCtaGlow(0.10 + ease * 0.99)
			})
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
	}, [])

  
  
	

      return (
		<>
        {/* Top Bar */}
        <header className={`hidden sm:block ${headerIsUnstuck ? 'absolute' : 'fixed'} top-0 left-0 w-full z-50 py-4 md:py-6`}>
          <div className="w-full px-8 sm:px-12 lg:px-16">
            <div className="flex items-center justify-between">
						<button 
							onClick={scrollToTop}
							className={`text-xl sm:text-2xl md:text-3xl font-medium tracking-wide transition-all duration-300 hover:opacity-80 cursor-pointer ${isChaptersVisible || isARVisible ? 'text-black' : 'text-white'}`} 
							style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
						>
							Hornbill
						</button>
							<div
								className={`${isChaptersVisible || isARVisible
									? 'bg-white/85 border border-black/10 shadow-md'
									: 'bg-white/10 border border-white/25 backdrop-blur-md shadow-lg'} rounded-full inline-flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5`}
								role="group"
								aria-label="Brand and booking"
							>
								<div className="hidden sm:flex items-center gap-2">
									<img src="/images/HORNBILL-LOGO.png" alt="Hornbill Logo" className="w-4 h-4 object-contain" />
									<span className={`${isChaptersVisible || isARVisible ? 'text-black/80' : 'text-white/90'} font-medium text-sm`} style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>Hornbill Smart Pod</span>
              </div>
								<span className={`${isChaptersVisible || isARVisible ? 'bg-black/10' : 'bg-white/20'} h-5 w-px mx-2 hidden sm:block`} aria-hidden="true" />
								<Link
									to="/book"
									className={`hidden sm:inline-flex items-center justify-center rounded-full text-sm font-medium px-3.5 md:px-5 py-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 bg-white text-black hover:bg-white/90 focus-visible:ring-black/20 border border-black/10`}
									style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
									aria-label="Book a demo"
								>
									Book a demo
								</Link>
              </div>
            </div>
          </div>
        </header>

		{/* Mobile bottom floating Book Now (Opal-style) */}
		<div
  ref={mobileStickyWrapRef}
  className="sm:hidden fixed inset-x-0 z-50 pointer-events-none"
  style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
>
  <div className="flex justify-center">
    <Link
      to="/book"
      ref={mobileStickyBtnRef}
      className="
        pointer-events-auto bg-white text-black text-[14px] leading-none
        font-medium px-10 py-4 rounded-[6px] text-center active:scale-95
        transition-all duration-300
      "
      style={{
        width: '240px', // JS grows this while scrolling through Final CTA
        mixBlendMode: 'difference',
        WebkitMixBlendMode: 'difference',
        isolation: 'isolate',
        fontFamily: 'General Sans, Inter, system-ui, sans-serif',
        boxShadow: '0 0 24px rgba(255, 160, 27, 0.43), 0 0 48px rgba(228, 64, 8, 0.33), 0 4px 20px rgba(255, 160, 27, 0.28)',
        animation: 'elegant-glow 3s ease-in-out infinite'
      }}
    >
      Book a demo
    </Link>
  </div>
</div>
		{/* Mobile top bar (Opal-style) */}
		<div className="sm:hidden fixed top-0 inset-x-0 z-50" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 4px)' }}>
			<div className="px-4 py-3 flex items-center justify-between">
				<button 
					onClick={scrollToTop}
					className={`text-[1.4rem] font-medium hover:opacity-80 transition-all duration-300 cursor-pointer ${isChaptersVisible || isARVisible ? 'text-black' : 'text-white'}`} 
					style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
				>
					Hornbill
				</button>
				{/* Hornbill Logo */}
				<div className="w-7 h-7 flex items-center justify-center">
					<img src="/images/HORNBILL-LOGO.png" alt="Hornbill Logo" className="w-full h-full object-contain" />
				</div>
			</div>
			<div className="h-px bg-white/15" />
		</div>

			{/* Page 1: Hero */}
      <section ref={heroRef} className="w-full h-screen overflow-hidden relative" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px 600px' }}>
        <div className="absolute inset-0 w-full h-full" style={{ transform: reduceMotion ? 'none' : `translateY(${heroParallax * 12}px)`, transition: 'transform 80ms linear' }}>
					<video ref={videoRef} src={heroVideoSrc} poster="/images/smartworkpod-hero-desktop.jpg" preload="metadata" className={`w-full h-full object-cover object-center ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 600ms ease-out' }} autoPlay muted playsInline onLoadedData={() => setIsVideoLoaded(true)} onCanPlay={() => setIsVideoLoaded(true)} />
					<div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        </div>
          <div className="absolute inset-0 flex items-center justify-end pr-8 lg:pr-16 xl:pr-20">
            <div className="max-w-2xl text-right">
						<h2 className="text-white text-2xl lg:text-3xl xl:text-4xl font-medium leading-tight mb-3 sm:mb-4 md:mb-5 tracking-tight" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>
							<span className="inline-block" style={{ animation: reduceMotion ? 'none' : (isVideoLoaded ? 'slideInFromRight 1s ease-out 0.5s both' : 'none') }}>Your All-in-One<br/>Smart Workspace</span>
              </h2>
              <div className="relative inline-block" style={{ animation: reduceMotion ? 'none' : (isVideoLoaded ? 'slideInFromRight 1s ease-out 0.5s both' : 'none') }}>
							<div className="gemini-border-container">
								<a href="https://www.youtube.com/watch?v=cBpGq-vDr2Y&ab_channel=MarquesBrownlee" target="_blank" rel="noopener noreferrer" className="relative text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-normal transition-all duration-300 bg-black z-10 inline-block text-sm sm:text-base md:text-lg" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', letterSpacing: '-0.01em' }}>See the pod in action</a>
              </div>
            </div>
          </div>
        </div>
      </section>

			{/* Page 2: Gradient text highlight */}
		<section ref={secondPageWrapperRef} className="relative" style={{ height: '200vh', contentVisibility: 'auto', containIntrinsicSize: '1200px 800px' }}>
				<div className="sticky top-0 h-screen w-full">
					<div className="absolute inset-0 w-full h-full" style={{ background: 'linear-gradient(135deg, #A1080E 0%, #E44008 41%, #000000 100%)' }} />
				<div className="relative h-full flex items-center justify-center z-10 text-center px-8 max-w-5xl mx-auto">
						<p className="leading-tight select-none text-white" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(24px, 2.1vw, 48px)', lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: 500 }}>
							{scrollingTextWords.map((word, i) => (
							word === '\n' ? (
								<br key={`br-${i}`} />
							) : (
								<span
									key={`word-${i}`}
									className="inline-block mr-2 transition-all duration-300 ease-out"
									style={{
										opacity: getWordOpacity(i),
										backgroundImage: i >= finalLineStartIndex ? 'linear-gradient(90deg, #FFFFFF 0%, #FFD7B0 50%, #FFFFFF 100%)' : undefined,
										WebkitBackgroundClip: i >= finalLineStartIndex ? 'text' : undefined,
										backgroundClip: i >= finalLineStartIndex ? 'text' : undefined,
										color: i >= finalLineStartIndex ? 'transparent' : undefined,
										fontFamily: i >= finalLineStartIndex ? 'Lora, Georgia, serif' : 'General Sans, Inter, system-ui, sans-serif',
										fontWeight: i >= finalLineStartIndex ? 600 : 500
									}}
								>
									{word}
								</span>
							)
            ))}
          </p>
					</div>
        </div>
      </section>

		{/* Page 3: Focus, Wellness, Elegance - Single View */}
		<section ref={stickySectionRef} className="relative bg-[#F2F0EE] py-12 sm:py-16 lg:py-20 overflow-hidden">
			{/* Animated Subtle Dotted Background Pattern - Desktop Only */}
			<div 
				className="absolute inset-0 opacity-[0.12] pointer-events-none hidden lg:block"
				style={{
					backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
					backgroundSize: '40px 40px',
					animation: 'subtle-drift 20s ease-in-out infinite'
				}}
			/>
			
			{/* Vertical Dotted Lines - Desktop Only */}
			<div className="absolute left-24 sm:left-32 lg:left-40 top-0 bottom-0 w-px opacity-20 hidden lg:block"
				style={{
					backgroundImage: 'linear-gradient(to bottom, #000 40%, transparent 40%)',
					backgroundSize: '1px 16px'
				}}
			/>
			<div className="absolute right-24 sm:right-32 lg:right-40 top-0 bottom-0 w-px opacity-20 hidden lg:block"
				style={{
					backgroundImage: 'linear-gradient(to bottom, #000 40%, transparent 40%)',
					backgroundSize: '1px 16px'
				}}
			/>
			
			{/* Top Horizontal Dotted Line - Desktop Only, Lower Position */}
			<div className="absolute left-0 right-0 h-px opacity-20 hidden lg:block"
				style={{
					top: 'calc(6rem)',
					backgroundImage: 'linear-gradient(to right, #000 40%, transparent 40%)',
					backgroundSize: '16px 1px'
				}}
			/>
			
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full relative">
				<div className="h-12 sm:h-16 lg:h-20" />
				
				{/* Central Header */}
				<div className="text-center mb-16 sm:mb-20 lg:mb-24">
					{/* Badge like Spotlight section */}
					<div className="inline-flex items-center gap-2 mb-5">
						<span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-base font-medium text-black">2</span>
						<span className="text-base font-medium text-black" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>Foundation</span>
					</div>
					
					<h2 
						className="text-black font-medium leading-tight mb-4"
						style={{ 
							fontFamily: 'General Sans, Inter, system-ui, sans-serif',
							fontSize: 'clamp(32px, 4.5vw, 60px)',
							letterSpacing: '-0.02em',
							fontWeight: 500
						}}
					>
						Designed for how you work best
					</h2>
					<p 
						className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12"
						style={{
							fontFamily: 'General Sans, Inter, system-ui, sans-serif',
							fontSize: 'clamp(15px, 1.2vw, 19px)',
							fontWeight: 400
						}}
					>
						Every element of the Hornbill Smart Workpod is thoughtfully crafted to support your focus, wellness, and style.
					</p>
					
					{/* Full Length Divider Line */}
					<div className="w-full h-px bg-gray-300 mx-auto" />
				</div>

				{/* Three Pillars - Side by Side */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
					{chapters.map((chapter) => (
						<div key={chapter.badge} className="group">
							{/* Image - Taller */}
							<div className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl mb-5 transition-transform duration-300 group-hover:scale-[1.01]">
								<img
									src={chapter.image}
									alt={chapter.alt}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							</div>
							
							{/* Content */}
							<div>
								<h3
									className="text-black font-normal mb-2"
									style={{ 
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(20px, 1.5vw, 22px)',
										letterSpacing: '0.002em',
										fontWeight: 500
									}}
								>
									{chapter.title}.
								</h3>
								<p
									className="text-gray-500 leading-relaxed font-light"
									style={{
										fontFamily: 'General Sans, Inter, system-ui, sans-serif',
										fontSize: 'clamp(13px, 0.95vw, 15px)',
										fontWeight: 300,
										lineHeight: '1.6'
									}}
								>
									{chapter.description}
								</p>
							</div>
						</div>
					))}
				</div>
				
				<div className="h-16 sm:h-20 lg:h-24" />
			</div>
			
			{/* Bottom Horizontal Dotted Line - Desktop Only */}
			<div className="absolute left-0 right-0 h-px opacity-20 hidden lg:block"
				style={{
					bottom: 'calc(6rem)',
					backgroundImage: 'linear-gradient(to right, #000 40%, transparent 40%)',
					backgroundSize: '16px 1px'
				}}
			/>
		</section>

			{/* Page 4: Spotlight film */}
			<section ref={spotlightRef} className="relative w-full min-h-screen bg-black text-white flex items-center">
				<div className="absolute inset-0 pointer-events-none">
					<img src="/images/spotlight-bg.png" alt="Spotlight background" className="w-full h-full object-cover" />
				</div>
				<div className="relative w-full px-6 sm:px-10 lg:px-16 pt-[9vh] pb-10">
						<div className="max-w-5xl mx-auto text-center mb-8" style={{ transform: reduceMotion ? 'none' : `translateY(${spotlightParallax * -0.5}px)`, transition: 'transform 80ms linear' }}>
						<div className="inline-flex items-center gap-2 mb-5"><span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-base font-medium">3</span><span className="text-base font-medium" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>Spotlight</span></div>
						<h2 className="font-medium leading-tight mb-3" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(28px, 4vw, 56px)', letterSpacing: '-0.01em' }}>The future of work, in one pod.</h2>
						<p className="opacity-90" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(14px, 1.2vw, 18px)' }}>See how Hornbill SmartPod brings productivity, health, and design together</p>
							{/* Progress rail */}
							<div className="mt-10 h-1 w-full bg-white/10 rounded-full overflow-hidden">
							<div className="h-full bg-gradient-to-r from-white/60 via-white/70 to-white/60" style={{ width: `${Math.max(4, Math.min(100, spotlightProgress * 100))}%`, transition: 'width 120ms linear' }} />
					</div>
					</div>
					{/* Lite YouTube embed */}
					<div ref={litePlayerRef} className="mx-auto max-w-6xl rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/40 relative" style={{ height: 'clamp(260px, 52vh, 680px)', transform: reduceMotion ? 'none' : `translateY(${spotlightParallax}px)`, transition: 'transform 80ms linear' }}>
						{isVideoIframeLoaded ? (
							<iframe 
								title="Hornbill SmartPod Film" 
								src={buildYouTubeSrc(spotlightVideoId)} 
								className="w-full h-full" 
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
								allowFullScreen 
								style={{ opacity: 1 }}
							/>
						) : (
							<button onClick={() => { setHasUserInitiatedVideo(true); setIsVideoIframeLoaded(true) }} className="w-full h-full relative group">
								<img src={`https://i.ytimg.com/vi/${spotlightVideoId}/maxresdefault.jpg`} alt="Watch the Hornbill SmartPod film" className="w-full h-full object-cover" loading="lazy" decoding="async" />
								<div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 60% at 50% 0%, rgba(255,255,255,0.06), transparent 60%)' }} />
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl transition-transform duration-200">▶</span>
								</div>
							</button>
						)}
						{/* Soft vignette */}
						<div className="pointer-events-none absolute inset-0 soft-vignette" />
              </div>
            </div>
			</section>

			{/* Page 4: Highlights */}
			<section className="relative w-full bg-black text-white min-h-screen">
				<div className="px-6 sm:px-10 lg:px-16 pt-16 lg:pt-20 max-w-[1400px] mx-auto">
					<div ref={highlightsHeaderRef} className="flex items-start justify-between gap-6 relative">
						<div className="max-w-3xl pr-6">
							<div className="flex items-center gap-3 mb-5">
								<span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">4</span>
								<span className="text-lg">Highlights</span>
							</div>
							<h2 className="text-white font-medium leading-[1.05] mb-4" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(34px, 4vw, 48px)', letterSpacing: '-0.01em' }}>The Power of an Office in the<br className="hidden md:block"/> Size of a Box.</h2>
							<p ref={highlightsParagraphRef} className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl">Every purchase includes the complete Hornbill system — with desk, power, accessories, and the Hornbill mobile app.</p>
						</div>
						<div className="hidden md:flex items-center gap-3" style={{ position: 'absolute', right: 0, top: controlsTop }}>
							<button aria-label="Previous slide" onClick={prevHighlight} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronLeft className="w-5 h-5"/></button>
							<button aria-label="Next slide" onClick={nextHighlight} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronRight className="w-5 h-5"/></button>
						</div>
                </div>
                
					{/* Slider */}
					<div className="mt-6 md:mt-8">
						<div ref={highlightsContainerRef} className="scroll-container-smooth scrollbar-hide flex gap-6 md:gap-8 px-1 md:px-0 overflow-x-auto overscroll-x-contain snap-x snap-proximity" style={{ scrollPadding: '0 16px' }}>
							{highlightSlides.map((slide) => (
								<figure key={slide.src} className="group shrink-0 w-[86vw] sm:w-[78vw] md:w-[70vw] lg:w-[940px] rounded-[26px] overflow-hidden bg-white/5 ring-1 ring-white/10 relative focus:outline-none focus:ring-2 focus:ring-white/30 snap-center" tabIndex={0} data-hl-item>
									<img src={slide.src} alt={slide.alt} className="w-full h-[54vh] md:h-[56vh] lg:h-[60vh] object-cover transition-transform duration-500 will-change-transform" loading="lazy" data-hl-image />
									{/* Legibility gradient */}
									<div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
									<figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 will-change-transform" data-hl-caption>
										<div className="max-w-[55%] text-white">
											<div className="text-[20px] sm:text-[20px] md:text-[22px] lg:text-[22px] font-normal leading-[1.1] mb-1 sm:mb-1.5 md:mb-2 text-gray-300" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', letterSpacing: '-0.01em' }}>
												{slide.title.split('.')[0]}.
											</div>
											{slide.title.split('.').length > 1 && (
												<div className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-regular leading-[1.2] opacity-90" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', letterSpacing: '-0.005em' }}>
													{slide.title.split('.').slice(1).join('.').trim()}
												</div>
											)}
										</div>
									</figcaption>
								</figure>
							))}
						</div>
						<div className="flex md:hidden items-center justify-end gap-3 py-5">
							<button aria-label="Previous slide" onClick={prevHighlight} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronLeft className="w-5 h-5"/></button>
							<button aria-label="Next slide" onClick={nextHighlight} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronRight className="w-5 h-5"/></button>
						</div>
					</div>
				</div>
			</section>

			{/* Page 5: Big narrative headline (left-aligned, centered container) */}
			<section className="w-full bg-black text-white min-h-[60vh] flex items-center" data-p5>
				<div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-64 pb-20 lg:pt-80 lg:pb-28 w-full">
					<h2 className="font-medium max-w-[24ch]" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(30px, 4.8vw, 52px)', lineHeight: 1.12, letterSpacing: '-0.01em' }} data-reveal>
						Intelligent comfort meets Italian craftsmanship, uniting power, ergonomics, and quiet precision in a SmartPod that transforms how you work, think, and create.
					</h2>
					<p className="mt-7 text-white/70 max-w-[58ch]" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(15px, 1.2vw, 18px)', lineHeight: 1.6 }} data-reveal>
						Built for long focus blocks and rapid sprints alike, it offers sit-stand freedom, seamless device integration, and an acoustic shell that shuts the world out—so your best work comes naturally.
					</p>
					<hr className="mt-8 border-white/30 border-t-2" />
				</div>
			</section>

			{/* Page 6: Four-up feature grid (Opal-inspired) */}
			<section className="w-full bg-black text-white min-h-[90vh] flex items-center pt-16 pb-16 lg:pt-0 lg:pb-24">
				<div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
						{/* Card 1 */}
						<div className={`transition-all duration-700`} data-p6-card>
							<div className="w-14 h-14 md:w-12 md:h-12 rounded-2xl mb-5 bg-white/10 flex items-center justify-center">
								<HomeIcon className="w-7 h-7 md:w-6 md:h-6" style={{ color: '#FFA01B' }} />
							</div>
							<h3 className="font-medium mb-2 max-w-[26ch]" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(24px,5.5vw,32px)' }}>Built to belong</h3>
							<p className="text-white/70 leading-relaxed max-w-[50ch]">Hornbill's compact footprint and refined design let the SmartPod belong anywhere—home office, studio, or open workspace. Heavy-duty castor wheels with locking brakes make relocation smooth and stable, so your ideal setup can move when you do.</p>
						</div>

						{/* Card 2 */}
						<div className={`transition-all duration-700 delay-75`} data-p6-card>
							<div className="w-14 h-14 md:w-12 md:h-12 rounded-2xl mb-5 bg-white/10 flex items-center justify-center">
								<Move className="w-7 h-7 md:w-6 md:h-6" style={{ color: '#FFA01B' }} />
							</div>
							<h3 className="font-medium mb-2 max-w-[26ch]" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(24px,5.5vw,32px)' }}>Effortless portability</h3>
							<p className="text-white/70 leading-relaxed max-w-[50ch]">Integrated wheels and precision brakes let you glide the SmartPod across floors and lock it firmly in place. Shift rooms, reorient layouts, or roll into a new space with confidence—movement stays silent and controlled.</p>
						</div>

						{/* Card 3 */}
						<div className={`transition-all duration-700 delay-150`} data-p6-card>
							<div className="w-14 h-14 md:w-12 md:h-12 rounded-2xl mb-5 bg-white/10 flex items-center justify-center">
								<VolumeX className="w-7 h-7 md:w-6 md:h-6" style={{ color: '#FFA01B' }} />
							</div>
							<h3 className="font-medium mb-2 max-w-[26ch]" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(24px,5.5vw,32px)' }}>Quiet by design</h3>
							<p className="text-white/70 leading-relaxed max-w-[50ch]">High-grade acoustic fabric enhances privacy and focus by reducing noise in open-plan offices or shared spaces. The panel's refined texture absorbs sound while blending seamlessly with the SmartPod's minimalist design.</p>
						</div>
						
						{/* Card 4 */}
						<div className={`transition-all duration-700 delay-[225ms]`} data-p6-card>
							<div className="w-14 h-14 md:w-12 md:h-12 rounded-2xl mb-5 bg-white/10 flex items-center justify-center">
								<Radio className="w-7 h-7 md:w-6 md:h-6" style={{ color: '#FFA01B' }} />
							</div>
							<h3 className="font-medium mb-2 max-w-[26ch]" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(24px,5.5vw,32px)' }}>Connected anywhere</h3>
							<p className="text-white/70 leading-relaxed max-w-[50ch]">A portable communicator with SIM support keeps data private and secure, even without Wi-Fi. The SmartPod maintains seamless device integration and reliable connectivity wherever you set up.</p>
						</div>
					</div>

					<hr className="mt-16 border-white/15" />
				</div>
			</section>

			{/* Page 7: Vertical portrait carousel */}
			<section className="relative w-full bg-black text-white min-h-screen">
				<div className="px-6 sm:px-10 lg:px-16 pt-14 lg:pt-20 max-w-[1400px] mx-auto">
					<div ref={verticalHeaderRef} className="flex items-start justify-between gap-6 relative">
						<div className="max-w-3xl pr-6">
							<div className="flex items-center gap-3 mb-5">
								<span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">5</span>
								<span className="text-lg">Features</span>
							</div>
							<h2 className="text-white font-medium leading-[1.05] mb-4" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(34px, 4vw, 48px)', letterSpacing: '-0.01em' }}>The most advanced workpod<br className="hidden md:block"/> you've ever seen.</h2>
							<p ref={verticalParagraphRef} className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl">Every detail engineered for peak performance — from wireless charging to intelligent lighting, designed to elevate your work experience.</p>
						</div>
						<div className="hidden md:flex items-center gap-3" style={{ position: 'absolute', right: 0, top: controlsTop8 }}>
							<button aria-label="Previous photo" onClick={prevVertical} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronLeft className="w-5 h-5"/></button>
							<button aria-label="Next photo" onClick={nextVertical} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronRight className="w-5 h-5"/></button>
            </div>
          </div>

					<hr className="border-white/20 border-t-2 mt-6" />

					{/* Vertical Slider */}
					<div className="mt-6 md:mt-8">
						<div ref={verticalContainerRef} className="scroll-container-smooth scrollbar-hide flex gap-3 md:gap-4 px-1 md:px-0 overflow-x-auto overscroll-x-contain snap-x snap-proximity" style={{ scrollPadding: '0 16px' }}>
							{verticalSlides.map((slide, idx) => (
								<figure key={slide.src} className="shrink-0 w-[58vw] sm:w-[46vw] md:w-[36vw] lg:w-[360px] rounded-[26px] overflow-hidden ring-1 ring-white/10 relative bg-black snap-center" data-vg-item>
									<img src={slide.src} alt={slide.alt} className="w-full h-[60vh] md:h-[62vh] lg:h-[64vh] object-cover transition-transform duration-500 will-change-transform" loading="lazy" data-vg-image />
									<div className={`absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b ${idx === 4 ? 'from-black/65 via-black/20' : 'from-white/80 via-white/40'} to-transparent pointer-events-none`} />
										<div className="absolute inset-0 flex flex-col justify-start p-5 sm:p-6 will-change-transform" data-vg-caption>
											<div className={`${idx === 4 ? 'text-gray-300' : 'text-gray-900'} text-xs sm:text-sm font-medium`} style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontWeight: '500', textShadow: idx === 4 ? '0 1px 1px rgba(0,0,0,0.35)' : 'none' }}>{slide.label}</div>
											<h3 className={`${idx === 4 ? 'text-gray-300' : 'text-black'} font-medium leading-[1.1] whitespace-pre-line max-w-[22ch] mt-2`} style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(16px,3.2vw,22px)', letterSpacing: '-0.01em', textShadow: idx === 4 ? '0 1px 1px rgba(0,0,0,0.35)' : 'none' }}>{slide.title}</h3>
										</div>
								</figure>
							))}
						</div>
						<div className="flex md:hidden items-center justify-end gap-3 py-5">
							<button aria-label="Previous photo" onClick={prevVertical} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronLeft className="w-5 h-5"/></button>
							<button aria-label="Next photo" onClick={nextVertical} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronRight className="w-5 h-5"/></button>
            </div>
          </div>
        </div>
      </section>

			{/* Page 9: Specification */}
			<section className="relative w-full bg-black text-white min-h-screen flex items-center" data-spec>
				<div className="absolute inset-0 pointer-events-none opacity-[0.35]">
					<img src="/images/Background texture.png" alt="Background texture" className="w-full h-full object-cover" />
				</div>
				<div className="relative px-6 sm:px-10 lg:px-16 py-16 lg:py-24 max-w-[1400px] mx-auto w-full">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
						<div className="lg:col-span-6 order-3 lg:order-1 hidden lg:block">
							<div className="relative w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-auto" style={{ height: specEqualHeight || '56vh' }} data-spec-blueprint>
								<img src="/images/spec-image.png" alt="Hornbill SmartPod blueprint" className="absolute inset-0 w-full h-full object-contain" loading="lazy" />
							</div>
						</div>

						{/* Right: copy and list */}
						<div ref={specRightRef} className="lg:col-span-6 order-1 lg:order-2">
							<div className="flex items-center gap-3 mb-5" data-spec-reveal>
								<span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">6</span>
								<span className="text-lg">Specification</span>
							</div>
							<div className="space-y-4 sm:space-y-5">
								<h2 className="text-white font-medium leading-[1.05]" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(34px, 4vw, 48px)', letterSpacing: '-0.01em' }} data-spec-reveal>Everything you need to get your workspace ready.</h2>
								<p className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl" data-spec-reveal>Includes 15+ features that support your productivity and comfort. Mobile control, wireless charging, workspace lighting, and more.</p>
								<div className="gemini-border-container inline-block mt-1" data-spec-reveal>
									<a href="/Hornbill specification sheet .pdf" download="Hornbill-Specification-Sheet.pdf" className="relative text-white px-5 sm:px-6 py-3 rounded-full font-medium transition-all duration-300 bg-black z-10 inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/40" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', boxShadow: '0 0 0 0 rgba(255,255,255,0)', transition: 'box-shadow 250ms ease' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 26px rgba(255,255,255,0.08)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 0 rgba(255,255,255,0)' }}>Download Specification sheet <span aria-hidden>↗</span></a>
								</div>
							</div>

							{/* Mobile image placement */}
							<div className="lg:hidden mt-6" data-spec-reveal>
								<div className="relative w-full aspect-[4/3]">
									<img src="/images/spec-image.png" alt="Hornbill SmartPod blueprint" className="absolute inset-0 w-full h-full object-contain object-left" loading="lazy" />
								</div>
							</div>

						<hr className="border-white/20 my-6" />
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8" role="list">
							{/* Left column - 3 specs */}
							<div className="space-y-6">
								{specificationItems.slice(0, 3).map((item, index) => (
									<div key={index} className="flex gap-3" data-spec-item>
										<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
											{item.icon}
										</div>
										<div className="flex-1">
											<h3 className="text-white text-sm font-normal mb-1.5" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontWeight: 400 }}>
												{item.title}
											</h3>
											<p className="text-white/60 text-sm leading-relaxed font-light" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontWeight: 300 }}>
												{item.value}
											</p>
										</div>
									</div>
								))}
							</div>
							{/* Right column - Materials */}
							<div className="flex gap-3" data-spec-item>
								<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
									{specificationItems[3].icon}
								</div>
								<div className="flex-1">
									<h3 className="text-white text-sm font-normal mb-1.5" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontWeight: 400 }}>
										{specificationItems[3].title}
									</h3>
									<p className="text-white/60 text-sm leading-relaxed font-light" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontWeight: 300 }}>
										{specificationItems[3].value}
									</p>
								</div>
							</div>
						</div>
						</div>
					</div>
					<div className="pb-2" />
				</div>
			</section>

			{/* Page 10: AR Viewable block (as per Figma) - Mobile only */}
			<section ref={arSectionRef} className="relative w-full bg-offwhite-f2f0ee py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 lg:hidden" data-ar>
				<div className="px-6 sm:px-10 lg:px-16 max-w-[1400px] mx-auto">
					<div className="rounded-[22px] lg:rounded-[26px] dark-dot-grid text-white overflow-hidden" data-ar-card>
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center p-5 sm:p-6 lg:p-8">
							{/* Left copy */}
							<div className="lg:col-span-7 order-1 lg:order-1" data-ar-copy>
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-xs sm:text-sm font-medium">7</span>
									<span className="text-sm sm:text-base md:text-lg text-white/90" data-ar-reveal>AR Viewable</span>
								</div>
								<h2 className="font-medium leading-[1.08] mb-4 sm:mb-5 text-white" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(22px,2.6vw,34px)', letterSpacing: '-0.01em' }} data-ar-reveal>
									Experience the Hornbill SmartPod
									<br className="hidden md:block"/> in AR, right where you are.
								</h2>
								<div className="gemini-border-container inline-block mt-1.5 sm:mt-2" data-ar-reveal>
									<a href="#" onClick={(e) => { e.preventDefault(); const mv = document.getElementById('hb-ar-table'); if (mv && mv.activateAR) { mv.activateAR(); } }} className="relative bg-white text-black px-4 sm:px-5 py-2.5 rounded-full font-medium inline-flex items-center gap-2 transition-transform focus:outline-none focus:ring-2 focus:ring-black/20" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(13px,1.2vw,15px)', boxShadow: '0 0 0 0 rgba(0,0,0,0)', transition: 'box-shadow 250ms ease' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 26px rgba(0,0,0,0.12)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0,0,0,0)' }}>
										View it in your space <span aria-hidden>↗</span>
									</a>
								</div>
							</div>

							{/* Right image */}
							<div className="lg:col-span-5 order-2 lg:order-2" data-ar-visual>
								<div className="relative mx-auto w-[64%] sm:w-[54%] md:w-[48%] lg:w-[75%]" data-ar-parallax>
									<img src="/images/3darmodel.png" alt="Hornbill SmartPod AR model" className="w-full h-auto object-contain select-none pointer-events-none" loading="lazy" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Page 11: FAQ */}
			<section className="relative w-full text-white" style={{ background: 'linear-gradient(135deg, #A1080E 0%, #E44008 41%, #000000 100%)' }}>
				<div className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24 max-w-[1400px] mx-auto relative">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
						{/* Left heading and intro */}
						<div className="lg:col-span-5 flex flex-col h-full hidden lg:flex">
							<div className="flex-1">
								<h2 className="font-medium leading-[1.05] mb-4" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(26px, 3.4vw, 48px)' }}>Frequently asked<br/> questions (FAQ)</h2>
								<p className="text-white/85 text-base sm:text-base md:text-lg max-w-xl">Find quick answers to the most common questions about setup, features, and the Hornbill mobile app.</p>
							</div>
							<div className="mt-auto pt-8">
								<p className="text-white/90 text-sm sm:text-base">Still curious? Our team's here to help.</p>
								<div className="mt-2">
									<p className="text-white/90 text-sm sm:text-base">Call us at <a href="tel:043438005" className="text-white font-semibold underline decoration-white/60 underline-offset-4">043438005</a></p>
									<p className="text-white/90 text-sm sm:text-base">Email us at <a href="mailto:connect@hornbillinc.com" className="text-white font-semibold underline decoration-white/60 underline-offset-4">connect@hornbillinc.com</a></p>
								</div>
							</div>
						</div>

						{/* Mobile title - Mobile only */}
						<div className="lg:hidden mb-8">
							<h2 className="font-medium leading-[1.05] mb-4" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)' }}>Frequently asked<br/> questions (FAQ)</h2>
							<p className="text-white/85 text-base max-w-xl">Find quick answers to the most common questions about setup, features, and the Hornbill mobile app.</p>
						</div>

						{/* Right accordion */}
						<div className="lg:col-span-7">
							<div className="border-t border-white/30">
								<ul role="list" id="faq-list">
									{faqs.slice(0,5).map((faq, index) => {
										const isOpen = openFaqIndex === index
										return (
											<li key={faq.title} className="">
												<button
													onClick={() => toggleFaq(index)}
													className="w-full flex items-center justify-between gap-4 py-3 sm:py-4 text-left"
													aria-expanded={isOpen}
													aria-controls={`faq-panel-${index}`}
												>
													<div className="flex items-center gap-4">
														<span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/40 text-xs font-medium">{index + 1}</span>
														<span className={`text-[15px] sm:text-base md:text-lg ${isOpen ? 'font-semibold' : 'font-normal'}`}>{faq.title}</span>
													</div>
													<span className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">{isOpen ? <Minus className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}</span>
												</button>
												<div id={`faq-panel-${index}`} role="region" className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
													<div className="overflow-hidden">
														<div className="pl-11 md:pl-12 pb-5 text-white/90 text-sm sm:text-base leading-relaxed">
															{faq.answer}
														</div>
													</div>
												</div>
												<hr className="border-white/30" />
										</li>
									)
									})}
								</ul>
								{/* Collapsible container for remaining FAQs with premium animation */}
								<div className={`grid transition-[grid-template-rows] duration-500 ease-out ${showAllFaqs ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} aria-hidden={!showAllFaqs}>
									<div className="overflow-hidden">
										<ul role="list" className="pt-1">
											{faqs.slice(5).map((faq, idx) => {
												const index = idx + 5
												const isOpen = openFaqIndex === index
												return (
													<li key={faq.title} className="">
														<button
															onClick={() => toggleFaq(index)}
															className="w-full flex items-center justify-between gap-4 py-3 sm:py-4 text-left"
															aria-expanded={isOpen}
															aria-controls={`faq-panel-${index}`}
														>
															<div className="flex items-center gap-4">
																<span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/40 text-xs font-medium">{index + 1}</span>
																<span className={`text-[15px] sm:text-base md:text-lg ${isOpen ? 'font-semibold' : 'font-normal'}`}>{faq.title}</span>
															</div>
															<span className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">{isOpen ? <Minus className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}</span>
														</button>
														<div id={`faq-panel-${index}`} role="region" className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
															<div className="overflow-hidden">
																<div className="pl-11 md:pl-12 pb-5 text-white/90 text-sm sm:text-base leading-relaxed">
																	{faq.answer}
																</div>
															</div>
														</div>
														<hr className="border-white/30" />
													</li>
												)
											})}
										</ul>
									</div>
								</div>

								{/* Minimal glassmorphic arrow toggle */}
								<div className="flex justify-center mt-3 sm:mt-5">
									<button
										onClick={() => setShowAllFaqs(v => !v)}
										className={`w-9 h-9 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center transition-transform ${showAllFaqs ? 'rotate-180' : ''}`}
										aria-expanded={showAllFaqs}
										aria-controls="faq-list"
										title={showAllFaqs ? 'Collapse' : 'Expand'}
									>
										<ChevronDown className="w-4 h-4 text-white"/>
									</button>
								</div>
							</div>
						</div>

						{/* Mobile contact info - Mobile only */}
						<div className="lg:hidden mt-8 pt-6 border-t border-white/30">
							<p className="text-white/90 text-sm">Still curious? Our team's here to help.</p>
							<div className="mt-2">
								<p className="text-white/90 text-sm">Call us at <a href="tel:043438005" className="text-white font-semibold underline decoration-white/60 underline-offset-4">043438005</a></p>
								<p className="text-white/90 text-sm">Email us at <a href="mailto:connect@hornbillinc.com" className="text-white font-semibold underline decoration-white/60 underline-offset-4">connect@hornbillinc.com</a></p>
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
				
				{/* Mobile Layout: Text floating above, image anchored to bottom */}
				<div className="lg:hidden min-h-screen relative">
					{/* Text Section — centered, no inline button on mobile */}
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
					
					{/* Image Section - Fullscreen background */}
					<div className="absolute inset-0 w-full h-full">
						<img src="/images/ChatGPT Image Sep 12, 2025, 06_09_37 PM.png" alt="Hornbill SmartPod hands on screen" className="w-full h-full object-cover object-center" style={{ filter: `brightness(${ctaGlow})` }} />
						<div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,${Math.max(0.2, 0.55/ctaGlow)}), transparent 55%)` }} />
					</div>
				</div>

				{/* Desktop Layout: Side by side */}
				<div className="hidden lg:grid lg:grid-cols-12 lg:items-center min-h-screen">
					{/* Text content */}
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
					
					{/* Image */}
					<div className="lg:col-span-8 relative h-screen">
						<img src="/images/vtapicture.png" alt="Hornbill SmartPod hands on screen" className="absolute inset-0 w-full h-full object-cover object-left"/>
						<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
					</div>
				</div>
			</section>

		<Footer />

			{/* Hidden model-viewer for AR launch */}
			<div className="sr-only" aria-hidden>
				<model-viewer id="hb-ar-table"
					src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
					ios-src="https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
					alt="AR model placeholder"
					ar
					camera-controls
					ar-modes="scene-viewer quick-look webxr"
					style={{ width: 0, height: 0 }}>
				</model-viewer>
			</div>
		</>
  )
}

export default HomePage 


