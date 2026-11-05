# Teklit TEWOLDE — Portfolio

Portfolio professionnel de **Teklit TEWOLDE**, développeur Full Stack (Java / Kotlin, Spring Boot, Node.js / NestJS, Angular / React).
Hero animé, timeline interactive du parcours, compétences, projets filtrables avec pages de détail, CV téléchargeable et formulaire de contact.

## Stack

| Domaine     | Choix                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| Framework   | Angular 22 — composants standalone, signals, `@if` / `@for` / `@defer`, zoneless, OnPush, TypeScript strict   |
| Rendu       | `@angular/ssr` : routes statiques pré-rendues, serveur Express (SSR), hydratation incrémentale + event replay |
| Styles      | Tailwind CSS v4, tokens en variables CSS (`src/styles.css`), thème clair / sombre persistant, Inter auto-hébergée |
| Contenu     | `src/content/profile.json`, typé et validé par un schéma Zod, servi par `ContentService`                       |
| Contact     | Reactive Forms + schéma Zod partagé ; `POST /api/contact` (Express) : rate limiting, honeypot, envoi Resend    |
| Sécurité    | helmet : CSP stricte (hashes des scripts inline), HSTS, X-Frame-Options, Referrer-Policy                       |
| Qualité     | angular-eslint + Prettier, Vitest + Angular Testing Library, supertest, Playwright + axe, Lighthouse CI        |
| Livraison   | GitHub Actions, Docker multi-étapes (runtime Node non-root + healthcheck), Vercel                              |

## Démarrage

Prérequis : **Node.js ≥ 22.12** et npm.

```bash
npm ci
cp .env.example .env     # facultatif en dev ; requis pour l'envoi d'emails
ng serve                 # ou npm start → http://localhost:4200 (SSR et /api inclus)
```

## Commandes

| Commande                                    | Rôle                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `ng serve` / `npm start`                    | Serveur de développement                                                                |
| `ng build` / `npm run build`                | Valide le contenu, génère sitemap/robots, build SSR + pré-rendu dans `dist/teclit/`     |
| `npm run serve:ssr`                         | Lance le serveur de production : `node dist/teclit/server/server.mjs` (lit `.env`)      |
| `ng test` / `npm test`                      | Tests unitaires Angular (Vitest + Angular Testing Library), mode watch                  |
| `npm run test:server`                       | Tests du serveur Express (Vitest + supertest)                                           |
| `npm run test:ci`                           | Tous les tests unitaires avec couverture (`coverage/`)                                  |
| `npm run test:e2e` / `npm run e2e`          | Playwright (desktop + mobile, audit axe) sur le build servi par le serveur SSR          |
| `npm run lhci`                              | Lighthouse CI (3 pages × 3 runs) sur le build, avec seuils bloquants                    |
| `npm run lint` · `npm run typecheck`        | ESLint (0 warning) · `tsc --noEmit` (app, tests, serveur, api)                          |
| `npm run format` · `npm run format:check`   | Prettier                                                                                |
| `npm run images`                            | Régénère les variantes AVIF (320w / 640w) des images de contenu                         |
| `npm run cv:pdf`                            | Régénère `public/cv/Teklit-TEWOLDE-CV.pdf` depuis la page `/cv` (après un build)        |
| `npm run validate`                          | format, lint, typecheck, tests, build                                                   |

Tests e2e en local : `npm run build && npm run test:e2e`. Le Chrome installé est utilisé par défaut ;
sinon `npx playwright install chromium` puis `PW_CHANNEL= npm run test:e2e`.

## Modifier le contenu

**Tout le contenu est dans [`src/content/profile.json`](src/content/profile.json)** ; aucun texte n'est codé en dur dans les composants.
Le schéma [`profile.schema.ts`](src/app/core/content/profile.schema.ts) en est la référence (les types TypeScript en sont dérivés).
Le build échoue si le contenu est invalide (champ manquant, date mal formée, slug de projet inconnu…).

- `sections` : sur-titre, titre et chapô de chaque section de l'accueil.
- `identity` : identité, bio, liens, intitulés animés du hero (`roles`), chiffres clés (`facts`), `siteUrl`.
- `experiences`, `education`, `skillGroups`, `languages`, `certifications`, `techLogos`.
- `projects` : chaque projet génère sa page `/projets/<slug>` (pré-rendue) et son entrée de sitemap. Image source :
  `public/assets/projects/<slug>.webp`, puis `npm run images` pour produire les variantes AVIF.

Un champ texte vide (`""`) ou une liste vide (`[]`) masque automatiquement le bloc correspondant.
Après une modification du CV, relancer `npm run build && npm run cv:pdf`.

## Formulaire de contact

Le formulaire (Reactive Forms) utilise les **mêmes** règles Zod que le serveur ([`contact.schema.ts`](src/app/core/contact/contact.schema.ts)).
`POST /api/contact` (Express, [`src/server/contact.ts`](src/server/contact.ts)) :

1. limite le débit par IP (5 requêtes / 10 min) et la taille du corps (16 ko) ;
2. filtre le spam (champ piège, délai minimal de 3 s, max. 3 liens) avec une réponse neutre ;
3. revalide avec le schéma Zod puis envoie l'email via [Resend](https://resend.com).

