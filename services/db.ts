
import { AppState, Verification, Review } from '../types.ts';
import { INITIAL_TREKS, INITIAL_COMPANIES } from '../constants.tsx';

const DB_KEY = 'trektrust_db';

export const db = {
  get: (): AppState => {
    try {
      const data = localStorage.getItem(DB_KEY);
      if (!data) {
        const initialState: AppState = {
          currentUser: null,
          treks: INITIAL_TREKS,
          companies: INITIAL_COMPANIES,
          verifications: [],
          reviews: []
        };
        localStorage.setItem(DB_KEY, JSON.stringify(initialState));
        return initialState;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
      return {
        currentUser: null,
        treks: INITIAL_TREKS,
        companies: INITIAL_COMPANIES,
        verifications: [],
        reviews: []
      };
    }
  },

  save: (state: AppState) => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  },

  updateVerifications: (verifications: Verification[]) => {
    const state = db.get();
    state.verifications = verifications;
    db.save(state);
  },

  updateReviews: (reviews: Review[]) => {
    const state = db.get();
    state.reviews = reviews;
    db.save(state);
  }
};
