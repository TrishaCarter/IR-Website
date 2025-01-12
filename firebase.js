// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBlyXFWTShMuU40FRvjuTBHkXdazwTYdtw",
    authDomain: "irwebsite-444921.firebaseapp.com",
    projectId: "irwebsite-444921",
    storageBucket: "irwebsite-444921.firebasestorage.app",
    messagingSenderId: "205616280235",
    appId: "1:205616280235:web:bccc526a92d5b87fe5fdee",
    measurementId: "G-5RLPCPHNXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export default app;