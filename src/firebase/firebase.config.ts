import * as admin from 'firebase-admin';
import * as serviceAccount from '../../mondayapp-serviceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export const firebaseAdmin = admin;
