import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const AboutPage = () => {
    return (
        <div className="bg-black text-white" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <header className="bg-black text-white py-6">
              <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="text-2xl font-medium hover:opacity-80 transition-opacity">
                  Hornbill
                </Link>
                <div className="flex items-center gap-4">
                  <div className="relative inline-block gemini-border-container">
                    <Link
                      to="/book"
                      className="relative text-white px-5 py-2.5 rounded-full text-sm font-normal transition-all duration-200 hover:scale-105 bg-black z-10 inline-block"
                    >
                      Order now
                    </Link>
                  </div>
                  <img
                    src="/images/HORNBILL-LOGO.png"
                    alt="Hornbill logo"
                    className="h-8 w-auto select-none"
                    decoding="async"
                  />
                </div>
              </div>
            </header>
            <div className="w-full h-px bg-gray-800"></div>

            {/* Hero */}
            <main>
                <section className="relative min-h-[80vh] lg:min-h-screen flex items-end">
                    <img
                        src="/images/Generated Image September 12, 2025 - 8_19AM (1).png"
                        alt="Hornbill workspace pod under a focused spotlight"
                        className="absolute inset-0 w-full h-full object-cover"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                        <h1 className="text-4xl lg:text-6xl font-normal leading-tight max-w-3xl">
                            Designed for deep work. Built for beautiful homes.
                        </h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
                            Hornbill creates calm, high-performance spaces that help you focus, think,
                            and feel good in the place you live.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <div className="relative inline-block gemini-border-container">
                                <Link
                                  to="/book"
                                  className="relative text-white px-6 py-3 rounded-full text-base font-normal transition-all duration-200 hover:scale-105 bg-black z-10 inline-block"
                                >
                                  Order now
                                </Link>
                            </div>
                            <Link to="/contact" className="text-white/80 hover:text-white underline underline-offset-4">
                                Talk to us
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="bg-black text-white py-24">
                  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                      <h2 className="text-3xl lg:text-4xl font-normal">Have a question? Let’s make your space work better.</h2>
                      <p className="mt-4 text-gray-300 text-lg">
                        Whether you’re outfitting a home office or planning for a team, we’ll help you
                        choose the right configuration and timeline—no sales fluff, just honest guidance.
                      </p>
                      <div className="mt-8 flex items-center gap-3">
                        <div className="relative inline-block gemini-border-container">
                          <Link
                            to="/contact"
                            className="relative text-white px-6 py-3 rounded-full text-base font-normal transition-all duration-200 hover:scale-105 bg-black z-10 inline-block"
                          >
                            Contact us
                          </Link>
                        </div>
                        <Link to="/book" className="text-white/80 hover:text-white underline underline-offset-4">Or order now</Link>
                      </div>
                    </div>
                  </div>
                </section>
            </main>
            
            {/* Links Section */}
            <section className="bg-black text-white py-32">
              <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[800px]">
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
                  <Link to="/" className="group relative transition-colors duration-300 flex flex-col">
                    <div className="flex-1 flex flex-col p-8 lg:p-12">
                      <div className="flex-1 flex items-start">
                        <h2 className="text-9xl lg:text-[12rem] leading-none font-normal text-[#949494] transition-colors duration-300 group-hover:text-white">Home</h2>
                      </div>
                      <div className="mt-auto">
                        <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">Back to where</p>
                        <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">it all started</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="w-full h-px bg-gray-800"></div>
              </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage; 