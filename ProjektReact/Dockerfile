# Pobierz oficjalny obraz Node.js 14
FROM node:14

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj package.json i package-lock.json
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę kodu
COPY . .

# Zbuduj aplikację
RUN npm run build

# Uruchom aplikację
CMD [ "npm", "start" ]
