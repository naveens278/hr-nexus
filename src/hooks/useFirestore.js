import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Custom hook for Firestore real-time data
export const useFirestore = (collectionName, conditions = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    setLoading(true);
    const q = query(collection(db, collectionName));

    try {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const result = [];
        querySnapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Apply conditions/filters if provided
        if (conditions && typeof conditions === "function") {
          setData(result.filter(conditions));
        } else {
          setData(result);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, conditions]);

  return { data, loading, error };
};

export default useFirestore;
