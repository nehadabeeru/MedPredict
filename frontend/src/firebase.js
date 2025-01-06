import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASNWEgJyAHLy6Jixn_B9c1z7hYWBDMRPQ",
  authDomain: "medpredict7.firebaseapp.com",
  projectId: "medpredict7",
  storageBucket: "medpredict7.appspot.com",
  messagingSenderId: "435352049696",
  appId: "1:435352049696:web:f72c90a7e115afe1fdc445",
  measurementId: "G-8FM9QF1KE2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore

export { auth, firestore };
