import React, { useState, useEffect } from 'react';
import { Hash, Star, CheckCircle2 } from 'lucide-react';
import { getProgress, updateProgress } from '../utils/progress';

const VOCAB_DATA = [
  { word: "Néanmoins", definition: "Pourtant, toutefois. Marque une opposition.", example: "Il est intelligent, néanmoins il manque de rigueur.", level: "B2" },
  { word: "S'avérer", definition: "Se révéler être vrai, se manifester comme.", example: "Cette hypothèse s'est avérée exacte.", level: "B2" },
  { word: "D'ores et déjà", definition: "Dès maintenant, dès ce moment.", example: "Nous pouvons d'ores et déjà confirmer sa présence.", level: "C1" },
  { word: "Pérenniser", definition: "Rendre durable, éternel.", example: "L'objectif est de pérenniser ces acquis sociaux.", level: "C1" },
  { word: "En amont", definition: "Préalablement, avant une étape donnée.", example: "Il faut préparer le dossier bien en amont.", level: "B2" },
  { word: "Paradoxalement", definition: "D'une manière contraire à l'opinion commune.", example: "Paradoxalement, moins il travaille, mieux il réussit.", level: "B2" },
  { word: "Nonobstant", definition: "Malgré, sans être empêché par.", example: "Nonobstant les difficultés, il a terminé son projet.", level: "C1" },
  { word: "Inhérent", definition: "Qui est lié d'une manière intime et nécessaire à quelque chose.", example: "C'est un risque inhérent à toute activité humaine.", level: "C1" },
];

export const Vocabulary: React.FC = () => {
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('elan_learned_words');
    if (saved) {
      setLearnedWords(JSON.parse(saved));
    }
  }, []);

  const toggleLearned = (word: string) => {
    const newLearned = learnedWords.includes(word)
      ? learnedWords.filter(w => w !== word)
      : [...learnedWords, word];
    
    setLearnedWords(newLearned);
    localStorage.setItem('elan_learned_words', JSON.stringify(newLearned));
    
    // Update global progress count
    updateProgress({ wordsLearned: newLearned.length });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <Hash className="text-[#5A5A40]" /> Vocabulaire & Connecteurs
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Maîtriser ces mots est essentiel pour structurer votre pensée au niveau B2/C1.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VOCAB_DATA.map((item, i) => {
            const isLearned = learnedWords.includes(item.word);
            return (
              <div 
                key={i} 
                onClick={() => toggleLearned(item.word)}
                className={`p-4 rounded-xl border transition-all group cursor-pointer ${
                  isLearned 
                  ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                  : 'border-black/5 bg-gray-50/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-xl font-bold text-[#1a1a1a]">{item.word}</h4>
                    {isLearned && <CheckCircle2 size={16} className="text-emerald-500" />}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    item.level === 'C1' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.definition}</p>
                <div className="p-2 bg-white rounded-lg border border-black/5 italic text-xs text-gray-500">
                  "{item.example}"
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#5A5A40] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-serif text-2xl font-bold mb-2 flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={24} /> Conseil du jour
          </h3>
          <p className="text-lg opacity-90 leading-relaxed italic">
            "Pour le niveau C1, ne vous contentez pas de 'Je pense que'. Utilisez des structures comme 'Il me semble opportun de souligner que...' ou 'Je suis intimement convaincu que...' pour nuancer votre propos."
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Hash size={200} />
        </div>
      </div>
    </div>
  );
};
