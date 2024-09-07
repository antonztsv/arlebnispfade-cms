# ARlebnispfade OBK - CMS

Ein Projekt zur redaktionellen Verwaltung von Augmented Reality (AR) Inhalten für das Kooperationsprojekt "ARlebnispfade OBK".

## Überblick

Diese Webanwendung ermöglicht die einfache Integration und Verwaltung von AR-Inhalten wie Texte, Bilder, Audio, Video, 3D-Modelle und Geolocation-Daten. Sie wird im Rahmen einer Bachelorarbeit an der TH Köln entwickelt.

![ARlebnispfade OBK - CMS](docs/screenshot-home.png)

## Struktur

Das Projekt besteht aus zwei Hauptkomponenten:

- `frontend/`: Benutzeroberfläche zur Verwaltung der Routen, POIs, Median und AR-Inhalte
- `backend/`: Server-API zur Datenverwaltung zwischen der Benutzeroberfläche und dem Git-Repository

## Technologien

![Vue.js Badge](https://img.shields.io/badge/Vue.js-4FC08D?logo=vuedotjs&logoColor=fff&style=for-the-badge)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=for-the-badge)
![Tailwind CSS Badge](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)
![Node.js Badge](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge)
![Nodemon Badge](https://img.shields.io/badge/Nodemon-76D04B?logo=nodemon&logoColor=fff&style=for-the-badge)
![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge)
![MongoDB Badge](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=for-the-badge)
![.ENV Badge](https://img.shields.io/badge/.ENV-ECD53F?logo=dotenv&logoColor=000&style=for-the-badge)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
![Prettier Badge](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=fff&style=for-the-badge)
![JSON Web Tokens Badge](https://img.shields.io/badge/JSON%20Web%20Tokens-000?logo=jsonwebtokens&logoColor=fff&style=for-the-badge)

- Frontend: Vue3, Vite, TypeScript
- Backend: Node.js, Express.js, TypeScript

## Installation

Das Projekt kann über Docker Compose gestartet werden. Vorraussetzung ist, dass Docker und Docker Compose auf dem System installiert sind. Außerdem muss ein Access-Token für das ar-lebnispfade Repository auf GitHub erstellt werden.

**Repository klonen**

```bash
git clone git@github.com:antonztsv/arlebnispfade-cms.git
```

**Container über Docker Compose builden und starten**

```bash
docker-compose up -d  --build
```

** Lokalen Admin Nutzer erstellen **

Der

```bash
cd backend
docker compose exec backend npm run create-user
```

## Verwendung

Frontend URL: `http://localhost:5173`

Backend URL: `http://localhost:3000`

## Funktionen

- Verwaltung verschiedener AR-Inhaltstypen
- Vorschau der AR-Inhalte
- Integration mit bestehenden Datenstrukturen des "ARlebnispfade Oberberg" Projekts

![ARlebnispfade OBK - CMS](docs/screenshot-routes.png)

![ARlebnispfade OBK - CMS](docs/screenshot-wiehl.png)

![ARlebnispfade OBK - CMS](docs/screenshot-muehle-blur.png)

![ARlebnispfade OBK - CMS](docs/screenshot-changes.png)

## Beitrag

Dieses Projekt ist Teil einer Bachelorarbeit. Beiträge sind daher nicht möglich.

## Kontakt

anton.zaitsev [at] smail.th-koeln.de
