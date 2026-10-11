import { create } from 'zustand';

export const CONSTITUENT_TABS = {
  TOP_GAINERS: 'Top Gainers',
  TOP_LOSERS: 'Top Losers',
  VOL_SHOCKERS: 'Vol Shockers'
};

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

  // Constituent Impact Active Filter Tab
  activeConstituentTab: CONSTITUENT_TABS.TOP_GAINERS,
  setActiveConstituentTab: (tab) => set({ activeConstituentTab: tab })
}));
