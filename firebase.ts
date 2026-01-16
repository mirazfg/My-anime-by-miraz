
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXJWPhPMQmTAfL7MUPfLpgXT1MW4BWKwg",
  authDomain: "my-anime-by-miraz.firebaseapp.com",
  projectId: "my-anime-by-miraz",
  storageBucket: "my-anime-by-miraz.firebasestorage.app",
  messagingSenderId: "155427257889",
  appId: "1:155427257889:web:284a749a5d3650018fed60",
  measurementId: "G-9ETHX470XZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
