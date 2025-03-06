import { Injectable } from '@angular/core';
import { SKILL_IMAGES, SkillImage } from '../../data';

@Injectable({
  providedIn: 'root'
})
export class CarouselImageService {
  getSkillImages(): SkillImage[] {
    return SKILL_IMAGES;
  }
}
