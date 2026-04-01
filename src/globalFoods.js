import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "./firebase.js";

const COLL = "globalFoods";

export async function getGlobalFoods() {
  const snap = await getDocs(collection(firestore, COLL));
  return snap.docs.map(d => ({ ...d.data(), _firestoreId: d.id }));
}

export async function addGlobalFood(food) {
  return addDoc(collection(firestore, COLL), { ...food, createdAt: serverTimestamp() });
}

export async function deleteGlobalFood(firestoreId) {
  return deleteDoc(doc(firestore, COLL, firestoreId));
}
