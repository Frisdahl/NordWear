# Teknisk Projektrapport: NordWear E-commerce Platform

## 1. Introduktion
Denne rapport beskriver den tekniske arkitektur, implementeringsstrategier og designvalg bag NordWear – en moderne, skræddersyet e-commerce platform. Systemet er udviklet fra bunden med fokus på skalerbarhed, ydeevne og en gnidningsfri brugeroplevelse. Rapporten gennemgår de centrale komponenter i full-stack løsningen, herunder frontend, backend, database og tredjepartsintegrationer.

## 2. Systemarkitektur
Projektet er bygget op omkring en **Client-Server arkitektur**, hvor frontend og backend er skarpt adskilt (Decoupled Architecture). Dette muliggør uafhængig udvikling, test og skalering af de to lag.

*   **Frontend (Client):** En Single Page Application (SPA), der håndterer præsentationslaget og brugerinteraktionen.
*   **Backend (Server):** Et RESTful API, der håndterer forretningslogik, datavalidering, databasekald og integrationer med eksterne tjenester.
*   **Database:** En relationel database (MySQL), der sikrer dataintegritet for kritiske forretningsdata som ordrer og kundeprofiler.

## 3. Teknologistack

Valget af teknologier er baseret på ønsket om et moderne, typesikkert og performant udviklingsmiljø.

### 3.1 Frontend
*   **React (v18+):** Valgt for sin komponentbaserede struktur, som gør det muligt at genbruge UI-elementer (f.eks. `ProductCard`, `Button`, `Dropdown`).
*   **TypeScript:** Anvendes til at sikre statisk typning af props og state, hvilket reducerer runtime-fejl betydeligt og forbedrer udvikleroplevelsen (DX).
*   **Vite:** Build-tool, der erstatter Webpack for hurtigere opstartstider og Hot Module Replacement (HMR) under udvikling.
*   **React Router:** Håndterer klient-side routing, hvilket giver en hurtig navigation uden fulde side-reloads (SPA-følelse).
*   **Tailwind CSS:** Utility-first CSS framework, der sikrer et konsistent designsystem og reducerer CSS-bundle størrelsen ved kun at inkludere anvendte klasser.

### 3.2 Backend
*   **Node.js & Express:** En letvægts og fleksibel server-løsning, der udnytter JavaScript (TypeScript) i hele stakken. Express håndterer routing og middleware-logik.
*   **TypeScript:** Sikrer typesikkerhed på tværs af API-kontrakter og interne services.
*   **Prisma ORM:** Fungerer som bindeled mellem Node.js og MySQL. Prisma er valgt for sin intuitive datamodellering (`schema.prisma`) og autogenererede, typesikre database-klient, der minimerer risikoen for SQL-injections og syntaksfejl.

### 3.3 Database
*   **MySQL:** En robust relationel database (RDBMS), valgt grundet kravet om stærk datakonsistens (ACID) i forbindelse med transaktioner, ordrer og varelager.

## 4. Applikationsstruktur og Designmønstre

Systemet følger en lagdelt arkitektur ("Layered Architecture") på backenden for at sikre "Separation of Concerns".

1.  **Routes (API Layer):** Definerer endpoints (f.eks. `GET /products`, `POST /login`) og delegerer anmodningen til den rette controller.
2.  **Controllers:** Håndterer HTTP-specifik logik. De modtager `req` (request) og `res` (response), validerer input, kalder services og returnerer HTTP-statuskoder (200, 400, 500).
3.  **Services:** Indeholder selve forretningslogikken. Det er her, der kommunikeres med databasen via Prisma eller eksterne API'er. Services er uafhængige af HTTP-laget, hvilket gør dem lettere at teste.
4.  **Utils/Helpers:** Genbrugelige hjælpefunktioner til f.eks. prisformatering, email-afsendelse eller password-hashing.

## 5. Kærnefunktionalitet og Integrationer

### 5.1 Checkout Flow og Betaling (Stripe)
Betalingssystemet er bygget op omkring **Stripe Checkout** (hosted løsning) for at maksimere sikkerheden og minimere ansvaret for håndtering af kortdata (PCI Compliance).

1.  **Initiation:** Når kunden går til betaling, sender frontend en liste over kurvens indhold til backendens `/create-checkout-session`.
2.  **Session Creation:** Backenden kommunikerer med Stripe API for at oprette en session, inklusiv varelinjer, priser og succes/cancel URL'er.
3.  **Redirect:** Frontend modtager et sessions-ID og omdirigerer brugeren til Stripes sikre betalingsside.
4.  **Fulfillment (Webhooks):** Dette er en kritisk del af arkitekturen. Når betalingen er gennemført hos Stripe, sender Stripe et asynkront webhook-kald til vores backend (`/api/webhook`).
    *   Backenden verificerer signaturen for at sikre, at kaldet kommer fra Stripe.
    *   Systemet opdaterer ordrestatus i databasen fra `PENDING` til `COMPLETED` (eller `PAID`).
    *   Dette sikrer, at en ordre kun behandles, hvis betalingen reelt er gået igennem, uafhængigt af om brugeren vender tilbage til "Tak for købet"-siden.

