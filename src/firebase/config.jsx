// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmOLcSvpn69Q_NyuOGU7I-V59G7Z9m1Ms",
  authDomain: "dev-path.firebaseapp.com",
  projectId: "dev-path",
  storageBucket: "dev-path.firebasestorage.app",
  messagingSenderId: "238548103735",
  appId: "1:238548103735:web:ce5164c205b14f8c2f85b2",
  measurementId: "G-8WZLH9B1W0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);