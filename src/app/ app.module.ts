import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Injectable({providedIn: 'root'})
export class IconService {
  constructor(library: FaIconLibrary) {
    library.addIcons(faGithub, faFacebook, faInstagram, faTwitter);
  }
}
