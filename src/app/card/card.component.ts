import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SkillImage} from '../../../data';

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
  private readonly imagesPerView = 6;
  private intervalId: any;

  get visibleImages(): SkillImage[] {
    return this.skills.slice(this.currentIndex, this.currentIndex + this.imagesPerView);
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
