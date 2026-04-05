import React, { useState } from 'react';
import { useMunya } from '../context/MunyaContext';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Users, MessageSquare, BookOpen, Settings, 
  Bell, ShieldAlert, LogOut, Heart, Scale, UserCheck,
  Plus, Send, Search, Calendar, ChevronRight, CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Dashboard principal (caché) de MUNYA.
 */
export const Dashboard: React.FC = () => {
  const { setMode, userState, triggerEmergency } = useMunya();
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'experts' | 'journal' | 'settings'>('home');

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab onEmergency={triggerEmergency} />;
      case 'community': return <CommunityTab />;
      case 'experts': return <ExpertsTab />;
      case 'journal': return <JournalTab />;
      case 'settings': return <SettingsTab onLogout={() => setMode(AppMode.DECOY)} />;
      default: return <HomeTab onEmergency={triggerEmergency} />;
    }
  };

  return (
    <div className="min-h-screen bg-soft-sand flex flex-col pb-24">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-munya-green rounded-xl flex items-center justify-center text-white font-bold">M</div>
          <h1 className="text-xl font-bold text-munya-green">MUNYA</h1>
        </div>
        <button onClick={() => setMode(AppMode.DECOY)} className="p-2 rounded-full hover:bg-gray-100">
          <LogOut className="w-5 h-5 text-gray-400" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex justify-around items-center shadow-2xl">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Accueil" />
        <NavButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon={Users} label="Solidarité" />
        <NavButton active={activeTab === 'experts'} onClick={() => setActiveTab('experts')} icon={UserCheck} label="Experts" />
        <NavButton active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon={BookOpen} label="Journal" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Réglages" />
      </nav>

      {/* Bouton SOS flottant (discret) */}
      <button 
        onClick={triggerEmergency}
        className="fixed bottom-28 right-6 w-16 h-16 bg-wisdom-amber text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-20"
      >
        <Bell className="w-8 h-8" />
      </button>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 transition-all",
      active ? "text-munya-green scale-110" : "text-gray-400"
    )}
  >
    <Icon className="w-6 h-6" />
    <span className="text-[10px] font-medium uppercase tracking-tighter">{label}</span>
  </button>
);

// --- TABS ---

