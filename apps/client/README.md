# Clothing Webshop Client README

# Clothing Webshop Client

This is the client-side application for the Clothing Webshop, built using React with TypeScript and Vite. The application provides a user-friendly interface for browsing and purchasing clothing items.

## Project Structure

The project is organized as follows:

```
apps/
└── client/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── hooks/             # Custom hooks
    │   ├── pages/             # Main application pages
    │   ├── services/          # API service functions
    │   ├── styles/            # CSS styles
    │   └── types/             # TypeScript types
    ├── index.html             # Main HTML file
    ├── package.json           # Project dependencies and scripts
    ├── tsconfig.json          # TypeScript configuration
    └── vite.config.ts         # Vite configuration
```

## Getting Started

To get started with the Clothing Webshop client, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd clothing-webshop/apps/client
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the development server:**
   ```
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Features

- Browse products by category
- View product details
- Add products to the cart
- Create new products (admin feature)

## API Integration

The client communicates with the backend REST API to fetch products and categories. The API endpoints include:

- `GET /products` - Fetch all products
- `POST /products` - Create a new product
- `GET /categories` - Fetch all categories

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.