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
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('sw_token', token);
      const { data } = await authAPI.syncUser();
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Failed to sync with backend' };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      // Firebase doesn't take name in createUserWithEmailAndPassword directly.
      // But our backend syncUser will extract email prefix if name isn't there, 
      // or we can just let it create the Firebase user and backend will sync.
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name if needed
      // import { updateProfile } from 'firebase/auth';
      // await updateProfile(userCredential.user, { displayName: name });

      const token = await userCredential.user.getIdToken();
      localStorage.setItem('sw_token', token);
      
      const { data } = await authAPI.syncUser();
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Failed to sync with backend' };
    } catch (err) {
      return { success: false, message: err.message };
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
