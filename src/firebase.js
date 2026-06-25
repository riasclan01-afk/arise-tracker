import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyChOQEd5F8Q_fYk-sXq0kz9vgzLZSyJOps",
  authDomain: "arise-tracker-3ee02.firebaseapp.com",
  databaseURL: "https://arise-tracker-3ee02-default-rtdb.firebaseio.com",
  projectId: "arise-tracker-3ee02",
  storageBucket: "arise-tracker-3ee02.firebasestorage.app",
  messagingSenderId: "979344215497",
  appId: "1:979344215497:web:74d825e4dab3a9f7a52c18"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// Add this line after your existing exports
export const auth = getAuth(app);