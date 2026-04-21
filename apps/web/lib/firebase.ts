import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported, Analytics } from 'firebase/analytics';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAUTRFwmPf47uFKAGLJRX_txa-tsxTubG8',
  authDomain: 'hakhy-chat.firebaseapp.com',
  projectId: 'hakhy-chat',
  storageBucket: 'hakhy-chat.appspot.com',
  messagingSenderId: '1060910683787',
  appId: '1:1060910683787:web:aee9be9fbe5ebe1e91268e',
  measurementId: 'G-TZ9F8FZJWC',
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

const app = getFirebaseApp();
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  analyticsIsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase auth can only be used in the browser');
  }
  return getAuth(app);
}

export async function firebaseRegister(email: string, password: string) {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function firebaseGoogleSignIn() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return signInWithPopup(getFirebaseAuth(), provider);
}

export async function firebaseLogout() {
  return firebaseSignOut(getFirebaseAuth());
}

export async function firebaseSendPasswordReset(email: string) {
  return sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function firebaseUpdateProfile(displayName: string, photoURL?: string) {
  const user = getFirebaseAuth().currentUser;
  if (user) {
    return updateProfile(user, {
      displayName,
      photoURL
    });
  }
  throw new Error('No user is currently signed in');
}

export function onFirebaseAuthStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

// Firebase Storage functions
export function getFirebaseStorage() {
  return getStorage(app);
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, `avatars/${userId}/${Date.now()}_${file.name}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to upload files');
  }

  const storage = getFirebaseStorage();
  const storageRef = ref(storage, `${folder}/${user.uid}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

// Firebase Messaging functions
export function getFirebaseMessaging(): Messaging {
  if (typeof window === 'undefined') {
    throw new Error('Firebase messaging can only be used in the browser');
  }
  return getMessaging(app);
}

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const messaging = getFirebaseMessaging();
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY_HERE' // You'll need to generate this from Firebase Console
    });
    return token;
  } catch (error) {
    console.error('Error getting notification token:', error);
    return null;
  }
}

export function onMessageReceived(callback: (payload: any) => void) {
  const messaging = getFirebaseMessaging();
  return onMessage(messaging, callback);
}

export { app as firebaseApp, analytics, getFirebaseAuth };
export type { User };
