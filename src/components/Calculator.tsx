import React, { useState, useEffect } from 'react';
import { useMunya } from '../context/MunyaContext';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Percent, Divide, X, Minus, Plus, Equal } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Composant Calculatrice - Leurre principal de l'application.
 */
export const Calculator: React.FC = () => {
  const { userState, setMode, triggerEmergency } = useMunya();
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [lastOp, setLastOp] = useState<string | null>(null);

  // Vérification du code secret
  useEffect(() => {
    if (display === userState.secretCode && userState.secretCode !== '') {
      // On attend un peu pour simuler une opération avant de basculer
      setTimeout(() => {
        setMode(AppMode.HIDDEN);
      }, 500);
    }
  }, [display, userState.secretCode, setMode]);

  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleClear = () => {
    setDisplay('0');
    setLastOp(null);
  };

  const handleOp = (op: string) => {
    setLastOp(op);
    setDisplay(prev => prev + op);
  };

  // Appui long sur % pour déclencher l'urgence (selon le user flow)
  const [percentTimer, setPercentTimer] = useState<NodeJS.Timeout | null>(null);
  
  const onPercentStart = () => {
    const timer = setTimeout(() => {
      triggerEmergency();
    }, 2000); // 2 secondes d'appui long
    setPercentTimer(timer);
  };

  const onPercentEnd = () => {
    if (percentTimer) {
      clearTimeout(percentTimer);
      setPercentTimer(null);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 p-4 font-mono">
      {/* Affichage */}
      <div className="flex-1 flex flex-col justify-end items-end p-6 mb-4 bg-white rounded-2xl shadow-inner border border-gray-100 overflow-hidden">
        <div className="text-gray-400 text-sm mb-1">{history.join(' ')}</div>
        <div className="text-4xl font-bold text-mist-gray break-all">{display}</div>
      </div>

      {/* Clavier */}
      <div className="grid grid-cols-4 gap-3">
        <button onClick={handleClear} className="calculator-btn text-wisdom-amber">AC</button>
        <button onClick={() => setDisplay(prev => prev.slice(0, -1) || '0')} className="calculator-btn">
          <Delete className="mx-auto w-5 h-5" />
        </button>
        <button 
          onMouseDown={onPercentStart}
          onMouseUp={onPercentEnd}
          onTouchStart={onPercentStart}
          onTouchEnd={onPercentEnd}
          className="calculator-btn"
        >
          <Percent className="mx-auto w-5 h-5" />
        </button>
        <button onClick={() => handleOp('/')} className="calculator-btn calculator-op">
          <Divide className="mx-auto w-5 h-5" />
        </button>

        {[7, 8, 9].map(n => (
          <button key={n} onClick={() => handleNumber(n.toString())} className="calculator-btn">{n}</button>
        ))}
        <button onClick={() => handleOp('*')} className="calculator-btn calculator-op">
          <X className="mx-auto w-5 h-5" />
        </button>

        {[4, 5, 6].map(n => (
          <button key={n} onClick={() => handleNumber(n.toString())} className="calculator-btn">{n}</button>
        ))}
        <button onClick={() => handleOp('-')} className="calculator-btn calculator-op">
          <Minus className="mx-auto w-5 h-5" />
        </button>

        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => handleNumber(n.toString())} className="calculator-btn">{n}</button>
        ))}
        <button onClick={() => handleOp('+')} className="calculator-btn calculator-op">
          <Plus className="mx-auto w-5 h-5" />
        </button>

        <button onClick={() => handleNumber('0')} className="calculator-btn col-span-2">0</button>
        <button onClick={() => handleNumber('.')} className="calculator-btn">.</button>
        <button onClick={() => setDisplay(eval(display).toString())} className="calculator-btn calculator-eq">
          <Equal className="mx-auto w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 text-center text-[10px] text-gray-300 uppercase tracking-widest">
        Standard Utility v2.4.1
      </div>
    </div>
  );
};