Sans `RESEND_API_KEY`, l'API répond 503 et le formulaire propose un lien `mailto:` de repli.

## Variables d'environnement

Voir [`.env.example`](.env.example). Aucun secret n'est versionné (`.env` est ignoré par git et Docker).

| Variable             | Rôle                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `PORT`               | Port du serveur SSR (défaut 4000)                                                        |
| `SITE_URL`           | URL publique : sitemap au build, hôte autorisé par le serveur SSR                        |
| `NG_ALLOWED_HOSTS`   | Autres hôtes autorisés (séparés par des virgules) — protection SSRF d'Angular SSR        |
| `TRUST_PROXY`        | Nombre de proxys de confiance (IP réelle pour le rate limiting)                          |
| `CONTACT_RATE_LIMIT` | Requêtes max. par IP sur `/api/contact` par fenêtre de 10 min (défaut 5)                 |
| `RESEND_API_KEY`     | Clé API Resend                                                                           |
| `CONTACT_TO_EMAIL`   | Destinataire des messages                                                                |
| `CONTACT_FROM_EMAIL` | Expéditeur vérifié dans Resend, ex. `Portfolio <contact@votre-domaine.fr>`               |

> En production, l'hôte public doit être autorisé (`SITE_URL` ou `NG_ALLOWED_HOSTS`), sinon le rendu SSR répond 400.

## Performance, SEO, accessibilité

- Routes statiques (`/`, `/cv`, `/projets/<slug>`) pré-rendues ; 404 rendue côté serveur avec le bon statut.
- Sections sous la ligne de flottaison en `@defer` avec hydratation incrémentale ; zoneless ; OnPush partout (règle ESLint).
- `NgOptimizedImage` + loader AVIF (`srcset`/`sizes`), `priority` uniquement sur l'image LCP ; police préchargée, fallback aux métriques ajustées (CLS 0).
- Budgets dans `angular.json` (initial 500 kB, script 280 kB, styles 60 kB) : le build échoue s'ils sont dépassés.
- Compression gzip, cache immuable des fichiers hachés.
- `SeoService` : title, description, canonical, Open Graph, Twitter Card ; JSON-LD `Person` ; sitemap et robots générés.
- HTML sémantique, lien d'évitement, focus déplacé sur le titre à chaque changement de page, contrastes WCAG AA,
  animations transform / opacity uniquement et désactivées sous `prefers-reduced-motion`.

## Déploiement

### Docker (serveur SSR)

```bash
docker build -t teclit-portfolio --build-arg SITE_URL=https://votre-domaine.fr .
docker run -p 4000:4000 --env-file .env --read-only --tmpfs /tmp teclit-portfolio   # http://localhost:4000
# ou
docker compose up --build prod      # http://localhost:4000
docker compose up --build dev       # http://localhost:4200 (rechargement à chaud)
```

Image multi-étapes : dépendances → build → `node:22-alpine` sans `node_modules` (le serveur est bundlé),
utilisateur `node`, `HEALTHCHECK` sur `/healthz`.

### Node sans Docker

```bash
npm ci && npm run build
node dist/teclit/server/server.mjs         # ou npm run serve:ssr (charge .env)
```

### Vercel

Le workflow déploie `master` (secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) : pages pré-rendues
statiques + fonction [`api/contact.ts`](api/contact.ts) (même traitement que le serveur Express).
Les en-têtes sont dans [`vercel.json`](vercel.json) ; sans serveur pour calculer les hashes, la CSP y autorise
les scripts inline (`'unsafe-inline'`) — la CSP stricte s'applique avec le serveur Node / Docker.

## CI/CD ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))

Sur chaque PR et push :

1. **quality** : Prettier, ESLint, typecheck, tests unitaires (Angular + serveur) avec couverture
2. **build** : build SSR + pré-rendu (budgets bloquants)
3. **e2e** : Playwright sur le serveur SSR
4. **lighthouse** : Lighthouse CI ([`lighthouserc.json`](lighthouserc.json)) — perf ≥ 0,90 (médiane de 3 runs, marge pour
   la variabilité des runners), a11y / bonnes pratiques / SEO ≥ 0,95, LCP < 2,5 s, CLS < 0,1 ; rapports en artefact
5. **docker** : build de l'image (push vers Docker Hub sur les branches `develop` / `staging` / `master`)
6. **deploy** (`master`) : Vercel production

## Structure

```
api/contact.ts                Adaptateur Vercel de l'API de contact
e2e/                          Tests Playwright
scripts/                      Validation du contenu + SEO, images AVIF, CV PDF
src/content/profile.json      Contenu du site
src/server.ts                 Point d'entrée du serveur SSR (Express)
src/server/                   App Express, API de contact, CSP (+ tests)
src/app/core/                 Services : contenu, SEO, thème, scroll-spy, contact, loader d'images
src/app/shared/ui/            Design system : Button, Card, Section, Tag, TimelineItem, TypedText, ScrollProgress
src/app/navbar, footer/       Mise en page
src/app/<section>/            Sections de l'accueil (home = hero, apropos, experiences, competences, realisation, formation, contact)
src/app/pages/                Pages routées : accueil, détail projet, CV, 404
```
