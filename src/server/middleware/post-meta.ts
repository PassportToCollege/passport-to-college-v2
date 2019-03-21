const admin = require("firebase-admin");
const sa = require("../ptc_dev_sa.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: process.env.RAZZLE_FIREBASE_DATABASE_URL,
    storageBucket: process.env.RAZZLE_FIREBASE_STORAGE_BUCKET
  });
}

export default (id : string) => {
  return admin.firestore().collection("posts")
    .doc(id)
    .get()
    .then((snapshot : any) => {
      if (snapshot.exists) {
        const post = snapshot.data();
        return new Promise(resolve => {
          resolve({ metas: `
            <meta property="og:title" content="${post.title} | Stories | Passport to College" />
            <meta property="og:description" content="${post.excerpt}" />
          `})
        })
      }

      return new Promise(resolve => {
        resolve({ error: "post not found" });
      });
    })
}