const HomeTab = ({ onEmergency }: { onEmergency: () => void }) => (
  <div className="space-y-6">
    <div className="bg-munya-green text-white p-8 rounded-[32px] shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-white text-2xl mb-2">Bonjour, vous êtes en sécurité ici.</h2>
        <p className="text-white/80 text-sm mb-6">Que souhaitez-vous faire aujourd'hui ?</p>
        <div className="flex gap-3">
          <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium">S'informer</button>
          <button className="bg-white text-munya-green px-4 py-2 rounded-xl text-sm font-bold">Demander de l'aide</button>
        </div>
      </div>
      <Heart className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-horizon-blue/10 rounded-2xl flex items-center justify-center mb-4">
          <Scale className="w-6 h-6 text-horizon-blue" />
        </div>
        <h3 className="text-sm font-bold mb-1">Justice</h3>
        <p className="text-[10px] text-gray-400">Vos droits au Cameroun</p>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-munya-green/10 rounded-2xl flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-munya-green" />
        </div>
        <h3 className="text-sm font-bold mb-1">Santé</h3>
        <p className="text-[10px] text-gray-400">Soutien psychologique</p>
      </div>
    </div>

    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-wisdom-amber" />
        Plan de sécurité
      </h3>
      <div className="space-y-3">
        {[
          "Préparer un sac d'urgence",
          "Identifier un lieu de refuge",
          "Informer un contact de confiance"
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">{i+1}</div>
            <span className="text-sm">{item}</span>
            <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CommunityTab = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl">Espace Solidarité</h2>
      <button className="p-2 bg-munya-green text-white rounded-xl">
        <Plus className="w-5 h-5" />
      </button>
    </div>
    
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input 
        type="text" 
        placeholder="Rechercher un sujet..." 
        className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 ring-munya-green/20"
      />
    </div>

    <div className="space-y-4">
      {[
        { author: "Anonyme_241", content: "Comment avez-vous géré la première étape du départ ?", likes: 12, comments: 4 },
        { author: "Etoile_Sereine", content: "Merci pour vos conseils sur le journal vocal, ça m'aide énormément.", likes: 45, comments: 12 },
        { author: "Force_Interieure", content: "Quelqu'un connaît un bon avocat à Douala spécialisé en droit de la famille ?", likes: 8, comments: 3 }
      ].map((post, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400">A</div>
            <span className="text-xs font-bold text-munya-green">{post.author}</span>
            <span className="text-[10px] text-gray-300 ml-auto">Il y a 2h</span>
          </div>
          <p className="text-sm mb-4 leading-relaxed">{post.content}</p>
          <div className="flex gap-4 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.likes}</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {post.comments}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExpertsTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl">Parler à un pro</h2>
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {['Tous', 'Psychologues', 'Avocats', 'Assistants'].map(cat => (
        <button key={cat} className={cn(
          "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap",
          cat === 'Tous' ? "bg-munya-green text-white" : "bg-white text-gray-400 border border-gray-100"
        )}>
          {cat}
        </button>
      ))}
    </div>

    <div className="space-y-4">
      {[
        { name: "Dr. Marie Ngo", specialty: "Psychologue Clinicienne", rating: 4.9, certified: true },
        { name: "Me. Jean Kamdem", specialty: "Avocat Droit de la Famille", rating: 4.8, certified: true },
        { name: "Sarah Tchakounté", specialty: "Assistante Sociale", rating: 4.7, certified: true }
      ].map((expert, i) => (
        <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-xl font-bold text-gray-300">
            {expert.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">{expert.name}</h4>
              {expert.certified && <div className="w-4 h-4 bg-munya-green text-white rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>}
            </div>
            <p className="text-xs text-gray-400">{expert.specialty}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] font-bold text-wisdom-amber">★ {expert.rating}</span>
            </div>
          </div>
          <button className="p-3 bg-horizon-blue/10 text-horizon-blue rounded-xl">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const JournalTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl">Journal Intime</h2>
    <div className="bg-white p-8 rounded-[32px] border-2 border-dashed border-munya-green/20 flex flex-col items-center justify-center text-center py-12">
      <div className="w-20 h-20 bg-munya-green/10 rounded-full flex items-center justify-center mb-6">
        <Plus className="w-10 h-10 text-munya-green" />
      </div>
      <h3 className="font-bold mb-2">Nouvelle entrée</h3>
      <p className="text-sm text-gray-400 mb-6">Enregistrez vos pensées ou des preuves en toute sécurité.</p>
      <div className="flex gap-3">
        <button className="btn-primary">Texte</button>
        <button className="btn-secondary">Audio</button>
      </div>
    </div>
  </div>
);

const SettingsTab = ({ onLogout }: { onLogout: () => void }) => (
  <div className="space-y-6">
    <h2 className="text-2xl">Réglages</h2>
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      {[
        { icon: Users, label: "Contacts de confiance", value: "3 configurés" },
        { icon: ShieldAlert, label: "Mode Panique", value: "Activé" },
        { icon: Bell, label: "Notifications furtives", value: "Activé" },
        { icon: LogOut, label: "Se déconnecter", value: "", onClick: onLogout, color: "text-red-500" }
      ].map((item, i) => (
        <button 
          key={i} 
          onClick={item.onClick}
          className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
        >
          <div className={cn("p-3 rounded-xl bg-gray-50", item.color || "text-munya-green")}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className={cn("font-bold text-sm", item.color)}>{item.label}</div>
            {item.value && <div className="text-[10px] text-gray-400 uppercase tracking-widest">{item.value}</div>}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-200 ml-auto" />
        </button>
      ))}
    </div>
  </div>
);
