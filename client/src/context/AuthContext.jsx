import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('sw_token', token);
          // Sync with backend to get MongoDB profile
          const { data } = await authAPI.syncUser();
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('sw_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.error("Failed to sync user with backend", err);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem('sw_token');
        localStorage.removeItem('sw_user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('sw_token', token);
      
      try {
        const { data } = await authAPI.syncUser();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('sw_user', JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      } catch (syncErr) {
        // Backend sync failed (e.g. server down), but Firebase auth succeeded.
        // Fall back to Firebase profile so user is still logged in.
        console.warn('Backend sync failed, using Firebase profile:', syncErr.message);
        const fallbackUser = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || '',
        };
        setUser(fallbackUser);
        localStorage.setItem('sw_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser };
      }
      
      return { success: false, message: 'Failed to sync with backend' };
    } catch (err) {
      // Convert Firebase error codes to friendly messages
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? 'Invalid email or password. Please try again.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : err.message;
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('sw_token', token);
      
      try {
        const { data } = await authAPI.syncUser();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('sw_user', JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      } catch (syncErr) {
        // Fallback to Firebase profile if backend is unreachable
        console.warn('Backend sync failed on register, using Firebase profile:', syncErr.message);
        const fallbackUser = {
          name: name || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || '',
        };
        setUser(fallbackUser);
        localStorage.setItem('sw_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser };
      }

      return { success: false, message: 'Failed to sync with backend' };
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists. Try signing in.'
        : err.code === 'auth/weak-password'
        ? 'Password must be at least 6 characters.'
        : err.message;
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('sw_token');
      localStorage.removeItem('sw_user');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await authAPI.updateProfile(updates);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('sw_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Failed to update' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
