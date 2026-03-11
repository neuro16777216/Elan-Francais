import React, { useState } from 'react';
import { PenTool, Send, Loader2, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { getWritingFeedback } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { getProgress, updateProgress } from '../utils/progress';

const PROMPTS = [
  "Écrivez une lettre formelle au maire de votre ville pour protester contre la fermeture d'un parc public.",
  "Rédigez un essai argumenté sur les avantages et les inconvénients du télétravail.",
  "Vous participez à un forum sur l'avenir de la langue française. Donnez votre opinion sur l'usage des anglicismes.",
  "Écrivez un article pour un journal étudiant sur l'importance de l'engagement citoyen chez les jeunes."
];

export const Writing: React.FC = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(PROMPTS[0]);

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await getWritingFeedback(text);
      setFeedback(result || "Erreur lors de l'analyse.");
      if (result) {
        updateProgress({ essaysWritten: getProgress().essaysWritten + 1 });
      }
    } catch (error) {
      console.error(error);
      setFeedback("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <PenTool className="text-[#5A5A40]" /> Production Écrite
        </h3>
        
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Sujet d'entraînement</label>
          <select 
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 mb-4"
          >
            {PROMPTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="p-4 bg-[#f5f2ed] rounded-xl italic text-sm text-gray-700">
            "{selectedPrompt}"
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Rédigez votre texte ici (minimum 150 mots recommandés pour le B2)..."
          className="w-full h-64 p-4 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 resize-none mb-4 font-serif text-lg"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !text.trim()}
          className="w-full py-3 bg-[#5A5A40] text-white rounded-xl font-medium hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          Obtenir une correction détaillée
        </button>
      </div>

      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-2 mb-6 text-[#5A5A40]">
              <CheckCircle2 size={24} />
              <h4 className="font-serif text-2xl font-semibold">Analyse de l'expert</h4>
            </div>
            <div className="markdown-body">
              <Markdown>{feedback}</Markdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
