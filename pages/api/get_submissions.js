import 'server-only';
import { db } from '../../src/lib/firebase-admin.server.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { limit = 5, lastDocId = null, sinceDocId = null } = req.query;
    let query = db.collection('pivot-submissions');

    if (sinceDocId) {
      const sinceDoc = await db.collection('pivot-submissions').doc(sinceDocId).get();
      if (sinceDoc.exists) {
        // Fetch documents newer than the one specified by sinceDocId
        query = query.where('createdAt', '>', sinceDoc.data().createdAt).orderBy('createdAt', 'desc').orderBy('__name__', 'desc');
      } else {
        // sinceDocId is invalid, so just return empty
        return res.status(200).json({ submissions: [], lastDocId: null, hasMore: false });
      }
    } else {
      // Pagination logic
      query = query.orderBy('createdAt', 'desc').orderBy('__name__', 'desc');
      if (lastDocId) {
        const lastDoc = await db.collection('pivot-submissions').doc(lastDocId).get();
        if (lastDoc.exists) {
          query = query.startAfter(lastDoc);
        }
      }
      query = query.limit(parseInt(limit));
    }

    const snap = await query.get();

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
    // For 'since' queries, hasMore is not really relevant in the same way.
    // For pagination queries, it's based on if the number of docs returned equals the limit.
    const hasMore = sinceDocId ? false : snap.docs.length === parseInt(limit);

    res.status(200).json({ submissions, lastDocId: newLastDocId, hasMore });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}