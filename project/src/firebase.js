// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8mHDk4U3-4zYmpgTwU_Tb4m8fEAInyto",
  authDomain: "project-134ea.firebaseapp.com",
  projectId: "project-134ea",
  storageBucket: "project-134ea.appspot.com",
  messagingSenderId: "760343797594",
  appId: "1:760343797594:web:828c136bc68ef14386dd63",
  measurementId: "G-41C03W1B8R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth()