import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  activeTab: 'quick',
  setActiveTab: (tab) => set({ activeTab: tab }),
  operatingAccount: 'paper',
  setOperatingAccount: (account) => set({ operatingAccount: account }),
  oneClickExecution: false,
  setOneClickExecution: (value) => set({ oneClickExecution: value }),
}));
