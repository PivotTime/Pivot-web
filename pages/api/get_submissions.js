import 'server-only';
import { db } from '../../src/lib/firebase-admin.server.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { limit = 5, lastDocId = null } = req.query;
    let query = db.collection('pivot-submissions').orderBy('createdAt', 'desc');

    if (lastDocId) {
      const lastDoc = await db.collection('pivot-submissions').doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snap = await query.limit(parseInt(limit)).get();

    const submissions = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name ?? 'Unknown',
        tags: data.tags ?? [],
        createdAt:
          data.createdAt && data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? null,
        objects: data.objects ?? [],
        trajectories: data.trajectories ?? [],
      };
    });

    const newLastDocId = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].id : null;
    const hasMore = snap.docs.length === parseInt(limit);

    res.status(200).json({ submissions, lastDocId: newLastDocId, hasMore });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}