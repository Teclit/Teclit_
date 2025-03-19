import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillImage } from '../../../data';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() skills: SkillImage[] = [];
  private currentIndex = 0;
  private imagesPerView = 6;
  private intervalId?: number; // ⬅ Type corrigé ici

  constructor() {
    this.updateImagesPerView(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) { // ⬅ Type corrigé ici
    const target = event.target as Window;
    this.updateImagesPerView(target.innerWidth);
  }

  private updateImagesPerView(windowWidth: number): void {
    if (windowWidth >= 1200) {
      this.imagesPerView = 6;
    } else if (windowWidth >= 992) {
      this.imagesPerView = 5;
    } else if (windowWidth >= 768) {
      this.imagesPerView = 4;
    } else if (windowWidth >= 576) {
      this.imagesPerView = 3;
    } else {
      this.imagesPerView = 2;
    }

    if (this.currentIndex + this.imagesPerView > this.skills.length) {
      this.currentIndex = 0;
    }
  }

  get visibleImages(): SkillImage[] {
    return this.skills.slice(this.currentIndex, this.currentIndex + this.imagesPerView);
  }

  ngOnInit() {
    this.updateImagesPerView(window.innerWidth);
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private startAutoSlide(): void {
    this.intervalId = window.setInterval(() => {
      this.nextImages();
    }, 5000);
  }

  private stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImages(): void {
    this.currentIndex = (this.currentIndex + this.imagesPerView >= this.skills.length)
      ? 0
      : this.currentIndex + this.imagesPerView;
  }

  previousImages(): void {
    const prevIndex = this.currentIndex - this.imagesPerView;
    this.currentIndex = prevIndex >= 0
      ? prevIndex
      : Math.floor((this.skills.length - 1) / this.imagesPerView) * this.imagesPerView;
  }
}
