# MoodBloom

MoodBloom is a web application that helps users track their moods and emotions over time.

## Features

- User authentication (signup, login, password reset)
- Personal dashboard
- More features coming soon!

## Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- Firebase account

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/yourusername/moodbloom.git
   cd moodbloom
   ```

2. Install dependencies
   ```
   npm install
   ```
   
3. Set up your environment variables
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration values

4. Start the development server
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Project Structure

```
moodbloom/
├── public/           # Static files
├── src/              # Source code
│   ├── components/   # Reusable components
│   │   └── auth/     # Authentication-related components
│   ├── contexts/     # React contexts
│   ├── firebase/     # Firebase configuration
│   ├── pages/        # Page components
│   └── ...
├── .firebaserc       # Firebase project configuration
├── firebase.json     # Firebase service configuration
├── firestore.rules   # Firestore security rules
└── ...
```

## Deployment

This app is configured for deployment to Firebase Hosting:

```
npm run build
firebase deploy
```

## Security

- The Firebase configuration in this repository uses environment variables for security.
- Firestore security rules are implemented to protect user data.

## License

[MIT](LICENSE)