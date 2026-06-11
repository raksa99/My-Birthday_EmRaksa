import { Injectable, signal } from '@angular/core';
import { Wish } from '../models/wish';
import { Observable, timer, map, shareReplay } from 'rxjs';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isItsBirthday: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BirthdayService {
  private readonly TARGET_DATE = new Date('2026-07-21T00:00:00');
  
  // Wishes State
  private wishes = signal<Wish[]>([]);
  public readonly allWishes = this.wishes.asReadonly();

  // Audio State
  private audio: HTMLAudioElement | null = null;
  public isPlaying = signal<boolean>(false);

  // Initial Mock Wishes
  private readonly DEFAULT_WISHES: Wish[] = [
    {
      id: 'w-1',
      sender: 'Muny Rachna',
      message: 'Happy Early Birthday, EM RAKSA! May this special milestone bring you endless joy, peace, and success in everything you do. Stay awesome and keep inspiring us! ✨🎂',
      timestamp: new Date('2026-06-11T12:00:00Z').toISOString(),
      avatarSeed: 12
    },
    {
      id: 'w-2',
      sender: 'Ou Seavinh',
      message: 'Wishing you an absolute blast on your upcoming birthday, bro! Let the countdown begin! Stay healthy, wealthy, and keep coding amazing things! 🚀💻',
      timestamp: new Date('2026-06-11T14:30:00Z').toISOString(),
      avatarSeed: 42
    },
    {
      id: 'w-3',
      sender: 'Em Chetra',
      message: 'Happy Birthday, EM RAKSA! Sending you warm wishes and positive vibes from afar. May all your dreams and aspirations come true in 2026! 🥳🎈🌟',
      timestamp: new Date('2026-06-11T16:45:00Z').toISOString(),
      avatarSeed: 88
    }
  ];

  constructor() {
    this.loadWishes();
    this.initAudio();
  }

  // Countdown Observable
  public readonly countdown$: Observable<TimeLeft> = timer(0, 1000).pipe(
    map(() => this.calculateTimeLeft()),
    shareReplay(1)
  );

  private calculateTimeLeft(): TimeLeft {
    const now = new Date().getTime();
    const difference = this.TARGET_DATE.getTime() - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isItsBirthday: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isItsBirthday: false };
  }

  // Wishes Operations
  private loadWishes(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('birthday_wishes_v2');
      if (stored) {
        try {
          this.wishes.set(JSON.parse(stored));
        } catch (e) {
          this.wishes.set(this.DEFAULT_WISHES);
        }
      } else {
        this.wishes.set(this.DEFAULT_WISHES);
        localStorage.setItem('birthday_wishes_v2', JSON.stringify(this.DEFAULT_WISHES));
      }
    } else {
      this.wishes.set(this.DEFAULT_WISHES);
    }
  }

  public addWish(sender: string, message: string): void {
    const newWish: Wish = {
      id: 'w-' + Date.now(),
      sender,
      message,
      timestamp: new Date().toISOString(),
      avatarSeed: Math.floor(Math.random() * 100)
    };

    const updated = [newWish, ...this.wishes()];
    this.wishes.set(updated);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('birthday_wishes_v2', JSON.stringify(updated));
    }
  }

  // Audio Operations
  private initAudio(): void {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      // Premium, beautiful royalty-free cinematic/lofi piano track
      this.audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
      this.audio.loop = true;
      this.audio.volume = 0.45;

      this.audio.addEventListener('play', () => this.isPlaying.set(true));
      this.audio.addEventListener('pause', () => this.isPlaying.set(false));
      this.audio.addEventListener('ended', () => this.isPlaying.set(false));
    }
  }

  public toggleMusic(): void {
    if (!this.audio) return;
    
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => {
        console.warn('Audio play blocked or failed:', err);
      });
    }
  }

  public playConfettiSound(): void {
    if (typeof window !== 'undefined') {
      // Small synthesized pop using Web Audio API so it's lightweight and doesn't require downloading resources
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Pop sound
        const osc1 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(300, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        osc1.start();
        osc1.stop(ctx.currentTime + 0.15);
      } catch (e) {
        console.error('Web Audio API popup sound failed:', e);
      }
    }
  }
}
