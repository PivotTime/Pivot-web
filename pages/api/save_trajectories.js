import { db } from '../../src/lib/firebase-admin.server.js';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const trajectoriesData = req.body;

      // Basic validation: check if data is an array
      if (!Array.isArray(trajectoriesData)) {
        return res.status(400).json({ message: 'Invalid data format. Array expected.' });
      }

      const collectionRef = db.collection('pivot-submissions');
      
      const docRef = await collectionRef.add({
        createdAt: Timestamp.now(),
        objects: trajectoriesData,
      });

      console.log(`Successfully saved data to Firestore. Document ID: ${docRef.id}`);

      res.status(200).json({ message: 'Data saved successfully', docId: docRef.id });
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      res.status(500).json({ message: 'Error saving to Firestore', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}