### 5.2 Forsendelse (Shipmondo)
Platformen integrerer med Shipmondo for at tilbyde dynamiske fragtpriser og valg af pakkeshop.

*   **API-integration:** Backenden agerer proxy for kald til Shipmondo API. Dette skjuler API-nøglerne for klienten.
*   **Pakkeshop-vælger:** Frontend henter en liste over nærmeste pakkeshops baseret på kundens postnummer og præsenterer dem i et interaktivt kort eller en liste.
*   **Fragtberegning:** Systemet kan beregne fragtpriser baseret på ordrens samlede vægt eller prisgrænser (f.eks. fri fragt over et vist beløb).

### 5.3 Autentificering og Roller
Systemet skelner mellem **User** (login-data) og **Customer** (shop-data).
*   Login sker via JWT (JSON Web Tokens). Ved login modtager klienten en token, som gemmes (typisk i `localStorage` eller cookies) og sendes med i headeren på efterfølgende requests.
*   Backend middleware (`authenticateToken`) beskytter private routes (f.eks. "Min Konto" eller Admin Dashboard) ved at validere tokenen før adgang gives.

## 6. Databasemodellering
Prisma-schemaet definerer relationerne mellem entiteterne:

*   **User vs. Customer:** En 1-til-1 relation. `User` indeholder email/password (hash), mens `Customer` indeholder relationer til ordrer, favoritter og kurv. Dette design tillader, at en bruger kan eksistere uden at være en "kunde" (f.eks. en admin), og det separerer auth-data fra forretningsdata.
*   **Order & OrderItem:** En klassisk 1-til-mange relation. En ordre indeholder metadata (status, total, kunde), mens `OrderItem` er et snapshot af produktet på købstidspunktet (pris, størrelse, farve).
*   **Product Variants:** Produkter er modelleret med varianter (størrelse/farve) i en `ProductQuantity` tabel for at styre lagerbeholdning præcist på variant-niveau.

## 7. Sikkerhedstiltag

1.  **Environment Variables:** Alle hemmeligheder (Database URL, Stripe Secret Key, Shipmondo Token) er gemt i `.env` filer og indlæses kun på serveren. De eksponeres aldrig i frontend-koden.
2.  **API Keys:** Tredjeparts API-kald sker server-side ("Backend-for-Frontend" pattern), så klienten aldrig kender de faktiske API-nøgler.
3.  **Input Validering:** Backenden validerer data før databasekald for at forhindre inkomplette eller ondsindede data.
4.  **CORS:** Cross-Origin Resource Sharing er konfigureret til kun at tillade requests fra det godkendte frontend-domæne.

## 8. Løsning af Tekniske Udfordringer

Under udviklingen blev flere komplekse problemstillinger adresseret:

*   **Race Conditions ved Oprettelse (Upsert):**
    *   *Problem:* Når en bruger loggede ind, forsøgte systemet at hente deres kundeprofil. Hvis den ikke fandtes, forsøgte systemet at oprette den. Ved hurtige, parallelle requests (f.eks. Reacts `StrictMode` der mounter to gange, eller hurtige brugere), opstod der "Unique Constraint" fejl, fordi to processer forsøgte at oprette den samme kunde samtidig.
    *   *Løsning:* Implementering af Prismas `upsert` (Update or Insert) metode. Dette delegerer logikken til databasen som en atomar operation: "Find kunden, og hvis ikke fundet, opret den". Dette eliminerede fejlen og gjorde systemet selv-helende.

*   **Single Page Application (SPA) Scroll-adfærd:**
    *   *Problem:* Som standard i en SPA bevares scroll-positionen ved navigering til en ny side (f.eks. fra produktliste til produktdetalje), hvilket betød, at brugeren landede midt på den nye side.
    *   *Løsning:* Implementering af en global `ScrollToTop`-komponent, der lytter på `pathname` ændringer i React Router og programmatisk scroller vinduet til toppen `(0, 0)` ved hver navigation.

*   **Avanceret Filtrering og Sortering:**
    *   *Implementation:* I stedet for at filtrere arrays i frontenden (hvilket ikke skalerer med tusindvis af produkter), er filtrering og sortering implementeret direkte i databasekaldet via Prisma. Frontend sender parametre som `sort=price-asc` eller `minPrice=500` til API'et, som konstruerer en dynamisk SQL-query (`orderBy`, `where`). Dette sikrer, at pagination og performance bevares selv med store datamængder.

---
*Denne rapport dokumenterer status på NordWear-projektet pr. dags dato og danner grundlag for videreudvikling og drift.*