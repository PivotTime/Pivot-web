import { db } from '../../src/lib/firebase-admin.server.js';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, tags, objects, trajectories } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Invalid data format. Name is required.' });
      }

      if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({ message: 'Invalid data format. Non-empty array of tags expected.' });
      }

      if (!Array.isArray(objects) || objects.length === 0) {
        return res.status(400).json({ message: 'Invalid data format. Non-empty array of objects expected.' });
      }

      if (!Array.isArray(trajectories)) { // Basic validation for trajectories
        return res.status(400).json({ message: 'Invalid data format. Array of trajectories expected.' });
      }

      const collectionRef = db.collection('pivot-submissions');
      
      const docRef = await collectionRef.add({
        name: name,
        tags: tags,
        createdAt: Timestamp.now(),
        objects: objects,
        trajectories: trajectories, // Save trajectories
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