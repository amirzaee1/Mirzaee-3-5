
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import DashboardScreen from './pages/DashboardScreen';
import LearnExerciseScreen from './pages/LearnExerciseScreen';
import DailyExerciseScreen from './pages/DailyExerciseScreen';
import MemoriesScreen from './pages/MemoriesScreen';
import AnalysisScreen from './pages/AnalysisScreen';
import AboutScreen from './pages/AboutScreen';
import ChatScreen from './pages/ChatScreen'; // Import ChatScreen
import { Home, BookOpen, Edit3, BarChart2, Info, MessageCircle, Settings, Moon } from 'lucide-react'; // Added MessageCircle, Settings, Moon
import ParticleBackground from './components/ParticleBackground';
import { AppProvider } from './context/AppContext';

const navItems = [
  { path: '/', label: 'خانه', icon: Home },
  { path: '/learn', label: 'آموزش', icon: BookOpen },
  { path: '/practice', label: 'تمرین روزانه', icon: Edit3 },
  { path: '/memories', label: 'خاطرات جذب', icon: MessageCircle }, // Icon changed for demo, Sparkles was used
  { path: '/analysis', label: 'تحلیل ارتعاش', icon: BarChart2 },
  { path: '/chat', label: 'چت با AI', icon: MessageCircle }, // New Nav Item
  { path: '/about', label: 'درباره', icon: Info },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (location.pathname === '/splash') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 relative overflow-hidden">
      <ParticleBackground count={20} />
      <header className="bg-black bg-opacity-50 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-estedad gold-text">
            ۳×۵ <span className="text-sm font-vazir text-purple-400">| معجزه‌ی جذب آگاهانه</span>
          </Link>
          <nav className="hidden md:flex space-x-reverse space-x-4 items-center">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                            ${location.pathname === item.path 
                              ? 'bg-purple-600 text-white shadow-md' 
                              : 'text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-sm'}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-xl p-5 z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
            >
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="text-gray-300 hover:text-white absolute top-4 left-4"
              aria-label="Close sidebar"
            >
              <Moon size={24} /> {/* Using Moon as a close icon example */}
            </button>
            <div className="mt-10 flex flex-col space-y-3">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 ease-in-out
                              ${location.pathname === item.path 
                                ? 'bg-purple-600 text-white shadow-md' 
                                : 'text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-sm'}`}
                >
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
      <footer className="bg-black bg-opacity-30 text-center py-4 text-sm text-gray-400">
        قدرت در دستان توست. با عشق، امیر میرزایی.
      </footer>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/learn" element={<LearnExerciseScreen />} />
            <Route path="/practice" element={<DailyExerciseScreen />} />
            <Route path="/memories" element={<MemoriesScreen />} />
            <Route path="/analysis" element={<AnalysisScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/chat" element={<ChatScreen />} /> {/* Add ChatScreen Route */}
            <Route path="*" element={<DashboardScreen />} /> {/* Default route */}
          </Routes>
        </MainLayout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
