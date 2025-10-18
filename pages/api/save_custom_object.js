import { db } from '../../src/lib/firebase-admin.server.js';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const customObjectData = req.body;

      if (!Array.isArray(customObjectData) || customObjectData.length === 0) {
        return res.status(400).json({ message: 'Invalid data format. Non-empty array of shapes expected.' });
      }

      const collectionRef = db.collection('custom-objects');
      
      const docRef = await collectionRef.add({
        createdAt: Timestamp.now(),
        shapes: customObjectData,
      });

      console.log(`Successfully saved custom object to Firestore. Document ID: ${docRef.id}`);

      res.status(200).json({ message: 'Custom object saved successfully', docId: docRef.id });
    } catch (error) {
      console.error('Error saving custom object to Firestore:', error);
      res.status(500).json({ message: 'Error saving custom object to Firestore', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
