import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  BookOpen, 
  PenTool, 
  Hash,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressData {
  messagesSent: number;
  pronunciationPractices: number;
  articlesRead: number;
  essaysWritten: number;
  wordsLearned: number;
  streak: number;
  lastActivityDate: string | null;
  dailyHistory: { [date: string]: number }; // date -> activity count
}

export const Progress: React.FC = () => {
  const [data, setData] = useState<ProgressData>({
    messagesSent: 0,
    pronunciationPractices: 0,
    articlesRead: 0,
    essaysWritten: 0,
    wordsLearned: 0,
    streak: 0,
    lastActivityDate: null,
    dailyHistory: {}
  });

  useEffect(() => {
    const saved = localStorage.getItem('elan_progress');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const stats = [
    { label: 'Messages', value: data.messagesSent, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Prononciation', value: data.pronunciationPractices, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Lectures', value: data.articlesRead, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Écrits', value: data.essaysWritten, icon: PenTool, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Vocabulaire', value: data.wordsLearned, icon: Hash, color: 'text-[#5A5A40]', bg: 'bg-[#f5f2ed]' },
    { label: 'Série (Jours)', value: data.streak, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  // Simple activity heatmap simulation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity Chart (Simplified) */}
      <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Activité Récente</h3>
            <p className="text-sm text-gray-400">Vos efforts des 7 derniers jours</p>
          </div>
          <TrendingUp className="text-[#5A5A40]" size={24} />
        </div>
        
        <div className="flex items-end justify-between h-32 gap-2">
          {last7Days.map((date) => {
            const activity = data.dailyHistory[date] || 0;
            const height = Math.min(100, (activity / 10) * 100); // Normalize to 10 activities per day
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#f5f2ed] rounded-t-lg relative h-full overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-[#5A5A40]"
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="p-8 rounded-3xl bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20">
        <div className="flex items-center gap-4 mb-6">
          <Award size={32} className="text-amber-300" />
          <h3 className="font-serif text-2xl font-bold">Objectifs de Maîtrise</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { label: 'Converser 10 fois', current: data.messagesSent, target: 10 },
            { label: 'Apprendre 50 mots', current: data.wordsLearned, target: 50 },
            { label: 'Lire 5 articles', current: data.articlesRead, target: 5 },
          ].map((goal) => (
            <div key={goal.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{goal.label}</span>
                <span className="text-white/70">{goal.current} / {goal.target}</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-300 transition-all duration-500" 
                  style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
