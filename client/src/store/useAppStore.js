import { create } from 'zustand';

/**
 * Global app store using Zustand.
 * Manages: compare list, UI state.
 */
export const useAppStore = create((set, get) => ({
  // ── Compare List ─────────────────────────────────────────────
  compareList: [],

  addToCompare: (product) => {
    const { compareList } = get();
    if (compareList.find(p => p.id === product.id)) return; // already added
    if (compareList.length >= 4) {
      // Remove oldest if at max capacity
      set({ compareList: [...compareList.slice(1), product] });
    } else {
      set({ compareList: [...compareList, product] });
    }
  },

  removeFromCompare: (productId) => {
    set(state => ({ compareList: state.compareList.filter(p => p.id !== productId) }));
  },

  clearCompare: () => set({ compareList: [] }),

  isInCompare: (productId) => get().compareList.some(p => p.id === productId),

  // ── Wishlist cache (to avoid repeated API calls) ──────────────
  wishlistIds: new Set(),

  setWishlistIds: (ids) => set({ wishlistIds: new Set(ids) }),

  addWishlistId: (id) => set(state => ({ wishlistIds: new Set([...state.wishlistIds, id]) })),

  removeWishlistId: (id) => set(state => {
    const next = new Set(state.wishlistIds);
    next.delete(id);
    return { wishlistIds: next };
  }),

  isWishlisted: (id) => get().wishlistIds.has(id),

  // ── Search state ─────────────────────────────────────────────
  lastSearchQuery: '',
  setLastSearchQuery: (q) => set({ lastSearchQuery: q }),
}));
