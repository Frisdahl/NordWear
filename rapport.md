# Teknisk Projektrapport: NordWear E-commerce Platform

## 1. Introduktion
Denne rapport beskriver den tekniske arkitektur, implementeringsstrategier og designvalg bag NordWear – en moderne, skræddersyet e-commerce platform. Systemet er udviklet fra bunden med fokus på skalerbarhed, ydeevne og en gnidningsfri brugeroplevelse. Rapporten gennemgår de centrale komponenter i full-stack løsningen, herunder frontend, backend, database og tredjepartsintegrationer, samt de omfattende sikkerheds- og infrastrukturmæssige optimeringer, der er foretaget for at gøre systemet produktionsklar.

## 2. Systemarkitektur
Projektet er bygget op omkring en **Client-Server arkitektur**, hvor frontend og backend er skarpt adskilt (Decoupled Architecture). Dette muliggør uafhængig udvikling, test og skalering af de to lag.

*   **Frontend (Client):** En Single Page Application (SPA) bygget med React, der håndterer præsentationslaget og brugerinteraktionen.
*   **Backend (Server):** Et RESTful API bygget med Node.js/Express, der håndterer forretningslogik, datavalidering, databasekald og integrationer med eksterne tjenester.
*   **Database:** En relationel database (MySQL), der sikrer dataintegritet for kritiske forretningsdata som ordrer og kundeprofiler.
*   **Infrastruktur:** Hele applikationen er containeriseret med **Docker** for at sikre et konsistent miljø på tværs af udvikling og produktion.

## 3. Teknologistack

Valget af teknologier er baseret på ønsket om et moderne, typesikkert og performant udviklingsmiljø.

### 3.1 Frontend
*   **React (v18+):** Valgt for sin komponentbaserede struktur, som gør det muligt at genbruge UI-elementer.
*   **TypeScript:** Anvendes til at sikre statisk typning, hvilket reducerer runtime-fejl og forbedrer udvikleroplevelsen (DX).
*   **Vite:** Build-tool valgt for lynhurtige opstartstider og Hot Module Replacement (HMR).
*   **React Router:** Håndterer klient-side routing (SPA).
*   **Tailwind CSS:** Utility-first CSS framework, der sikrer et responsivt og konsistent designsystem.
*   **Zustand:** Letvægts state-management anvendt til håndtering af indkøbskurven.

### 3.2 Backend
*   **Node.js & Express:** Valgt for sin fleksibilitet og asynkrone natur.
*   **Prisma ORM:** Fungerer som typesikkert bindeled mellem Node.js og MySQL.
*   **Zod:** Anvendes til streng runtime-validering af alle indkommende API-requests.
*   **Stripe SDK:** Integreret til håndtering af betalingsprocesser og webhooks.

### 3.3 Infrastruktur og CI/CD
*   **Docker & Docker Compose:** Containerisering af MySQL, API og Nginx-frontend.
*   **Nginx:** Anvendes som webserver for frontenden, konfigureret med SPA-routing (`try_files`).
*   **GitHub Actions:** Automatiseret CI-pipeline, der kører typecheck og unit tests parallelt for både frontend og backend ved hver push til `main` og `Dev`.

## 4. Applikationsstruktur og Designmønstre

Systemet følger en lagdelt arkitektur ("Layered Architecture") på backenden for at sikre "Separation of Concerns".

1.  **Routes (API Layer):** Definerer endpoints og delegerer anmodninger.
2.  **Controllers:** Håndterer HTTP-logik, validerer input via Zod-middlewares og returnerer svar.
3.  **Services:** Indeholder forretningslogikken, herunder databaseinteraktion og integrationer.
4.  **Utils/Helpers:** Genbrugelige funktioner til prisberegning, shipping-mapping og validering.

## 5. Kærnefunktionalitet og Integrationer

### 5.1 Checkout Flow og Betaling (Stripe)
Betalingssystemet er bygget op omkring **Stripe Checkout** med fokus på sikkerhed og dataintegritet.

