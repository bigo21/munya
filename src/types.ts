/**
 * Types globaux pour l'application MUNYA.
 */

export enum AppMode {
  DECOY = 'DECOY',
  HIDDEN = 'HIDDEN',
  ONBOARDING = 'ONBOARDING'
}

export interface UserState {
  isFirstLaunch: boolean;
  secretCode: string; // ex: "1234"
  camouflageType: 'calculator' | 'notes' | 'weather';
  isEmergencyActive: boolean;
  trustedContacts: TrustedContact[];
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

export interface Expert {
  id: string;
  name: string;
  specialty: 'psychologue' | 'avocat' | 'assistant_social';
  rating: number;
  isCertified: boolean;
  avatar: string;
}

export interface ForumPost {
  id: string;
  authorPseudo: string;
  content: string;
  timestamp: number;
  category: string;
}
