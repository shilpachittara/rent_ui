// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  getDocs,
  query,
  getDoc,
  deleteDoc,
  where,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxXBvfnSU-CKSkCKZW5EysG51CNosguS0",
  authDomain: "sol-rent-demo.firebaseapp.com",
  projectId: "sol-rent-demo",
  storageBucket: "sol-rent-demo.appspot.com",
  messagingSenderId: "282312616570",
  appId: "1:282312616570:web:2607e6fa795405df8ee9c3",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
export interface listings {
  token: string;
  at: number;
}
export const fetchListings = async () => {
  const listings: listings[] = [];
  // const snapshot = await getDocs(collection(db, "listings"));
  // snapshot.forEach((doc) => {
  //   listings.push(doc.data() as listings);
  // });
  return listings;
};

export const deleteListing = async (token: string) => {
  // const q = await query(
  //   collection(db, "listings"),
  //   where("token", "==", token)
  // );
  // const snapshot = await getDocs(q);
  // snapshot.docs.forEach((doc) => {
  //   deleteDoc(doc.ref);
  // });
};

export const addDocument = async (token: string) => {
    // const docRef = doc(collection(db, "listings"), token);
    // const docx = await getDoc(docRef);
    // //console.log(docx.exists())
    // if (docx.exists()) {
    //     return;
    // }
    // await setDoc(docRef, { token, at: Date.now() });
}