1.  **Stock Verification:** Før en betalingssession oprettes, verificerer backenden i realtid, om de ønskede varer er på lager.
2.  **Session Creation:** Opretter en sikker Stripe-session med metadata, der inkluderer de specifikke variant-ID'er (størrelse/farve).
3.  **Fulfillment (Webhooks):** Ved succesfuld betaling sender Stripe et asynkront kald til vores backend.
    *   **Idempotency:** Systemet tjekker først, om ordren allerede er oprettet (for at undgå dubletter ved gentagne webhook-kald).
    *   **Atomic Transactions:** Ordreoprettelse, gavekort-opdatering og lager-decrementering sker i én samlet databasetransaktion.
    *   **Inventory Update:** Lagerbeholdningen i `product_quantity` tabellen nedskrives automatisk baseret på de købte varianter.

### 5.2 Forsendelse (Shipmondo)
Integrationen med Shipmondo tilbyder dynamiske fragtpriser og valg af pakkeshop. Backend agerer proxy for at beskytte API-nøgler, og frontenden præsenterer pakkeshops baseret på kundens postnummer.

### 5.3 Autentificering og Roller
Systemet benytter en moderne og sikker autentificeringsmodel:
*   **JWT & HTTP-Only Cookies:** Tokens gemmes i secure, http-only cookies. Dette eliminerer risikoen for session-stealing via XSS (Cross-Site Scripting), da JavaScript ikke kan tilgå cookien.
*   **RBAC (Role-Based Access Control):** Middleware sikrer, at kun administratorer kan tilgå følsomme funktioner som produktstyring og ordrehistorik.
*   **Session Sync:** En `/auth/me` endpoint sikrer, at frontend-UI'et altid afspejler den aktuelle server-session ved app-start.

## 6. Databasemodellering
Prisma-schemaet sikrer korrekt struktur og dataintegritet:
*   **Variant-styring:** `ProductQuantity` kobler produkter med specifikke farver og størrelser, hvilket muliggør præcis lagerstyring.
*   **Ordrer:** Gemmer snapshots af priser og produktdata på købstidspunktet samt Stripe-metadata for fuld sporbarhed.

## 7. Sikkerhedstiltag

1.  **CSRF Beskyttelse:** Implementeret via "Double Submit Cookie" princippet og kontrol af `X-Requested-With` headeren på alle state-changing requests (POST, PUT, DELETE).
2.  **Rate Limiting:** Beskytter API'et mod brute-force og DoS-angreb ved at begrænse antallet af requests pr. IP.
3.  **Security Headers:** `Helmet.js` er konfigureret til at sætte sikre HTTP-headers, herunder Content Security Policy (CSP).
4.  **SQL Injection:** Forebygges naturligt gennem brugen af Prisma ORM med præ-kompilerede queries.
5.  **Input Sanitize:** Alle requests valideres mod strenge Zod-schemas før behandling.

## 8. Løsning af Tekniske Udfordringer

*   **Race Conditions i Lagerstyring:** Løst ved at kombinere proaktive stock-checks før betaling med atomare databasetransaktioner ved ordre-fulfillment.
*   **Docker SPA Routing:** Løst ved at implementere en custom Nginx-konfiguration med `try_files` direktivet, så React Router kan håndtere dybe links uden 404-fejl.
*   **Responsive Layout Alignment:** Standardiseret side-padding (`px-6 md:px-12`) på tværs af alle sider for at sikre en visuel rød tråd.
*   **Jumpy UI ved Header-skift:** Implementeret `ResizeObserver` i hovedlayoutet for dynamisk at beregne headerens højde og justere en `HeaderSpacer`, hvilket sikrer en stabil scroll-oplevelse.
*   **Toast Notifikationer:** Anvendelse af **React Portals** for at sikre, at notifikationer (f.eks. "Produkt tilføjet") altid er placeret øverst i DOM-hierarkiet og fastlåst til viewporten uafhængigt af komponent-styling.

---
*Denne rapport dokumenterer NordWear-platformens udvikling fra prototype til en sikker, skalérbar og produktionsklar full-stack løsning.*
