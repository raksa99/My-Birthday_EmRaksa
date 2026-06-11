import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Memory {
  title: string;
  description: string;
  imageSrc: string;
  date: string;
  tiltClass: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="gallery" class="py-24 px-4 max-w-7xl mx-auto relative overflow-hidden">
      <!-- Section Headers -->
      <div class="text-center space-y-4 mb-16 relative z-10">
        <h2 class="text-3xl md:text-5xl font-black font-display tracking-tight">
          SWEET <span class="text-gradient-cyan">MEMORIES</span>
        </h2>
        <div class="w-16 h-1 bg-cyan-500 mx-auto rounded-full"></div>
        <p class="text-gray-400 font-serif max-w-lg mx-auto italic">
          "A collection of special moments, celebratory joy, and the beauty of journeying forward."
        </p>
      </div>

      <!-- Polaroid Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center relative z-10 px-4">
        <div 
          *ngFor="let memory of memories" 
          (click)="openLightbox(memory)"
          [class]="'group cursor-pointer bg-white p-4 pb-8 rounded shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:rotate-0 ' + memory.tiltClass">
          
          <!-- Image Wrapper -->
          <div class="relative overflow-hidden aspect-square bg-gray-100 rounded mb-4 border border-gray-200">
            <img 
              [src]="memory.imageSrc" 
              [alt]="memory.title"
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span class="px-4 py-2 rounded-full bg-cyan-500/90 text-white font-semibold text-xs tracking-wider uppercase shadow-lg">
                View Memory
              </span>
            </div>
          </div>

          <!-- Polaroid Text Section -->
          <div class="space-y-1 text-left">
            <p class="text-xs text-pink-500 font-semibold tracking-wider uppercase">{{ memory.date }}</p>
            <h3 class="text-gray-800 font-display font-bold text-lg leading-tight group-hover:text-cyan-600 transition-colors">{{ memory.title }}</h3>
            <p class="text-gray-500 text-xs line-clamp-2 leading-relaxed">{{ memory.description }}</p>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div 
        *ngIf="selectedMemory" 
        (click)="closeLightbox()"
        class="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
        <!-- Close Button -->
        <button 
          (click)="closeLightbox(); $event.stopPropagation()" 
          class="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image Content Card -->
        <div 
          (click)="$event.stopPropagation()"
          class="relative max-w-4xl w-full bg-[#120f24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          <!-- Image -->
          <div class="md:w-3/5 aspect-square md:aspect-auto md:h-[500px] bg-black">
            <img 
              [src]="selectedMemory.imageSrc" 
              [alt]="selectedMemory.title"
              class="w-full h-full object-cover">
          </div>

          <!-- Details -->
          <div class="md:w-2/5 p-8 flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
                {{ selectedMemory.date }}
              </span>
              <h3 class="text-2xl font-black font-display text-white leading-tight">
                {{ selectedMemory.title }}
              </h3>
              <p class="text-gray-400 text-sm leading-relaxed">
                {{ selectedMemory.description }}
              </p>
            </div>

            <button 
              (click)="closeLightbox()" 
              class="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class GalleryComponent {
  selectedMemory: Memory | null = null;

  memories: Memory[] = [
    {
      title: 'With My Dad',
      description: 'A nostalgic childhood memory from 2006 with my dad. Thank you for always guiding me, supporting my journey, and being the strongest pillar of love and strength in my life.',
      imageSrc: 'assets/images/pic1.PNG',
      date: '2006',
      tiltClass: '-rotate-2',
    },
    {
      title: 'At Bokor Mountain',
      description: 'I was really happy when I came to Bokor Mountain with my family.',
      imageSrc: 'assets/images/pic2.JPG',
      date: '2016',
      tiltClass: 'rotate-1',
    },
    {
      title: 'At Battambang Province Som Pov Mountain',
      description: 'I was really happy when I came to Battambang Province Som Pov Mountain.',
      imageSrc: 'assets/images/pic3.JPEG',
      date: '2019',
      tiltClass: '-rotate-1',
    },
    {
      title: 'Rattakal Cafe',
      description: 'I was really happy when I came to Rattakal Cafe with my friends. This Place have traditional khmer art  ',
      imageSrc: 'assets/images/pic4.PNG',
      date: '2026',
      tiltClass: 'rotate-2',
    },
  ];

  openLightbox(memory: Memory): void {
    this.selectedMemory = memory;
  }

  closeLightbox(): void {
    this.selectedMemory = null;
  }
}
