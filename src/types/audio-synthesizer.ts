export type SoundEffectType = 'splash' | 'bubble' | 'jump' | 'score' | 'victory' | 'gameover';

export interface AudioSettings {
  isMuted: boolean;
  masterVolume: number; // 0.0 to 1.0
  sfxVolume: number;
}

