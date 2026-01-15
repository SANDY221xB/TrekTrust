
import { AppState, User, Trek, Company, Verification, Review } from '../types';
import { INITIAL_TREKS, INITIAL_COMPANIES, INITIAL_ADMIN, INITIAL_USER } from '../constants';

const DB_KEY = 'trektrust_db';

export const db = {
  get: (): AppState => {
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
  },

  save: (state: AppState) => {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
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
