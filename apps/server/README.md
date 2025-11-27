# Clothing Webshop Server README

# Clothing Webshop Server

This is the backend server for the Clothing Webshop application. It is built using Node.js, Express, and TypeScript, and it utilizes Prisma for database interactions with a MySQL database.

## Project Structure

- `src/`: Contains the main source code for the backend application.
  - `index.ts`: Entry point of the application where the server is initialized.
  - `app.ts`: Main application setup, including middleware and routes.
  - `controllers/`: Contains the logic for handling requests and responses.
  - `routes/`: Contains route definitions for the API endpoints.
  - `services/`: Contains business logic and interactions with the database.
  - `prisma/`: Contains Prisma-related files, including the Prisma client.
  - `middleware/`: Contains middleware functions, such as error handling.
  - `types/`: Contains TypeScript type definitions.

## API Endpoints

- `GET /products`: Retrieve a list of products.
- `POST /products`: Create a new product.
- `GET /categories`: Retrieve a list of categories.

## Database

The application uses Prisma to interact with a MySQL database. The database schema is defined in the `prisma/schema.prisma` file.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd clothing-webshop/apps/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Run the application:
   ```
   npm run dev
   ```

## Docker

To run the application using Docker, ensure you have Docker installed and run:
```
docker-compose up
```

## Prisma

To generate the Prisma client and migrate the database, run:
```
npx prisma migrate dev
npx prisma generate
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.