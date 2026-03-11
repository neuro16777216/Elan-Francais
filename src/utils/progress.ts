interface ProgressData {
  messagesSent: number;
  pronunciationPractices: number;
  articlesRead: number;
  essaysWritten: number;
  wordsLearned: number;
  streak: number;
  lastActivityDate: string | null;
  dailyHistory: { [date: string]: number };
}

const DEFAULT_PROGRESS: ProgressData = {
  messagesSent: 0,
  pronunciationPractices: 0,
  articlesRead: 0,
  essaysWritten: 0,
  wordsLearned: 0,
  streak: 0,
  lastActivityDate: null,
  dailyHistory: {}
};

export const getProgress = (): ProgressData => {
  const saved = localStorage.getItem('elan_progress');
  if (!saved) return DEFAULT_PROGRESS;
  return JSON.parse(saved);
};

export const updateProgress = (updates: Partial<ProgressData>) => {
  const current = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  const newData = { ...current, ...updates };
  
  // Update daily history
  const dailyHistory = { ...current.dailyHistory };
  dailyHistory[today] = (dailyHistory[today] || 0) + 1;
  newData.dailyHistory = dailyHistory;

  // Update streak
  if (current.lastActivityDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (current.lastActivityDate === yesterdayStr) {
      newData.streak = current.streak + 1;
    } else if (current.lastActivityDate === null) {
      newData.streak = 1;
    } else {
      // If last activity was before yesterday, reset streak (or keep if it's today)
      newData.streak = 1;
    }
    newData.lastActivityDate = today;
  }

  localStorage.setItem('elan_progress', JSON.stringify(newData));
  
  // Dispatch a custom event so components can react if needed
  window.dispatchEvent(new Event('progress_updated'));
};
