import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { WishFormComponent } from './components/wish-form/wish-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { BirthdayService } from './services/birthday.service';

interface FloatingItem {
  left: string;
  delay: string;
  duration: string;
  size: string;
  symbol: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    GalleryComponent,
    WishFormComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected birthdayService = inject(BirthdayService);
  public isMusicPlaying = this.birthdayService.isPlaying;

  // Background floating objects
  floatingItems = signal<FloatingItem[]>([]);

  ngOnInit(): void {
    this.generateFloatingItems();
  }

  toggleMusic(): void {
    this.birthdayService.toggleMusic();
  }

  private generateFloatingItems(): void {
    const symbols = ['🎈', '❤️', '✨', '🌸', '🌟', '💫', '🧁', '🎁'];
    const items: FloatingItem[] = [];

    for (let i = 0; i < 24; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = 10 + Math.random() * 15; // Between 10s and 25s
      const size = 18 + Math.random() * 26; // Between 18px and 44px
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      items.push({
        left: `${left}%`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        size: `${size}px`,
        symbol
      });
    }

    this.floatingItems.set(items);
  }
}
