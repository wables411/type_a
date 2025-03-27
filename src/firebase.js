// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJKeFiapk4TLbhbrp7TE_U9Sb7H1tPySE",
  authDomain: "type-a-chat.firebaseapp.com",
  databaseURL: "https://type-a-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "type-a-chat",
  storageBucket: "type-a-chat.firebasestorage.app",
  messagingSenderId: "1073828625440",
  appId: "1:1073828625440:web:2e679977e799ec65cd5045"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const database = getDatabase(app);