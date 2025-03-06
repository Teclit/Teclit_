import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() SUPPORTED_LANGUAGES: CarouselImage[] = [];
  private currentIndex = 0;
  private readonly imagesPerView = 4;
  private intervalId: any;

  get visibleImages(): CarouselImage[] {
    return this.SUPPORTED_LANGUAGES.slice(
      this.currentIndex,
      this.currentIndex + this.imagesPerView
    );
  }

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextImages();
    }, 5000); // Intervalle de 1 seconde
  }

  private stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextImages(): void {
    this.currentIndex = (this.currentIndex + this.imagesPerView >= this.SUPPORTED_LANGUAGES.length)
      ? 0
      : this.currentIndex + this.imagesPerView;
  }

  previousImages(): void {
    const prevIndex = this.currentIndex - this.imagesPerView;
    this.currentIndex = prevIndex >= 0
      ? prevIndex
      : Math.floor((this.SUPPORTED_LANGUAGES.length - 1) / this.imagesPerView) * this.imagesPerView;
  }
}
