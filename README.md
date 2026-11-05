# Teklit TEWOLDE — Portfolio

Portfolio professionnel de **Teklit TEWOLDE**, développeur Full Stack (Java / Kotlin, Spring Boot, Node.js / NestJS, React / Next.js).
Il présente le parcours complet : profil, timeline des expériences et formations, compétences, projets détaillés, CV et formulaire de contact.

## Stack

| Domaine     | Choix                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------- |
| Framework   | Angular 19 (composants standalone, signals, nouveau control flow), TypeScript strict        |
| Rendu       | Pré-rendu statique (SSG) de toutes les pages via `@angular/ssr` (`outputMode: "static"`)    |
| Styles      | CSS natif, design tokens (`src/styles.css`), thème clair / sombre, mobile-first             |
| Contact     | Fonction serverless Vercel `api/contact.ts` (validation serveur, anti-spam, envoi Resend)   |
| Qualité     | ESLint (angular-eslint, règles a11y, 0 warning), Prettier, Karma/Jasmine, Playwright + axe  |
| Livraison   | GitHub Actions, Docker multi-stage (Nginx non-root), déploiement Vercel                     |

## Démarrage

Prérequis : **Node.js ≥ 22.12** et npm.

```bash
npm ci
npm start            # http://localhost:4200
```

## Scripts

| Commande               | Rôle                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm start`            | Serveur de développement                                                |
| `npm run build`        | Génère `sitemap.xml` / `robots.txt` puis le build pré-rendu (`dist/`)   |
| `npm run lint`         | ESLint (TS + templates + accessibilité), échoue au moindre warning      |
| `npm run typecheck`    | `tsc --noEmit` (app, tests, API)                                        |
| `npm run format`       | Formate avec Prettier (`format:check` en CI)                            |
| `npm test`             | Tests unitaires en mode watch                                           |
| `npm run test:ci`      | Tests unitaires headless + couverture (`coverage/`)                     |
| `npm run test:e2e`     | Tests Playwright (desktop + mobile, audit axe WCAG AA) sur le build     |
| `npm run serve:static` | Sert `dist/teclit/browser` sur http://localhost:4300                    |
| `npm run validate`     | Enchaîne format, lint, typecheck, tests unitaires et build              |

Tests e2e en local : `npm run build && npm run test:e2e`. Le Chrome installé est utilisé par défaut ;
sinon `npx playwright install chromium` puis `PW_CHANNEL= npm run test:e2e`.

## Modifier le contenu

**Tout le contenu est centralisé dans [`src/app/data/profile.data.ts`](src/app/data/profile.data.ts)**, typé par
[`profile.model.ts`](src/app/data/profile.model.ts). Les composants ne lisent que cette source.

- **Identité, bio, liens** : `PROFILE.identity` (dont `siteUrl`, utilisé pour canonical, Open Graph et sitemap).
- **Expériences** : `PROFILE.experiences` — entreprise, rôle, période, contexte, objectifs, missions, réalisations chiffrées, stack.
- **Projets** : `PROFILE.projects` — chaque projet génère automatiquement sa page `/projets/<slug>` (pré-rendue) et son entrée de sitemap.
  Images : `public/assets/projects/<slug>.webp` (renseigner `width` / `height` réels).
- **Compétences, formations, certifications, langues** : `skillGroups`, `education`, `certifications`, `languages`.
- **CV PDF** : déposer le fichier dans `public/cv/` puis renseigner `identity.links.cvPdf` (ex. `'cv/Teklit-TEWOLDE-CV.pdf'`).

Un champ texte vide (`''`) ou une liste vide (`[]`) **masque automatiquement** le bloc correspondant (titre compris) :
par exemple, un projet sans `problem` n'affiche pas de section « Problème ». Il suffit de remplir le champ pour qu'il apparaisse.
Un test (`profile.data.spec.ts`) vérifie la cohérence des données (slugs uniques, dates, liens https, relations expérience ↔ projet).

## Formulaire de contact

Le client valide les champs, puis envoie un `POST /api/contact`. La fonction `api/contact.ts` :

1. revalide le payload avec la **même** fonction que le client (`src/app/core/contact/contact-validation.ts`) ;
2. filtre le spam : champ piège (honeypot), délai minimal de remplissage (3 s), max. 3 liens, rate limiting par IP ;
3. envoie l'email via [Resend](https://resend.com).

Variables d'environnement à définir sur Vercel :

| Variable             | Obligatoire | Exemple                                  |
| -------------------- | ----------- | ---------------------------------------- |
| `RESEND_API_KEY`     | oui         | `re_…`                                   |
| `CONTACT_TO_EMAIL`   | oui         | adresse qui reçoit les messages          |
| `CONTACT_FROM_EMAIL` | non         | `Portfolio <contact@votre-domaine.fr>`   |

Sans configuration (ou hors Vercel, ex. Docker), l'API répond 503 et le formulaire propose un lien `mailto:` de repli.

## SEO, accessibilité, performance

- Pages pré-rendues : HTML complet pour `/`, `/cv` et chaque `/projets/<slug>`.
- `SeoService` : `<title>`, description, canonical, Open Graph, Twitter Card par page ; JSON-LD `Person` sur l'accueil.
- `sitemap.xml` et `robots.txt` générés depuis les données (`scripts/generate-seo.mjs`) ; le sitemap n'est produit que si `identity.siteUrl` est renseigné.
- Accessibilité : lien d'évitement, landmarks, navigation clavier, focus visible, `aria-*` sur les formulaires, contrastes AA,
  audit axe automatisé dans les tests e2e.
- Animations légères désactivées avec `prefers-reduced-motion`.
- Images WebP dimensionnées, chargement différé, police Inter inlinée au build, icônes SVG inline (Font Awesome retiré).

## Déploiement

### Vercel (production)

Le workflow GitHub Actions déploie la branche `master` (secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).
La configuration est dans [`vercel.json`](vercel.json) (dossier de sortie, réécritures, en-têtes de sécurité et de cache).

### Docker

```bash
docker compose up --build prod      # http://localhost  (Nginx non-root, port interne 8080)
docker compose up --build dev       # http://localhost:4200 (rechargement à chaud)
```

Image seule :

```bash
docker build -t teclit-portfolio .
docker run -p 8080:8080 teclit-portfolio
```

L'image est multi-stage (dépendances → build → `nginx-unprivileged`), avec compression gzip, cache long des fichiers
hachés, en-têtes de sécurité et healthcheck. Le formulaire de contact y bascule sur le repli `mailto:`.

## CI/CD (`.github/workflows/deploy.yml`)

1. **quality** : Prettier, ESLint, typecheck, tests unitaires (+ couverture)
2. **build** : build pré-rendu (artefact)
3. **e2e** : Playwright sur le build
4. **docker-build-push** (push) : image taguée `dev` / `staging` / `prod` + SHA
5. **deploy** (`master`) : Vercel production

## Structure

```
api/contact.ts                 Fonction serverless du formulaire
e2e/                           Tests Playwright
scripts/                       Génération SEO, serveur statique de test
src/app/data/                  Source de données unique (modèle, données, utilitaires)
src/app/core/                  Services : SEO, thème, contact (+ validation partagée)
src/app/shared/                Icônes, carte projet, directive d'animation, pipes de contenu
src/app/<section>/             Sections de l'accueil (home = hero, apropos, experiences, competences, realisation, formation, contact)
src/app/pages/                 Pages routées : accueil, détail projet, CV, 404
```
