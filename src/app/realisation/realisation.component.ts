import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PROJECTS} from '../../../data';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
}


@Component({
  selector: 'app-realisation',
  imports: [CommonModule],
  templateUrl: './realisation.component.html',
  styleUrl: './realisation.component.css'
})


export class RealisationComponent {
  projects: Project[]  = PROJECTS ;

}
