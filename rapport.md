# Teknisk Projektrapport: NordWear E-commerce Platform

## 1. Introduktion
Denne rapport beskriver den tekniske arkitektur, implementeringsstrategier og designvalg bag NordWear – en moderne, skræddersyet e-commerce platform. Systemet er udviklet fra bunden med fokus på skalerbarhed, ydeevne og en gnidningsfri brugeroplevelse. Rapporten gennemgår de centrale komponenter i full-stack løsningen, herunder frontend, backend, database og tredjepartsintegrationer, samt de omfattende sikkerheds- og infrastrukturmæssige optimeringer, der er foretaget for at gøre systemet produktionsklar.

## 2. Systemarkitektur og Dataflow
Systemet er designet som en moderne **Decoupled Full-Stack applikation**, optimeret til høj ydeevne og sikkerhed. Arkitekturen er opdelt i fire primære lag, der kommunikerer via et sikkert REST API.

### 2.1 Arkitekturens lag
1.  **Præsentationslag (Frontend):** En Single Page Application (SPA) bygget med **React 18** og **Vite**. UI-laget er styret af **Tailwind CSS**, hvilket sikrer en lynhurtig indlæsning og fuld responsivitet. State-management (som f.eks. indkøbskurven) håndteres af **Zustand**, mens **React Router** styrer navigationen uden genindlæsning af siden.
2.  **Applikationslag (Backend):** Et Node.js-baseret API bygget med **Express** og **TypeScript**. Dette lag fungerer som systemets hjerne og orkestrerer alt fra ordrestyring til integration med eksterne gateways. Backenden følger et **Controller-Service-mønster**, der sikrer, at forretningslogik er adskilt fra HTTP-håndtering.
3.  **Data-persistens (Database):** En **MySQL** database styret via **Prisma ORM**. Brugen af en relationel database sikrer streng dataintegritet (ACID-compliance), hvilket er kritisk for korrekt lagerstyring og ordrehåndtering.
4.  **Infrastrukturlag (Deployment):** Systemet kører i **Docker-containere** på **DigitalOcean App Platform**. Dette muliggør horisontal skalering og sikrer, at applikationen kører i præcis samme miljø under udvikling som i produktion.

### 2.2 Eksterne Integrationer (Microservices)
NordWear-platformen er ikke et isoleret system, men fungerer som en hub, der integrerer med specialiserede services via API'er:
*   **Betaling (Stripe):** Håndterer alle finansielle transaktioner via en PCI-compliant gateway.
*   **Billedbehandling (Cloudinary):** Bruges til dynamisk optimering og lagring af produktbilleder for at reducere båndbreddeforbrug.
*   **Email (SendGrid):** Automatiseret udsendelse af ordrebekræftelser og transaktionelle mails.
*   **Forsendelse (Shipmondo):** Realtids-opslag af fragtpriser og valg af afhentningssteder.

### 2.3 Dataflow-eksempel: Fra klik til bekræftelse
For at illustrere arkitekturen i praksis kan checkout-flowet ses som følgende kæde:
1.  **Client:** Brugeren indtaster forsendelsesinfo (valideres i browseren med Zod).
2.  **Server:** API'et modtager anmodningen, verificerer lagerstatus via Prisma, og opretter en Stripe Session.
3.  **External:** Brugeren betaler hos Stripe. Stripe sender derefter et **Webhook-kald** tilbage til vores server.
4.  **Database:** Serveren modtager webshooket, verificerer signaturen, og kører en **Atomic Transaction**, der gemmer ordren og nedskriver lagerbeholdningen simultant.
5.  **Email:** Ved transaktionens afslutning trigges SendGrid til at sende en bekræftelse.

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
