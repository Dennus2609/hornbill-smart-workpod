import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Hornbill Service Overview' },
    { id: 'eligibility', title: 'Eligibility' },
    { id: 'payment', title: 'General Payment Terms' },
    { id: 'delivery', title: 'Delivery and Returns' },
    { id: 'licenses', title: 'Licenses' },
    { id: 'ownership', title: 'Ownership; Proprietary Rights' },
    { id: 'third-party', title: 'Third-Party Terms' },
    { id: 'communications', title: 'Communications' },
    { id: 'conduct', title: 'Prohibited Conduct' },
    { id: 'modification', title: 'Modification of Terms' },
    { id: 'termination', title: 'Term & Termination' },
    { id: 'indemnity', title: 'Indemnity' },
    { id: 'disclaimers', title: 'Disclaimers; No Warranties' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'disputes', title: 'Dispute Resolution' },
    { id: 'miscellaneous', title: 'Miscellaneous' }
  ]

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -100; // Offset for header height etc.
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  return (
    <div className="min-h-screen bg-black" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-medium hover:opacity-80 transition-opacity">
            Hornbill
          </Link>
          <div className="relative inline-block gemini-border-container">
            <Link
              to="/book"
              className="relative text-white px-5 py-2.5 rounded-full text-sm font-normal transition-all duration-200 hover:scale-105 bg-black z-10 inline-block"
            >
              Order now
            </Link>
          </div>
        </div>
      </header>
      <div className="w-full h-px bg-gray-800"></div>

      {/* Hero Section */}
      <section className="bg-black text-white pt-24 pb-36">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl lg:text-7xl font-normal mb-6 leading-tight">
            Terms &<br />
            Conditions.
          </h1>
          <p className="text-xl text-gray-400 max-w-lg">
            Learn more about the terms and conditions of our products and services.
          </p>
          <div className="w-full h-px bg-gray-700 mt-16"></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-[-6rem] relative z-10">
        <div className="bg-white rounded-2xl text-black shadow-xl shadow-black/5">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-80 flex-shrink-0 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
               <nav className="lg:sticky lg:top-10">
                {/* Dropdown for mobile */}
                <div className="lg:hidden mb-4">
                  <select
                    onChange={(e) => scrollToSection(e.target.value)}
                    value={activeSection}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* List for desktop */}
                <div className="hidden lg:block space-y-1">
                   {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-4 py-3 text-sm transition-all duration-200 rounded-lg ${
                        activeSection === section.id
                          ? 'font-semibold text-black bg-gray-50'
                          : 'font-normal text-gray-600 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8 lg:p-12">
              <div className="text-right mb-12">
                <p className="text-sm text-gray-500">Last updated: January 1, 2024</p>
              </div>

              {/* Terms Sections */}
              <div className="space-y-16">
                
                {/* Overview */}
                <section id="overview">
                  <h2 className="text-2xl font-semibold text-black mb-6">Hornbill Service Overview</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Welcome, and thank you for your interest in Hornbill Workspaces Pvt. Ltd. ("Hornbill," "we," or "us") and our 
                      website at www.hornbillworkpod.com, along with our related applications (including any software or mobile app) 
                      and services provided by us (collectively, the "Service"). These Terms of Service are a legally binding contract 
                      between you and Hornbill regarding your use of the Service.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Hornbill designs and sells ergonomic hardware and smart work pods ("Products") to optimize workspace 
                      environments for home and office use. These Products may include embedded or downloadable software 
                      ("Software") and are compatible with a range of digital devices and platforms. Hornbill also offers a companion 
                      mobile application that allows users to remotely control features of the workspace pod.
                    </p>
                  </div>
                </section>

                {/* Eligibility */}
                <section id="eligibility">
                  <h2 className="text-2xl font-semibold text-black mb-6">Eligibility</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You must be at least 18 years old to use the Service. By agreeing to these Terms, you represent and warrant to us that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>You are at least 18 years old</li>
                      <li>You have not previously been suspended or removed from the Service</li>
                      <li>Your registration and use of the Service is in compliance with all applicable laws and regulations</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      If you are an entity, organization, or company, the individual accepting these Terms on your behalf represents 
                      and warrants that they have authority to bind you to these Terms and you agree to be bound by these Terms.
                    </p>
                  </div>
                </section>

                {/* Payment Terms */}
                <section id="payment">
                  <h2 className="text-2xl font-semibold text-black mb-6">General Payment Terms</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Certain features of the Service may require you to pay fees. Before you pay any fees, you will have an 
                      opportunity to review and accept the fees that you will be charged. Unless otherwise specifically provided 
                      for in these Terms, all fees are in AED and are non-refundable, except as required by law.
                    </p>
                    <h3 className="text-lg font-semibold text-black mt-6 mb-3">Price</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Hornbill reserves the right to determine pricing for the Service. We will make reasonable efforts to keep 
                      pricing information published on the Service up to date. Prices displayed may not include applicable taxes, 
                      customs duties, or shipping charges which will be shown during checkout.
                    </p>
                  </div>
                </section>

                {/* Delivery */}
                <section id="delivery">
                  <h2 className="text-2xl font-semibold text-black mb-6">Delivery and Returns</h2>
                  <div className="prose prose-gray max-w-none">
                    <h3 className="text-lg font-semibold text-black mb-3">Delivery</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Products ordered through our website will be delivered to the address specified at checkout within the UAE. 
                      Hornbill is not responsible for delayed, lost, or stolen packages after they have been handed over to the 
                      shipping carrier.
                    </p>
                    <h3 className="text-lg font-semibold text-black mb-3">Returns</h3>
                    <p className="text-gray-700 leading-relaxed">
                      You have the option of returning Products for a refund or exchange within thirty (30) days after purchase. 
                      To initiate a return, you must contact us at hello@hornbillworkpod.com. Products must be in original 
                      condition with all packaging and accessories.
                    </p>
                  </div>
                </section>

                {/* Continue with other sections... */}
                <section id="licenses">
                  <h2 className="text-2xl font-semibold text-black mb-6">Licenses</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Subject to your complete and ongoing compliance with these Terms, Hornbill grants you a limited, 
                      non-exclusive, non-transferable license to use our Products and Software for personal or business use 
                      in accordance with the provided documentation.
                    </p>
                  </div>
                </section>

                <section id="ownership">
                  <h2 className="text-2xl font-semibold text-black mb-6">Ownership; Proprietary Rights</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      The Service, Software, and Products are owned and operated by Hornbill. All intellectual property rights 
                      in the Service, Software, and Products are protected by applicable laws. When you purchase a Product, 
                      you acquire only the physical item and a license to use associated Software.
                    </p>
                  </div>
                </section>

                <section id="third-party">
                  <h2 className="text-2xl font-semibold text-black mb-6">Third-Party Terms</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Our Products may integrate with third-party services and platforms. Your use of such third-party services 
                      is subject to their respective terms and conditions, which we encourage you to review.
                    </p>
                  </div>
                </section>

                <section id="communications">
                  <h2 className="text-2xl font-semibold text-black mb-6">Communications</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      By using our Service, you consent to receiving electronic communications from us, including order 
                      confirmations, shipping notifications, and important service updates.
                    </p>
                  </div>
                </section>

                <section id="conduct">
                  <h2 className="text-2xl font-semibold text-black mb-6">Prohibited Conduct</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      You may not use our Service for any unlawful purpose or in any way that could damage, disable, 
                      or impair our Service or interfere with others' use of the Service.
                    </p>
                  </div>
                </section>

                <section id="modification">
                  <h2 className="text-2xl font-semibold text-black mb-6">Modification of Terms</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      We may modify these Terms from time to time. We will notify you of material changes by posting 
                      the updated Terms on our website with a new "Last Updated" date.
                    </p>
                  </div>
                </section>

                <section id="termination">
                  <h2 className="text-2xl font-semibold text-black mb-6">Term & Termination</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      These Terms remain in effect until terminated. We may terminate or suspend your access to our 
                      Service at any time for violation of these Terms.
                    </p>
                  </div>
                </section>

                <section id="indemnity">
                  <h2 className="text-2xl font-semibold text-black mb-6">Indemnity</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      You agree to indemnify and hold harmless Hornbill from any claims arising from your use of our 
                      Service or violation of these Terms.
                    </p>
                  </div>
                </section>

                <section id="disclaimers">
                  <h2 className="text-2xl font-semibold text-black mb-6">Disclaimers; No Warranties</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Our Service and Products are provided "as is" without warranties of any kind, either express or implied, 
                      except as required by applicable law.
                    </p>
                  </div>
                </section>

                <section id="liability">
                  <h2 className="text-2xl font-semibold text-black mb-6">Limitation of Liability</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      To the maximum extent permitted by law, Hornbill shall not be liable for any indirect, incidental, 
                      or consequential damages arising from your use of our Service or Products.
                    </p>
                  </div>
                </section>

                <section id="disputes">
                  <h2 className="text-2xl font-semibold text-black mb-6">Dispute Resolution</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Any disputes arising under these Terms will be resolved through binding arbitration in accordance 
                      with the laws of the United Arab Emirates.
                    </p>
                  </div>
                </section>

                <section id="miscellaneous">
                  <h2 className="text-2xl font-semibold text-black mb-6">Miscellaneous</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      These Terms constitute the entire agreement between you and Hornbill regarding the Service. 
                      If any provision is found unenforceable, the remaining provisions will remain in effect.
                    </p>
                    <h3 className="text-lg font-semibold text-black mt-6 mb-3">Contact Information</h3>
                    <p className="text-gray-700 leading-relaxed">
                      The Service is offered by Hornbill Workspaces Pvt. Ltd., located at Jebel Ali Building Warehouse no#2, 
                      Al Quoz 3 Near Mashreq Bank - Sheikh Zayed Rd - Dubai, UAE. You may contact us at hello@hornbillworkpod.com.
                    </p>
                  </div>
                </section>

              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <section className="bg-black text-white py-32">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[800px]">
            
            {/* Press Link */}
            <Link to="/press" className="group relative border-b md:border-b-0 md:border-r border-gray-800 transition-colors duration-300 flex flex-col">
              <div className="flex-1 flex flex-col p-8 lg:p-12">
                <div className="flex-1 flex items-start">
                  <h2 className="text-9xl lg:text-[12rem] leading-none font-normal text-[#949494] transition-colors duration-300 group-hover:text-white">Press</h2>
                </div>
                <div className="mt-auto">
                  <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">Our beautiful</p>
                  <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">product in action</p>
                </div>
              </div>
            </Link>

            {/* About Link */}
            <Link to="/about" className="group relative transition-colors duration-300 flex flex-col">
              <div className="flex-1 flex flex-col p-8 lg:p-12">
                <div className="flex-1 flex items-start">
                  <h2 className="text-9xl lg:text-[12rem] leading-none font-normal text-[#949494] transition-colors duration-300 group-hover:text-white">About</h2>
                </div>
                <div className="mt-auto">
                  <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">Our Mission and</p>
                  <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">core beliefs</p>
                </div>
              </div>
            </Link>

          </div>
          <div className="w-full h-px bg-gray-800 mx-4 sm:mx-6 lg:mx-8"></div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default TermsPage 