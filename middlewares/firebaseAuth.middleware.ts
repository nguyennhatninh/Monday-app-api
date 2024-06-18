import * as admin from 'firebase-admin';

export function firebaseAuthMiddleware(req, res, next) {
  const idToken = req.headers.authorization?.split(' ')[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((e) => {
      next(e);
      res.status(401).json({ message: 'Unauthorized' });
    });
}
