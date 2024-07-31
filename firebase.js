import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Add this import for Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCqTM_YV-T5cdvZfG3R4FEDJxDs_MkyXFY",
  authDomain: "tanauancityportal.firebaseapp.com",
  projectId: "tanauancityportal",
  storageBucket: "tanauancityportal.appspot.com",
  messagingSenderId: "216273742851",
  appId: "1:216273742851:web:450777416df0847d81b236"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const db = firestore; // Set db to the firestore instance

console.log('firestore instance:', firestore);

// Export all Firebase services
export { auth, firestore, storage, db };
