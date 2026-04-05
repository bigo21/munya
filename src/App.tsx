import React from 'react';
import { MunyaProvider, useMunya } from './context/MunyaContext';
import { AppMode } from './types';
import { Calculator } from './components/Calculator';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

/**
 * Composant principal de l'application MUNYA.
 * Gère l'affichage selon le mode (Leurre, Onboarding, Caché).
 */
const AppContent: React.FC = () => {
  const { mode, userState, resetEmergency } = useMunya();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {mode === AppMode.ONBOARDING && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Onboarding />
          </motion.div>
        )}
        
        {mode === AppMode.DECOY && (
          <motion.div key="decoy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Calculator />
          </motion.div>
        )}

        {mode === AppMode.HIDDEN && (
          <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay d'Urgence (Invisible ou discret) */}
      <AnimatePresence>
        {userState.isEmergencyActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-24 h-24 bg-wisdom-amber text-white rounded-full flex items-center justify-center mb-8 animate-pulse">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <h2 className="text-white text-3xl mb-4">Alerte en cours...</h2>
            <p className="text-white/60 mb-12">
              Votre position GPS a été envoyée à vos contacts de confiance. 
              Le micro enregistre les preuves juridiques.
            </p>
            <button 
              onClick={resetEmergency}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Je suis en sécurité
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <MunyaProvider>
      <AppContent />
    </MunyaProvider>
  );
}
