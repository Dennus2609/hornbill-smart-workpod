import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="bg-black text-white"
      style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}
    >
      {/* Full-width top divider */}
      <div className="w-full h-px bg-gray-800" />

      {/* Content container – reduced top/bottom padding */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8">
          {/* Column 1: Booking CTA */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-medium mb-3">Book yourself a hornbill</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              This is just to inform you that we do not use your information for anything.
            </p>
            <Link
              to="/book"
              className="group inline-flex items-center justify-center w-24 h-10 bg-white rounded-full transition-all duration-300 hover:bg-gradient-to-r from-[#DD2C00] to-[#FEC300] hover:w-28"
            >
              <ArrowRight
                className="text-black transition-colors duration-300 group-hover:text-white"
                size={20}
              />
            </Link>
          </div>

          {/* Vertical Divider for large screens */}
          <div className="hidden lg:block border-r border-gray-800" />

          <div className="grid grid-cols-2 gap-8">
            {/* Column 2: Company Links */}
            <div>
              <h4 className="text-gray-400 text-sm mb-4">Company</h4>
              <nav className="flex flex-col space-y-3">
                <Link to="/terms" className="text-white hover:text-gray-300 transition-colors">
                  Terms
                </Link>
                <Link to="/privacy" className="text-white hover:text-gray-300 transition-colors">
                  Privacy
                </Link>
              </nav>
            </div>

            {/* Column 3: Social Links */}
            <div>
              <h4 className="text-gray-400 text-sm mb-4">Social</h4>
              <nav className="flex flex-col space-y-3">
                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                  LinkedIn
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width bottom divider */}
      <div className="w-full h-px bg-gray-800" />

      {/* Bottom Bar – unchanged */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div
          className="
            max-w-screen-xl mx-auto
            flex flex-wrap items-center justify-center sm:justify-between
            gap-x-4 gap-y-2
            text-xs sm:text-sm text-gray-400
          "
        >
          <span>Hornbill&nbsp;|&nbsp;All&nbsp;Rights&nbsp;Reserved.</span>

          <div className="flex flex-wrap items-center justify-center gap-x-4">
            <a
              href="tel:04-3438005"
              className="hover:text-gray-200 transition-colors"
              aria-label="Call Hornbill"
            >
              04-3438005
            </a>
            <a
              href="mailto:connect@hornbillinc.com"
              className="hover:text-gray-200 transition-colors break-words"
              aria-label="Email Hornbill"
            >
              connect@hornbillinc.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
