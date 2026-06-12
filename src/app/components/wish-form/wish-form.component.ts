import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BirthdayService } from '../../services/birthday.service';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wish-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="wishes" class="py-24 px-4 max-w-7xl mx-auto relative">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        <!-- Left: Form Card (Col 2) -->
        <div class="lg:col-span-2 space-y-8 lg:sticky lg:top-24">
          <div class="space-y-4">
            <h2 class="text-3xl md:text-5xl font-black font-display tracking-tight">
              SEND A <span class="text-gradient-pink">WISH</span>
            </h2>
            <div class="w-16 h-1 bg-pink-500 rounded-full"></div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Leave a sweet message, a funny story, or warm greetings for EM RAKSA. Your wish will appear on the live board instantly!
            </p>
          </div>

          <!-- Wish Form -->
          <form (ngSubmit)="submitWish()" #wishForm="ngForm" class="p-8 rounded-2xl glass-panel border-pink-500/20 space-y-6 relative overflow-hidden">
            <!-- Glow Accent -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>

            <div class="space-y-2">
              <label for="name" class="block text-xs uppercase tracking-widest text-pink-400 font-bold">Your Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                [(ngModel)]="sender" 
                required 
                placeholder="e.g. Toch Chanam" 
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300">
            </div>

            <div class="space-y-2">
              <label for="message" class="block text-xs uppercase tracking-widest text-pink-400 font-bold">Your Message</label>
              <textarea 
                id="message" 
                name="message" 
                [(ngModel)]="message" 
                required 
                rows="4" 
                placeholder="Write your sweet birthday wish here..." 
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 resize-none"></textarea>
            </div>

            <button 
              type="submit" 
              [disabled]="!wishForm.form.valid"
              class="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 disabled:from-pink-500/50 disabled:to-purple-600/50 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.2)] hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
              <span>Send Message</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

        <!-- Right: Wishes Wall (Col 3) -->
        <div class="lg:col-span-3 space-y-6">
          <div class="flex justify-between items-center">
            <span class="text-xs uppercase tracking-widest text-cyan-400 font-bold">Live Wishes Board</span>
            <span class="text-xs text-gray-500 font-medium">{{ wishes().length }} messages left</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              *ngFor="let wish of wishes()" 
              class="group p-6 rounded-2xl glass-card border-white/5 relative flex flex-col justify-between space-y-4">
              
              <!-- Quote Icon -->
              <span class="absolute top-4 right-6 text-white/5 text-6xl font-serif select-none pointer-events-none">“</span>

              <!-- Delete Button (fades in on hover with hover effect) -->
              <button 
                (click)="onDeleteWish(wish.id)"
                class="absolute top-4 right-4 z-20 text-gray-500 hover:text-red-500 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                title="Delete Wish">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <!-- Content -->
              <p class="text-gray-300 text-sm leading-relaxed relative z-10">
                "{{ wish.message }}"
              </p>

              <!-- Sender details -->
              <div class="flex items-center gap-3 border-t border-white/5 pt-4">
                <!-- Avatar -->
                <div 
                  [style.background]="getAvatarGradient(wish.avatarSeed)"
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {{ wish.sender.charAt(0).toUpperCase() }}
                </div>
                <div class="text-left">
                  <h4 class="text-white font-semibold text-sm leading-tight">{{ wish.sender }}</h4>
                  <p class="text-gray-500 text-xs mt-0.5">{{ formatTime(wish.timestamp) }}</p>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div 
              *ngIf="wishes().length === 0" 
              class="col-span-full py-16 text-center glass-panel border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <span class="text-4xl">💭</span>
              <p class="text-gray-400 text-sm">Be the first one to leave a sweet wish!</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `]
})
export class WishFormComponent {
  private birthdayService = inject(BirthdayService);
  public wishes = this.birthdayService.allWishes;

  sender: string = '';
  message: string = '';

  submitWish(): void {
    if (this.sender.trim() && this.message.trim()) {
      this.birthdayService.addWish(this.sender.trim(), this.message.trim());
      
      // Clear inputs
      this.sender = '';
      this.message = '';

      // Pop sound and quick confetti burst
      this.birthdayService.playConfettiSound();
      this.triggerConfetti();
    }
  }

  onDeleteWish(id: string): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.birthdayService.deleteWish(id);
        Swal.fire({
          title: "Deleted!",
          text: "Your wish has been deleted.",
          icon: "success"
        });
      }
    });
  }

  triggerConfetti(): void {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff007f', '#00f0ff', '#8a2be2', '#ffee00']
    });
  }

  getAvatarGradient(seed: number): string {
    const gradients = [
      'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)', // pink to purple
      'linear-gradient(135deg, #00f0ff 0%, #0070f3 100%)', // cyan to blue
      'linear-gradient(135deg, #f5af19 0%, #f12711 100%)', // gold to red
      'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // teal to green
      'linear-gradient(135deg, #8a2be2 0%, #4a00e0 100%)', // violet to purple
      'linear-gradient(135deg, #ff007f 0%, #ff8000 100%)', // pink to orange
    ];
    return gradients[seed % gradients.length];
  }

  formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
