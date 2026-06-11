import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { BirthdayService } from '../../services/birthday.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  template: `
    <section id="hero" class="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20">
      <!-- Background Glowing Blobs -->
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-float"></div>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-4xl mx-auto space-y-8">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-pink-500/20 text-pink-400 text-sm font-semibold tracking-wider uppercase">
          <span class="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
          21 July 2026
        </div>

        <!-- Title -->
        <div class="space-y-2">
          <h1 class="text-4xl md:text-6xl lg:text-8xl font-black font-display tracking-tight leading-none">
            HAPPY BIRTHDAY<br>
            <span class="text-gradient-neon filter drop-shadow-[0_0_20px_rgba(255,0,127,0.3)]">EM RAKSA</span>
          </h1>
          <p class="text-gray-400 font-serif text-lg md:text-xl italic max-w-xl mx-auto pt-2">
            "Wishing you a lifetime of happiness, laughter, and brilliant achievements."
          </p>
        </div>

        <!-- Countdown -->
        <div *ngIf="countdown$ | async as time" class="flex flex-wrap justify-center gap-4 md:gap-6 pt-4">
          <!-- Days -->
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 md:w-28 md:h-28 rounded-2xl glass-card border-pink-500/30 flex items-center justify-center neon-glow-pink">
              <span class="text-3xl md:text-5xl font-black font-display text-white">{{ padZero(time.days) }}</span>
            </div>
            <span class="text-xs uppercase tracking-widest text-pink-400 mt-2 font-bold">Days</span>
          </div>

          <!-- Hours -->
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 md:w-28 md:h-28 rounded-2xl glass-card border-cyan-500/30 flex items-center justify-center neon-glow-cyan">
              <span class="text-3xl md:text-5xl font-black font-display text-white">{{ padZero(time.hours) }}</span>
            </div>
            <span class="text-xs uppercase tracking-widest text-cyan-400 mt-2 font-bold">Hours</span>
          </div>

          <!-- Minutes -->
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 md:w-28 md:h-28 rounded-2xl glass-card border-violet-500/30 flex items-center justify-center neon-glow-violet">
              <span class="text-3xl md:text-5xl font-black font-display text-white">{{ padZero(time.minutes) }}</span>
            </div>
            <span class="text-xs uppercase tracking-widest text-violet-400 mt-2 font-bold">Minutes</span>
          </div>

          <!-- Seconds -->
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 md:w-28 md:h-28 rounded-2xl glass-card border-pink-500/30 flex items-center justify-center neon-glow-pink">
              <span class="text-3xl md:text-5xl font-black font-display text-white">{{ padZero(time.seconds) }}</span>
            </div>
            <span class="text-xs uppercase tracking-widest text-pink-400 mt-2 font-bold">Seconds</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-6">
          <button 
            (click)="triggerCelebration()" 
            class="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-full font-bold text-white shadow-[0_0_30px_rgba(255,0,127,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto group">
            <span class="animate-heart-beat">🎉</span>
            Celebrate EM RAKSA!
            <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-normal">✨</span>
          </button>
        </div>
      </div>

      <!-- Arrow Down Indicator -->
      <a href="#gallery" class="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white transition-colors duration-300 flex flex-col items-center gap-1 group">
        <span class="text-xs tracking-widest uppercase font-semibold">Scroll Down</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-bounce mt-1 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  `
})
export class HeroComponent {
  private birthdayService = inject(BirthdayService);
  public countdown$ = this.birthdayService.countdown$;

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  triggerCelebration(): void {
    // Play sound from the service
    this.birthdayService.playConfettiSound();

    // Trigger full screen confetti burst
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.85 },
        colors: ['#ff007f', '#00f0ff', '#8a2be2', '#ffee00']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.85 },
        colors: ['#ff007f', '#00f0ff', '#8a2be2', '#ffee00']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }
}
