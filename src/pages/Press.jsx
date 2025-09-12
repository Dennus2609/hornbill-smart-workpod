import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { useEffect, useRef, useState } from 'react';

const newsArticles = [
  {
    date: 'October 11, 2024',
    title: 'Hornbill Showcases at GITEX 2024',
    description: 'Hornbill made its international debut at GITEX Global 2024 in Dubai, showcasing the Smart Work Pod. The booth featured live demos of the pod’s innovative features, attracting attention from global tech media and investors.',
    image: '/images/h1.HEIC',
    link: '#',
  },
  {
    date: 'October 11, 2024',
    title: 'Hornbill Wins Red Dot Design Award',
    description: 'The Hornbill Smart Work Pod received the prestigious Red Dot Award for Product Design. Recognized for its fusion of ergonomics, style, and smart technology, the pod sets a new benchmark for modern workspaces.',
    image: '/images/h2.HEIC',
    link: '#',
  },
  {
    date: 'January 18, 2025',
    title: 'Hornbill Raises $9M to Scale Smart Pods',
    description: 'Hornbill closed a $9 million seed funding round led by FutureCraft Capital. The funds will help expand manufacturing and develop new software features, including AI-driven productivity tracking and smarter home-office integration.',
    image: '/images/h3.jpg',
    link: '#',
  },
];

const PressPage = () => {
    const articleRefs = useRef([]);
    const [visibleArticles, setVisibleArticles] = useState(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleArticles((prev) => new Set(prev).add(entry.target.dataset.index));
                    }
                });
            },
            { threshold: 0.2 }
        );

        articleRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            articleRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    return (
        <div className="bg-black text-white" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>
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
            <section className="bg-black text-white pt-24 pb-16">
              <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-6xl lg:text-7xl font-normal mb-6 leading-tight">
                  Newsroom
                </h1>
                <p className="text-xl text-gray-400 max-w-lg">
                  New and noteworthy updates from the Hornbill team.
                </p>
                <div className="w-full h-px bg-gray-700 mt-16"></div>
              </div>
            </section>

            {/* News Articles Section */}
            <section className="py-16">
              <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-20">
                  {newsArticles.map((article, index) => (
                    <div
                      key={index}
                      ref={(el) => (articleRefs.current[index] = el)}
                      data-index={index}
                      className={`grid grid-cols-1 lg:grid-cols-5 gap-12 items-end transition-all duration-700 ease-out ${
                        visibleArticles.has(String(index)) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <Link to={article.link} className="group lg:col-span-3 w-full h-[400px] lg:h-[600px] overflow-hidden rounded-2xl block">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover filter grayscale group-hover:filter-none group-hover:scale-105 transition-all duration-500" />
                      </Link>
                      <div className="lg:col-span-2 flex flex-col">
                        <p className="text-sm text-gray-400 mb-4">{article.date}</p>
                        <h2 className="text-4xl lg:text-5xl font-medium leading-tight mb-6">{article.title}</h2>
                        <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">{article.description}</p>
                        <div className="flex">
                           <Link
                            to={article.link}
                            className="group inline-flex items-center justify-center w-20 h-8 bg-white rounded-full transition-all duration-300 hover:bg-gradient-to-r from-[#DD2C00] to-[#FEC300] hover:w-24"
                          >
                            <ArrowRight className="text-black transition-all duration-300 group-hover:text-white group-hover:translate-x-1" size={20} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Links Section */}
            <section className="bg-black text-white py-32">
              <div className="max-w-screen-xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[800px]">
                  
                  <Link to="/" className="group relative border-b md:border-b-0 md:border-r border-gray-800 transition-colors duration-300 flex flex-col">
                    <div className="flex-1 flex flex-col p-8 lg:p-12">
                      <div className="flex-1 flex items-start">
                        <h2 className="text-9xl lg:text-[12rem] leading-none font-normal text-[#949494] transition-colors duration-300 group-hover:text-white">Home</h2>
                      </div>
                      <div className="mt-auto">
                        <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">Our beautiful</p>
                        <p className="text-gray-400 text-base transition-colors duration-300 group-hover:text-white">product in action</p>
                      </div>
                    </div>
                  </Link>

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
    );
};

export default PressPage; 