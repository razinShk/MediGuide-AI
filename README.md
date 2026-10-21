# MediGuide AI - Medicine Scanner

![MediGuide AI Screenshot](/screenshot.png)

MediGuide AI is a modern web application designed to help users scan and identify medicines. Built with a focus on simplicity and a medical-grade aesthetic, it provides a seamless experience for uploading medicine images and receiving AI-powered analysis.

## Features

- **Medicine Scanning**: Upload or drag-and-drop medicine images for analysis.
- **AI Analysis**: Powered by advanced AI to identify medicines and provide detailed information (Mock integration ready).
- **Responsive Design**: Fully responsive UI that works across all devices.
- **Modern UI/UX**: Clean, professional medical interface with smooth animations and interactions.

## Technical Stack

This project is built using the following modern web technologies:

- **Frontend Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/) for fast development and build performance.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and code quality.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components**: 
  - [Shadcn UI](https://ui.shadcn.com/) for accessible and customizable components.
  - [Radix UI](https://www.radix-ui.com/) primitives.
  - [Lucide React](https://lucide.dev/) for beautiful icons.
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query) for efficient data fetching and caching.
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) combined with [Zod](https://zod.dev/) for schema validation.
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/) for elegant notifications.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ZSzaidshaikh/ZSmedicine_scanner.git
    cd ZSmedicine_scanner
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

- `/src`
  - `/components`: Reusable UI components and specific features (e.g., MedicineScanner).
  - `/pages`: Application pages (Index.tsx).
  - `/hooks`: Custom React hooks (e.g., useMedicineAnalysis).
  - `/lib`: Utility functions and configuration.

## Author

**Built by Maruf Mansuri**