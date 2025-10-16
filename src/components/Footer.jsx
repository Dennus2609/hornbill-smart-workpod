import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  
  return (
    <footer
      className="bg-black text-white relative overflow-hidden"
      style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
    >
      <div className="max-w-[1920px] mx-auto w-full px-6 sm:px-10 lg:px-16 pt-20 sm:pt-24 lg:pt-32 pb-8">
        {/* Massive Hornbill Typography - Balanced weight */}
        <div className="relative mb-12 sm:mb-14 -ml-1 overflow-hidden">
          <h2 
            className="text-white leading-[0.9] tracking-tight select-none"
            style={{
              fontSize: 'clamp(64px, 18vw, 320px)',
              letterSpacing: '-0.055em',
              fontWeight: 400,
              fontFamily: 'General Sans, Inter, system-ui, sans-serif',
              wordBreak: 'keep-all'
            }}
          >
            Hornbill
          </h2>
        </div>

        {/* Elegant gradient divider - clearly visible */}
        <div 
          className="w-full h-px mb-10 sm:mb-12 lg:mb-14" 
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0) 100%)' }} 
        />

        {/* Content Grid - more breathing room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: CTA - lighter weight */}
          <div className="lg:col-span-6">
            <h3 
              className="text-white text-lg sm:text-xl font-normal mb-4" 
              style={{ 
                letterSpacing: '-0.01em',
                fontWeight: 400
              }}
            >
              Book to experience Hornbill
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md" style={{ fontWeight: 300 }}>
              Experience the future of work. Schedule a demo and see how Hornbill Smart Workpod transforms your workspace.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-normal transition-all duration-300 hover:gap-3"
            >
              <span>Book a demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right: Link Columns - lighter, more spaced */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 relative">
              {/* Company */}
              <div className="relative">
                <h4 
                  className="text-gray-600 text-[10px] font-normal mb-5 uppercase tracking-[0.12em]"
                  style={{ fontWeight: 400 }}
                >
                  Company
                </h4>
                <nav className="flex flex-col space-y-3">
                  {isAboutPage ? (
                    <Link 
                      to="/" 
                      className="text-white text-sm font-light hover:text-gray-400 transition-colors"
                      style={{ fontWeight: 300 }}
                    >
                      Home
                    </Link>
                  ) : (
                    <Link 
                      to="/about" 
                      className="text-white text-sm font-light hover:text-gray-400 transition-colors"
                      style={{ fontWeight: 300 }}
                    >
                      About
                    </Link>
                  )}
                </nav>
                {/* Vertical divider */}
                <div className="hidden sm:block absolute top-0 -right-8 bottom-0 w-px bg-gray-800" />
              </div>

              {/* Contact */}
              <div className="relative">
                <h4 
                  className="text-gray-600 text-[10px] font-normal mb-5 uppercase tracking-[0.12em]"
                  style={{ fontWeight: 400 }}
                >
                  Contact
                </h4>
                <div className="flex flex-col space-y-3">
                  <a
                    href="tel:04-3438005"
                    className="text-white text-sm font-light hover:text-gray-400 transition-colors inline-flex items-center gap-2"
                    style={{ fontWeight: 300 }}
                  >
                    <Phone className="w-3.5 h-3.5 text-gray-600" strokeWidth={1.5} />
                    <span>04-3438005</span>
                  </a>
                  <a
                    href="mailto:connect@hornbillinc.com"
                    className="text-white text-sm font-light hover:text-gray-400 transition-colors inline-flex items-start gap-2"
                    style={{ fontWeight: 300 }}
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-600 mt-0.5" strokeWidth={1.5} />
                    <span className="break-words">connect@hornbillinc.com</span>
                  </a>
                </div>
                {/* Vertical divider */}
                <div className="hidden sm:block absolute top-0 -right-8 bottom-0 w-px bg-gray-800" />
              </div>

              {/* Social */}
              <div>
                <h4 
                  className="text-gray-600 text-[10px] font-normal mb-5 uppercase tracking-[0.12em]"
                  style={{ fontWeight: 400 }}
                >
                  Social
                </h4>
                <nav className="flex flex-col space-y-3">
                  <a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm font-light hover:text-gray-400 transition-colors"
                    style={{ fontWeight: 300 }}
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm font-light hover:text-gray-400 transition-colors"
                    style={{ fontWeight: 300 }}
                  >
                    LinkedIn
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - subtle border */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-8 border-t border-gray-800/60">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-[11px] font-light" style={{ fontWeight: 300 }}>
            © {new Date().getFullYear()} Hornbill Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <img 
              src="/images/HORNBILL-LOGO.png" 
              alt="Hornbill Logo" 
              className="w-3.5 h-3.5 opacity-30"
            />
            <span className="text-gray-600 text-[11px] font-light" style={{ fontWeight: 300 }}>
              Smart Workpod
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
