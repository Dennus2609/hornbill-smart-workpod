import { Link } from 'react-router-dom';

const NewsroomPage = () => {
    return (
        <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-8" style={{ fontFamily: 'General Sans, Inter, system-ui, sans-serif' }}>
            <h1 className="text-6xl font-medium mb-4">Newsroom</h1>
            <p className="text-xl text-gray-400 mb-8">This page is under construction.</p>
            <div className="relative inline-block gemini-border-container">
                <Link
                    to="/"
                    className="relative text-white px-6 py-3 rounded-full text-base font-normal transition-all duration-200 hover:scale-105 bg-black z-10 inline-block"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
};

export default NewsroomPage; 