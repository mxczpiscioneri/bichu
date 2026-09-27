import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioSource } from 'expo-audio';
import { create } from 'zustand';

import { mediaFor, UI_SOUNDS } from '@/content/media';

/**
 * Single audio channel for the whole app: starting a clip always stops the
 * previous one, so two sounds never overlap. Clips can be queued
 * (name → sound) and the "now playing" key is observable for UI feedback.
 */

export type ClipKind = 'name' | 'sound' | 'feedback';
export interface Clip {
  key: string;
  kind: ClipKind;
  source: AudioSource;
  animalId?: string;
}
export type Feedback = keyof typeof UI_SOUNDS;

interface NowPlayingState {
  key: string | null;
}
export const useNowPlaying = create<NowPlayingState>(() => ({ key: null }));

export const clipKeys = {
  name: (animalId: string) => `name:${animalId}`,
  sound: (animalId: string) => `sound:${animalId}`,
};

type ClipListener = (clip: Clip) => void;

class AudioServiceImpl {
  private player: AudioPlayer | null = null;
  private queue: Clip[] = [];
  private current: Clip | null = null;
  private resolveSequence: (() => void) | null = null;
  private startListeners = new Set<ClipListener>();

  private ensurePlayer(): AudioPlayer {
    if (this.player) return this.player;
    void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers', shouldPlayInBackground: false });
    const player = createAudioPlayer(null);
    player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) this.advance();
    });
    this.player = player;
    return player;
  }

  /** Called whenever a clip starts (used to record "heard name/sound"). */
  onClipStart(listener: ClipListener): () => void {
    this.startListeners.add(listener);
    return () => this.startListeners.delete(listener);
  }

  /** Plays clips one after another. Resolves when done or interrupted. */
  playSequence(clips: Clip[]): Promise<void> {
    this.stop();
    if (clips.length === 0) return Promise.resolve();
    this.queue = [...clips];
    return new Promise((resolve) => {
      this.resolveSequence = resolve;
      this.advance();
    });
  }

  playAnimalName(animalId: string): Promise<void> {
    return this.playSequence([this.nameClip(animalId)]);
  }

  playAnimalSound(animalId: string): Promise<void> {
    return this.playSequence([this.soundClip(animalId)]);
  }

  /** Name first ("Elefante. E-le-fan-te."), then the real sound. */
  playNameThenSound(animalId: string): Promise<void> {
    return this.playSequence([this.nameClip(animalId), this.soundClip(animalId)]);
  }

  playFeedback(feedback: Feedback): Promise<void> {
    return this.playSequence([{ key: `feedback:${feedback}`, kind: 'feedback', source: UI_SOUNDS[feedback] }]);
  }

  stop(): void {
    this.queue = [];
    this.current = null;
    this.player?.pause();
    useNowPlaying.setState({ key: null });
    this.finishSequence();
  }

  nameClip(animalId: string): Clip {
    return { key: clipKeys.name(animalId), kind: 'name', source: mediaFor(animalId).nameAudio, animalId };
  }

  soundClip(animalId: string): Clip {
    return { key: clipKeys.sound(animalId), kind: 'sound', source: mediaFor(animalId).sound, animalId };
  }

  private advance(): void {
    const next = this.queue.shift();
    if (!next) {
      this.current = null;
      useNowPlaying.setState({ key: null });
      this.finishSequence();
      return;
    }
    try {
      const player = this.ensurePlayer();
      this.current = next;
      player.replace(next.source);
      void player.seekTo(0);
      player.play();
      useNowPlaying.setState({ key: next.key });
      this.startListeners.forEach((listener) => listener(next));
    } catch (error) {
      // Audio is an enhancement: a failing clip must never break the screen.
      console.warn('[AudioService] falha ao tocar', next.key, error);
      this.advance();
    }
  }

  private finishSequence(): void {
    const resolve = this.resolveSequence;
    this.resolveSequence = null;
    resolve?.();
  }
}

export const AudioService = new AudioServiceImpl();
