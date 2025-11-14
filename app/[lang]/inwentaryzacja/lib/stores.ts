import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PersonalNumbersStateType = {
  personalNumber1: string;
  personalNumber2: string;
  personalNumber3: string;
  name1: string;
  name2: string;
  name3: string;
  setPersonalNumber1: (personalNumber1: string, name: string) => void;
  setPersonalNumber2: (personalNumber2: string, name: string) => void;
  setPersonalNumber3: (personalNumber3: string, name: string) => void;
  getName: (identifier: string) => string;
  logout: () => void;
};

export const usePersonalNumberStore = create<PersonalNumbersStateType>()(
  persist(
    (set, get) => ({
      personalNumber1: '',
      personalNumber2: '',
      personalNumber3: '',
      name1: '',
      name2: '',
      name3: '',
      setPersonalNumber1: (personalNumber1, name) => set({ personalNumber1, name1: name }),
      setPersonalNumber2: (personalNumber2, name) => set({ personalNumber2, name2: name }),
      setPersonalNumber3: (personalNumber3, name) => set({ personalNumber3, name3: name }),
      getName: (identifier: string) => {
        const { personalNumber1, personalNumber2, personalNumber3, name1, name2, name3 } = get();
        if (identifier === personalNumber1) return name1;
        if (identifier === personalNumber2) return name2;
        if (identifier === personalNumber3) return name3;
        return identifier;
      },
      logout: () =>
        set({
          personalNumber1: '',
          personalNumber2: '',
          personalNumber3: '',
          name1: '',
          name2: '',
          name3: '',
        }),
    }),
    { name: 'personal-numbers' },
  ),
);

type CardStateType = {
  card: number;
  warehouse: string;
  sector: string;
  setCard: (card: number, warehouse: string, sector: string) => void;
};

export const useCardStore = create<CardStateType>((set) => ({
  card: 0,
  warehouse: '',
  sector: '',
  setCard: (card: number, warehouse: string, sector: string) =>
    set({ card, warehouse, sector }),
}));

type PositionStateType = {
  position: number;
  setPosition: (position: number) => void;
};

export const usePositionStore = create<PositionStateType>((set) => ({
  position: 0,
  setPosition: (position: number) => set({ position }),
}));
