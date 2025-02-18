import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBGutlZNqTzT4hmoPKImpdRcj0ONVRVSX0",
  authDomain: "incasa-319b6.firebaseapp.com",
  projectId: "incasa-319b6",
  storageBucket: "incasa-319b6.firebasestorage.app",
  messagingSenderId: "895755508332",
  appId: "1:895755508332:web:7c24e27113c0131f895649",
  measurementId: "G-96TMXQQKH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };
export default app;