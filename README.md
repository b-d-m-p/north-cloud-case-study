
# AWS Cloud Savings Dashboard

A modern dashboard built with SvelteKit 2 and Svelte 5 that visualizes AWS cloud cost savings data.

## Features

- Real-time data visualization
- Responsive design
- Skeleton loading states
- Interactive charts
- Tabular data presentation

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm (recommended)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd aws-cloud-savings
```

2. Install dependencies:


```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
VITE_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
├── src/
│ ├── lib/
│ │ ├── components/
│ │ │ └── ui/ # Shadcn UI components
│ ├── routes/
│ │ └── +page.svelte # Main dashboard page
│ └── app.css # Global styles
├── static/
├── vite.config.ts
└── package.json
```

## Technology Stack

- SvelteKit 2
- Svelte 5 (with Runes)
- TypeScript
- Tailwind CSS
- Shadcn UI
- D3.js (for charts)
- Lucide Icons

## API Integration

The dashboard connects to a REST API endpoint for data. Configure the API endpoint in `vite.config.ts`:
