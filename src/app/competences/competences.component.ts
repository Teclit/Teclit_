import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {COMPETENCES, Competence} from '../../../data';

@Component({
  selector: 'app-competences',
  imports: [CommonModule],
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.css'],
  standalone: true
})
export class CompetencesComponent {
  competences: Competence[] = COMPETENCES;

}
