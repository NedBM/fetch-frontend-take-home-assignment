# Fetch Frontend Take-Home Assignment - Fetch Finder

A Next.js application that helps users find shelter dogs by searching through a database, with features for filtering, favoriting, and matching with dogs.

## Live Demo

https://fetch-frontend-take-home-assignment-beryl.vercel.app/

## Features

- **Authentication**
  - Email and name-based login
  - Session duration: 1 hour
  - Automatic session expiry handling

- **Dog Search & Filtering**
  - Filter by breed, age, and ZIP code
  - Sort breeds in ascending or descending order
  - Pagination for search results
  - Comprehensive display of dog information

- **Favorites & Matching**
  - Add/remove dogs to favorites
  - View all favorited dogs
  - Generate matches based on favorites

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Libraries**: 
  - shadcn/ui
  - Headless UI
- **State Management**: TanStack Query (React Query)
- **Styling**: 
  - Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion
- **Theme**: next-themes

## Getting Started

1. Clone the repository:
```bash
gh repo clone NedBM/fetch-frontend-take-home-assignment
cd fetch-frontend-take-home-assignment
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Login
1. On the homepage, you'll be prompted to enter:
   - Your name
   - Email address
2. Login session lasts for 1 hour

### Searching Dogs
- Use the filter panel to refine results by:
  - Breed
  - Age range
  - ZIP code
- Sort breeds alphabetically (ascending/descending)
- Browse through paginated results

### Managing Favorites
1. Click the heart icon on any dog card to add/remove from favorites
2. Access your favorites through the "View Likes" button
3. Generate a match from your favorited dogs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Credits

Built as part of the Fetch Frontend Take-Home Assignment.
