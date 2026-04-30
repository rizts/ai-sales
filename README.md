# AI Sales Page Generator

A full-stack application built with **Laravel 11** (API Backend) and **React + Vite** (Frontend), designed to automatically generate high-converting landing pages using the **Groq API** (Llama 3 70B model).

## Project Structure

This is a monorepo containing two main parts:
- `/backend`: Laravel 11 API using Sanctum for authentication and PostgreSQL for the database.
- `/frontend`: React 18 application built with Vite, Tailwind CSS, and shadcn/ui.

## Features

- **User Authentication**: Secure login and registration using Laravel Sanctum tokens.
- **Sales Page Generation**: Provide your product details, unique selling points, and target audience, and the app will generate a structured sales page.
- **Groq LLM Integration**: Uses `llama3-70b-8192` via Groq for blazing-fast, JSON-structured AI generation.
- **Background Processing**: API requests to the LLM are handled via Laravel Queues so the frontend remains responsive.
- **Live Preview Dashboard**: View, preview, and manage your generated landing pages with auto-refreshing statuses.

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL
- [Groq API Key](https://console.groq.com/keys)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy the `.env` file and generate an app key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure your `.env` file:
   - Ensure your database settings (`DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) are correct.
   - **Important:** Add your Groq API key:
     ```env
     GROQ_API_KEY=gsk_your_groq_api_key_here
     ```
5. Run database migrations:
   ```bash
   php artisan migrate --seed
   ```
6. Start the local development server:
   ```bash
   php artisan serve
   ```
7. **Start the Queue Worker** (Required for processing LLM generation jobs):
   ```bash
   php artisan queue:work
   ```
   *Note: If you update your `GROQ_API_KEY` in `.env`, you must run `php artisan queue:restart` for the worker to pick up the new key.*

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables. By default, Axios points to `http://127.0.0.1:8000`. You can override this by creating a `.env` file:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser. You can log in using the default seeder account:
   - **Email:** `test@example.com`
   - **Password:** `password`

## Note on LLM Provider

The application was recently migrated from OpenRouter to **Groq** to eliminate rate-limiting issues and drastically improve generation speed. The model currently in use is `llama3-70b-8192` with `response_format` strictly enforced as JSON to ensure the frontend accurately renders the landing page components.
