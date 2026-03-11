import React, { useState } from 'react';
import { BookOpen, Search, Loader2, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateReadingArticle } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { getProgress, updateProgress } from '../utils/progress';

const TOPICS = [
  "L'intelligence artificielle et l'emploi",
  "La transition écologique en France",
  "Le système éducatif français : défis et réformes",
  "L'influence de la gastronomie française dans le monde",
  "La laïcité dans la société moderne",
  "Le cinéma français contemporain"
];

export const Reading: React.FC = () => {
  const [level, setLevel] = useState<'B2' | 'C1'>('B2');
  const [article, setArticle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const content = await generateReadingArticle(selectedTopic, level);
      setArticle(content || "Erreur lors de la génération.");
      if (content) {
        updateProgress({ articlesRead: getProgress().articlesRead + 1 });
      }
    } catch (error) {
      console.error(error);
      setArticle("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="text-[#5A5A40]" /> Compréhension Écrite
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Sujet</label>
            <select 
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
            >
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Niveau visé</label>
            <div className="flex gap-2">
              {(['B2', 'C1'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 py-2 rounded-xl border transition-all ${
                    level === l 
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40]' 
                    : 'bg-white text-gray-600 border-black/10 hover:border-[#5A5A40]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 bg-[#5A5A40] text-white rounded-xl font-medium hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
          Générer un nouvel article
        </button>
      </div>

      <AnimatePresence mode="wait">
        {article && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-black/5"
          >
            <div className="markdown-body">
              <Markdown>{article}</Markdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
