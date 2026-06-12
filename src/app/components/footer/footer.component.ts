import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-white/5 py-12 px-4 bg-[#0a0812] relative overflow-hidden">
      <!-- Background glow -->
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-pink-500/5 rounded-full blur-[80px]"></div>

      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <!-- Brand/Wishes -->
        <div class="text-center md:text-left space-y-2">
          <p class="font-display font-black text-xl tracking-wider text-white">
            EM RAKSA <span class="text-pink-500">2026</span>
          </p>
          <p class="text-xs text-gray-500 font-medium">Made with ❤️ for a perfect birthday celebration.</p>
        </div>

        <!-- Social Icons -->
        <div class="flex items-center gap-4">
          <a href="https://github.com/raksa99" target="_blank" rel="noopener" class="w-10 h-10 rounded-full glass-card border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(255,0,127,0.3)] transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>
          <a href="https://www.instagram.com/e.raksa77" target="_blank" rel="noopener" class="w-10 h-10 rounded-full glass-card border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@e.raksa77" target="_blank" rel="noopener" class="w-10 h-10 rounded-full glass-card border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(255,0,127,0.3)] transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
          </a>
          <a href="https://www.facebook.com/share/1D1SWxtakH/?mibextid=wwXIfr" target="_blank" rel="noopener" class="w-10 h-10 rounded-full glass-card border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
