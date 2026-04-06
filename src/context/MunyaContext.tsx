import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppMode, UserState, TrustedContact } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

interface MunyaContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  userState: UserState;
  updateUserState: (updates: Partial<UserState>) => void;
  triggerEmergency: () => void;
  resetEmergency: () => void;
  currentUser: User | null;
  isAuthReady: boolean;
}

const MunyaContext = createContext<MunyaContextType | undefined>(undefined);

const DEFAULT_USER_STATE: UserState = {
  isFirstLaunch: true,
  secretCode: '',
  camouflageType: 'calculator',
  isEmergencyActive: false,
  trustedContacts: []
};

export const MunyaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(AppMode.DECOY);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('munya_user_state');
    return saved ? JSON.parse(saved) : DEFAULT_USER_STATE;
  });

  // Gestion de l'Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Synchronisation Firestore du profil utilisateur
  useEffect(() => {
    if (!currentUser || !isAuthReady) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    
    // Écoute en temps réel du profil
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Optionnel: fusionner avec le state local si besoin
        console.log("Profil utilisateur chargé depuis Firestore", data);
      } else {
        // Créer le profil initial si inexistant
        const initialProfile = {
          userId: currentUser.uid,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        setDoc(userDocRef, initialProfile).catch(err => 
          handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`)
        );
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
    });

    return () => unsubscribe();
  }, [currentUser, isAuthReady]);

  useEffect(() => {
    localStorage.setItem('munya_user_state', JSON.stringify(userState));
    
    if (userState.isFirstLaunch) {
      setMode(AppMode.ONBOARDING);
    }
  }, [userState]);

  const updateUserState = (updates: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };

  const triggerEmergency = async () => {
    updateUserState({ isEmergencyActive: true });
    
    // Envoi de l'alerte à Firestore
    if (currentUser) {
      const alertRef = doc(db, 'support', `emergency_${Date.now()}`);
      try {
        await setDoc(alertRef, {
          anonymId: `anon_${currentUser.uid.slice(0, 8)}`,
          type: 'EMERGENCY_TRIGGER',
          timestamp: new Date().toISOString(),
          location: "GPS_MOCK_DATA" // Dans une vraie app, utiliser navigator.geolocation
        });
      } catch (err) {
        console.error("Erreur lors de l'envoi de l'alerte Firestore", err);
      }
    }

    if (window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
  };

  const resetEmergency = () => {
    updateUserState({ isEmergencyActive: false });
  };

  return (
    <MunyaContext.Provider value={{ 
      mode, setMode, userState, updateUserState, triggerEmergency, resetEmergency,
      currentUser, isAuthReady 
    }}>
      {children}
    </MunyaContext.Provider>
  );
};

export const useMunya = () => {
  const context = useContext(MunyaContext);
  if (!context) throw new Error('useMunya must be used within a MunyaProvider');
  return context;
};
