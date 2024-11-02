import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCl7eQ9aycNHFNamaYLapBLkGhJhWtuMBk",
    authDomain: "chat-app-ad713.firebaseapp.com",
    projectId: "chat-app-ad713",
    storageBucket: "chat-app-ad713.appspot.com",
    messagingSenderId: "842755757552",
    appId: "1:842755757552:web:fddda730eb29863733f935",
    measurementId: "G-YT9Y2ZY969"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
