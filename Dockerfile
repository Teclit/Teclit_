# Étape de construction (build)
FROM node:20-alpine AS build
WORKDIR /app

  # Copier uniquement package.json et package-lock.json pour optimiser le cache
COPY package*.json ./
RUN npm ci

  # Copier le reste des fichiers et construire l'application
COPY . .
RUN npm run build --configuration=production

  # Étape de production avec Nginx
FROM nginx:alpine
  # Copier les fichiers de build
COPY --from=build /app/dist/teclit/browser /usr/share/nginx/html
  # Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
  # Exposer le port 80
EXPOSE 80
  # Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
