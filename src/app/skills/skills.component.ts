import { Component, OnInit } from '@angular/core';
import { CarouselImageService } from '../../services/carousel-image.service';
import {SkillImage} from '../../../data';
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  imports: [
    CardComponent
  ],
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {
  images: SkillImage[] = [];

  constructor(private carouselService: CarouselImageService) {}

  ngOnInit(): void {
    this.images = this.carouselService.getSkillImages();
  }
}
