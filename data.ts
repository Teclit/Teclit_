//Constant data

// Définition d'un type explicite pour les liens de profil
type SocialLinks = {
  linkedIn: string;
  github: string;
  cvdesignr: string;
};

// Constantes refactorisées et bien nommées
const COMPANY_NAME = 'Teklit Te.';
const SOCIAL_LINKS: SocialLinks = {
  linkedIn: 'https://www.linkedin.com/in/teklittewolde/',
  github: 'https://github.com/Teclit',
  cvdesignr: 'https://cvdesignr.com/p/5ca9b929ed8c4'
};

// Exportation centralisée pour faciliter l'importation ailleurs
export {COMPANY_NAME, SOCIAL_LINKS};
