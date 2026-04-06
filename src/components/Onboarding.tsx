import React, { useState } from 'react';
import { useMunya } from '../context/MunyaContext';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Calculator as CalcIcon, FileText, Cloud, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Composant Onboarding - Guide l'utilisatrice pour configurer son camouflage.
 */
export const Onboarding: React.FC = () => {
  const { updateUserState, setMode } = useMunya();
  const [step, setStep] = useState(1);
  const [tempCode, setTempCode] = useState('');
  const [selectedMask, setSelectedMask] = useState<'calculator' | 'notes' | 'weather'>('calculator');

  const nextStep = () => setStep(s => s + 1);

  const finishOnboarding = () => {
    updateUserState({
      isFirstLaunch: false,
      secretCode: tempCode,
      camouflageType: selectedMask
    });
    setMode(AppMode.DECOY);
  };

  return (
    <div className="min-h-screen bg-soft-sand flex flex-col p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center"
          >
            <div className="w-20 h-20 bg-munya-green/10 rounded-3xl flex items-center justify-center mb-8">
              <Shield className="w-10 h-10 text-munya-green" />
            </div>
            <h1 className="text-3xl mb-4">Bienvenue sur MUNYA</h1>
            <p className="text-lg text-mist-gray/80 mb-8 leading-relaxed">
              Votre espace sécurisé et indétectable. Pour votre sécurité, cette application va se camoufler sur votre téléphone.
            </p>
            <button onClick={nextStep} className="btn-primary flex items-center justify-center gap-2">
              Commencer <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center"
          >
            <h2 className="text-2xl mb-6">Choisissez votre camouflage</h2>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {[
                { id: 'calculator', icon: CalcIcon, label: 'Calculatrice', desc: 'Une calculatrice fonctionnelle' },
                { id: 'notes', icon: FileText, label: 'Bloc-notes', desc: 'Un éditeur de texte simple' },
                { id: 'weather', icon: Cloud, label: 'Météo', desc: 'Prévisions locales banales' }
              ].map(mask => (
                <button 
                  key={mask.id}
                  onClick={() => setSelectedMask(mask.id as any)}
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                    selectedMask === mask.id ? "border-munya-green bg-munya-green/5" : "border-gray-200 bg-white"
                  )}
                >
                  <div className={clsx("p-3 rounded-xl", selectedMask === mask.id ? "bg-munya-green text-white" : "bg-gray-100 text-gray-400")}>
                    <mask.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">{mask.label}</div>
                    <div className="text-sm text-gray-500">{mask.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={nextStep} className="btn-primary">Confirmer le masque</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center"
          >
            <h2 className="text-2xl mb-2">Définissez votre code secret</h2>
            <p className="text-gray-500 mb-8">Ce code vous permettra d'accéder à l'interface réelle depuis la calculatrice.</p>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <input 
                type="number" 
                value={tempCode}
                onChange={(e) => setTempCode(e.target.value)}
                placeholder="Ex: 1234"
                className="w-full text-center text-4xl font-mono tracking-widest focus:outline-none"
              />
            </div>

            <button 
              onClick={nextStep} 
              disabled={tempCode.length < 4}
              className="btn-primary"
            >
              Suivant
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-24 h-24 bg-munya-green text-white rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl mb-4">Configuration terminée</h2>
            <p className="text-lg text-gray-600 mb-8">
              L'application va maintenant se fermer. Pour y revenir, ouvrez l'icône "{selectedMask === 'calculator' ? 'Calculatrice' : selectedMask}" et tapez votre code.
            </p>
            <button onClick={finishOnboarding} className="btn-primary w-full">
              Terminer l'installation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper for conditional classes
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
