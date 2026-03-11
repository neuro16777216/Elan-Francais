import React, { useState, useEffect } from 'react';
import { Chat } from './components/Chat';
import { Vocabulary } from './components/Vocabulary';
import { Reading } from './components/Reading';
import { Writing } from './components/Writing';
import { Progress } from './components/Progress';
import { getProgress } from './utils/progress';
import { 
  MessageSquare, 
  BookOpen, 
  PenTool, 
  Hash, 
  GraduationCap,
  ChevronRight,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'chat' | 'reading' | 'writing' | 'vocab' | 'progress';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState(getProgress());

  useEffect(() => {
    const handleUpdate = () => setStats(getProgress());
    window.addEventListener('progress_updated', handleUpdate);
    return () => window.removeEventListener('progress_updated', handleUpdate);
  }, []);

  // Calculate a mock level progress
  const totalActivity = stats.messagesSent + stats.articlesRead + stats.essaysWritten + (stats.wordsLearned / 5);
  const levelProgress = Math.min(100, 40 + (totalActivity * 2));
  const levelName = levelProgress > 80 ? 'DELF B2' : levelProgress > 60 ? 'DELF B1+' : 'DELF B1';

  const tabs = [
    { id: 'chat', label: 'Conversation', icon: MessageSquare, description: 'Pratiquez avec notre IA' },
    { id: 'reading', label: 'Lecture', icon: BookOpen, description: 'Articles B2/C1 sur mesure' },
    { id: 'writing', label: 'Écriture', icon: PenTool, description: 'Feedback expert instantané' },
    { id: 'vocab', label: 'Vocabulaire', icon: Hash, description: 'Connecteurs et expressions' },
    { id: 'progress', label: 'Progrès', icon: TrendingUp, description: 'Suivez votre évolution' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-black/5 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white shadow-lg shadow-[#5A5A40]/20">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">Élan Français</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]">Maîtrise B2 / C1</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  setIsMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl transition-all group
                  ${activeTab === tab.id 
                    ? 'bg-[#5A5A40] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]'}
                `}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-[#5A5A40]'} />
                <div className="text-left">
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className={`text-[10px] ${activeTab === tab.id ? 'text-white/70' : 'text-gray-400'}`}>
                    {tab.description}
                  </div>
                </div>
                {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-black/5">
            <div className="p-4 rounded-2xl bg-[#f5f2ed] border border-black/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Niveau Actuel</span>
              </div>
              <div className="text-xl font-serif font-bold text-[#5A5A40]">{levelName}</div>
              <div className="mt-2 h-1 w-full bg-white rounded-full overflow-hidden">
                <div className="h-full bg-[#5A5A40] transition-all duration-1000" style={{ width: `${levelProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-black/5 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-[#5A5A40]" size={24} />
          <span className="font-serif font-bold text-xl">Élan Français</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#f5f2ed]/30 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 text-lg">
                {tabs.find(t => t.id === activeTab)?.description}
              </p>
            </motion.div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'chat' && <Chat />}
              {activeTab === 'reading' && <Reading />}
              {activeTab === 'writing' && <Writing />}
              {activeTab === 'vocab' && <Vocabulary />}
              {activeTab === 'progress' && <Progress />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}
