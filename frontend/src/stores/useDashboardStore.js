import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  selectedIndex: 'NIFTY 50',
  setSelectedIndex: (index) => set({ selectedIndex: index }),
  
  timeframe: '5m',
  setTimeframe: (tf) => set({ timeframe: tf }),
  
  studies: ['EMA 20/50', 'VOL PROF'],
  toggleStudy: (study) => set((state) => ({
    studies: state.studies.includes(study) 
      ? state.studies.filter(s => s !== study)
      : [...state.studies, study]
  })),
}));
