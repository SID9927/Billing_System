# Kharchaa - Smart Business Management System

Kharchaa is a premium billing and inventory management application designed for small to medium-sized business owners. It provides a comprehensive suite of tools to manage sales, track inventory, and analyze business growth through a clean, high-fidelity interface.

## Core Features

- Dashboard: Real-time overview of revenue, profit, and business activity.
- Billing Engine: High-performance billing with support for weight-based pricing, GST calculations, and multiple payment modes.
- Inventory Management: Complete product catalog with stock tracking, low-stock alerts, and category management.
- Custom Order Management: Specialized workflow for handling advanced bookings, production statuses, and advance payments.
- CRM and Loyalty: Customer database management with integrated loyalty points and history tracking.
- Marketing Tools: Festival campaign builder with custom voucher generation.
- Reports and Analytics: Detailed financial data visualization and staff performance tracking.
- Multi-User Access: Role-based access for owners and staff with unique login credentials.
- Security: Integrated login activity logs and password management.

## Technical Stack

- Frontend: React.js
- Build Tool: Vite
- Styling: Vanilla CSS (Modular)
- Icons: Lucide React
- Charts: Recharts
- State Management: React Context API and Custom Hooks

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   git clone https://github.com/SID9927/Billing_System.git

2. Install dependencies
   npm install

3. Start the development server
   npm run dev

## Deployment

The project is configured for deployment on Netlify. It includes a _redirects file in the public directory to handle Single Page Application (SPA) routing correctly.

## Project Structure

- src/components: Reusable UI elements and feature-specific components.
- src/hooks: Custom React hooks for business logic and state management.
- src/pages: Main application views and route components.
- src/styles: Global design tokens and base styles.
- public: Static assets and configuration files.
