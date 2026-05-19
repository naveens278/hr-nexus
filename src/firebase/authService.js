import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

// Register new user
export const registerUser = async (email, password, userData) => {
  if (email !== "naveensenthil396@gmail.com") {
    return { error: "Access restricted: Only HR/Admin (naveensenthil396@gmail.com) is authorized.", success: false };
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile
    try {
      await updateProfile(user, {
        displayName: userData.name,
        photoURL: userData.photoURL || null,
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role || "employee",
        department: userData.department || "",
        phone: userData.phone || "",
        createdAt: new Date().toISOString(),
        isActive: true,
        lastLogin: new Date().toISOString(),
      });
    } catch (firestoreError) {
      console.warn("Firestore initialization failed:", firestoreError);
    }

    return { user, success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: error.message, success: false };
  }
};

// Login user
export const loginUser = async (email, password) => {
  if (email !== "naveensenthil396@gmail.com") {
    return { error: "Access restricted: Only HR/Admin (naveensenthil396@gmail.com) is authorized.", success: false };
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login (non-blocking - don't wait for it)
    setDoc(
      doc(db, "users", user.uid),
      { lastLogin: new Date().toISOString() },
      { merge: true }
    ).catch(err => console.log("Last login update skipped:", err));

    return { user, success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: error.message, success: false };
  }
};

// Google login
export const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    if (user.email !== "naveensenthil396@gmail.com") {
      await signOut(auth);
      return { error: "Access restricted: Only HR/Admin (naveensenthil396@gmail.com) is authorized.", success: false };
    }

    // Background sync: Check and update user in Firestore WITHOUT blocking the login return
    const syncUserToFirestore = async (user) => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log("[AUTH_SYNC] Creating new user record for:", user.email);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "User",
            role: "employee",
            department: "",
            phone: "",
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
            isActive: true,
            lastLogin: new Date().toISOString(),
          });
        } else {
          console.log("[AUTH_SYNC] Updating last login for:", user.email);
          await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
        }
      } catch (firestoreError) {
        console.warn("[AUTH_SYNC] Background sync failed (non-critical):", firestoreError);
      }
    };

    // Trigger sync in background
    syncUserToFirestore(user).catch(err => console.error("[AUTH_SYNC] Error:", err));

    return { user, success: true };
  } catch (error) {
    console.error("Google Login Error:", error);
    return { error: error.message, success: false };
  }
};

// Legacy alias for compatibility during migration cleanup
export const googleLoginBackend = googleLogin;

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { error: error.message, success: false };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error: error.message, success: false };
  }
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { data: userSnap.data(), success: true };
    } else {
      return { error: "User not found", success: false };
    }
  } catch (error) {
    console.error("Get User Data Error:", error);
    return { error: error.message, success: false };
  }
};

// Update user profile
export const updateUserProfile = async (uid, updates) => {
  try {
    await setDoc(doc(db, "users", uid), updates, { merge: true });
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return { error: error.message, success: false };
  }
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });
    return { data: users, success: true };
  } catch (error) {
    console.error("Get All Users Error:", error);
    return { error: error.message, success: false };
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { data: querySnapshot.docs[0].data(), success: true };
    } else {
      return { error: "User not found", success: false };
    }
  } catch (error) {
    console.error("Get User by Email Error:", error);
    return { error: error.message, success: false };
  }
};
