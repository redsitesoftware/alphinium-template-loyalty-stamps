import React, { createContext, useContext, useReducer } from 'react';

export const BUSINESSES = [
  { id: 'b1', name: 'Brew & Bean Coffee', emoji: '☕', category: 'Café', color: '#92400E', accent: '#D97706', stampsNeeded: 10, reward: 'Free coffee of your choice', stampEmoji: '☕', description: 'Artisan coffee roasted fresh daily', totalCustomers: 2840, redemptions: 412 },
  { id: 'b2', name: 'The Golden Scissors', emoji: '✂️', category: 'Salon', color: '#7C3AED', accent: '#A78BFA', stampsNeeded: 8, reward: '20% off your next service', stampEmoji: '✂️', description: 'Premium hair & beauty salon', totalCustomers: 1203, redemptions: 187 },
  { id: 'b3', name: 'FitZone Gym', emoji: '🏋️', category: 'Fitness', color: '#DC2626', accent: '#F87171', stampsNeeded: 12, reward: 'Free personal training session', stampEmoji: '⚡', description: '24/7 gym with classes & PT', totalCustomers: 3102, redemptions: 289 },
  { id: 'b4', name: 'Sakura Sushi', emoji: '🍣', category: 'Restaurant', color: '#BE185D', accent: '#F472B6', stampsNeeded: 10, reward: 'Free dessert platter', stampEmoji: '🍣', description: 'Authentic Japanese cuisine', totalCustomers: 1876, redemptions: 341 },
  { id: 'b5', name: 'Pages & Prose', emoji: '📚', category: 'Retail', color: '#065F46', accent: '#34D399', stampsNeeded: 6, reward: '$10 store credit', stampEmoji: '📖', description: 'Independent bookshop & café', totalCustomers: 987, redemptions: 203 },
];

const initialStamps = {
  b1: 7,
  b2: 3,
  b3: 0,
  b4: 10,  // ready to redeem!
  b5: 5,
};

const initialState = {
  phase: 'home',   // home | card | scan | redeem | history
  selectedBusiness: null,
  stamps: initialStamps,
  redeemed: ['b4'],  // already redeemed once before
  history: [
    { id: 'h1', bizId: 'b1', type: 'stamp', date: '2026-05-28', note: 'Flat white' },
    { id: 'h2', bizId: 'b4', type: 'stamp', date: '2026-05-27', note: 'Visit #10' },
    { id: 'h3', bizId: 'b2', type: 'stamp', date: '2026-05-26', note: 'Trim & colour' },
    { id: 'h4', bizId: 'b4', type: 'redeem', date: '2026-05-20', note: 'Free dessert redeemed!' },
  ],
  scanning: false,
  scanSuccess: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'VIEW_CARD':
      return { ...state, phase: 'card', selectedBusiness: action.bizId };
    case 'GO_SCAN':
      return { ...state, phase: 'scan', scanning: false, scanSuccess: false };
    case 'START_SCAN':
      return { ...state, scanning: true };
    case 'SCAN_SUCCESS': {
      const biz = action.bizId;
      const cur = state.stamps[biz] || 0;
      const b = BUSINESSES.find(b => b.id === biz);
      const newStamps = Math.min(cur + 1, b.stampsNeeded);
      return {
        ...state,
        scanning: false,
        scanSuccess: true,
        stamps: { ...state.stamps, [biz]: newStamps },
        history: [
          { id: Date.now().toString(), bizId: biz, type: 'stamp', date: new Date().toISOString().split('T')[0], note: 'Stamp added' },
          ...state.history,
        ],
      };
    }
    case 'REDEEM': {
      const biz = action.bizId;
      return {
        ...state,
        stamps: { ...state.stamps, [biz]: 0 },
        redeemed: [...state.redeemed, biz + '_' + Date.now()],
        history: [
          { id: Date.now().toString(), bizId: biz, type: 'redeem', date: new Date().toISOString().split('T')[0], note: 'Reward redeemed!' },
          ...state.history,
        ],
        phase: 'home',
      };
    }
    case 'GO_HISTORY': return { ...state, phase: 'history' };
    case 'BACK': return { ...state, phase: 'home', selectedBusiness: null, scanSuccess: false };
    default: return state;
  }
}

const StoreCtx = createContext(null);
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}
export const useStore = () => useContext(StoreCtx);
