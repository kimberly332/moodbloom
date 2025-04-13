import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, username, nickname) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name (nickname)
      await updateProfile(userCredential.user, {
        displayName: nickname
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        username,
        nickname,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  // Logout function
  function logout() {
    return signOut(auth);
  }
  
  // Reset password function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  
  // Update profile function
  async function updateUserProfile(displayName) {
    try {
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: displayName
        });
        
        // Update user data in Firestore
        await setDoc(doc(db, "users", currentUser.uid), {
          nickname: displayName,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}