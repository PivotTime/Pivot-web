import { db } from '../../src/lib/firebase-admin.server';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const customObjectsRef = db.collection('custom-objects');
      const snapshot = await customObjectsRef.orderBy('createdAt', 'desc').get();

      const customObjects = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt.toDate().toISOString(),
          shapes: data.shapes,
        };
      });

      res.status(200).json(customObjects);
    } catch (error) {
      console.error('Error fetching custom objects from API:', error);
      res.status(500).json({ message: 'Failed to fetch custom objects', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
