import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHw963pVbx5hMQUP03yIrNM2Ah_yucj_M",
  authDomain: "shopwise-1aef7.firebaseapp.com",
  projectId: "shopwise-1aef7",
  storageBucket: "shopwise-1aef7.firebasestorage.app",
  messagingSenderId: "200812586634",
  appId: "1:200812586634:web:e2e17f364d8379226baf73",
  measurementId: "G-CBFX8KFBVQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
