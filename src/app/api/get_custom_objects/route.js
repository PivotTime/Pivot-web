// src/app/api/get_custom_objects/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase-admin.server";

// GET /api/get_custom_objects
export async function GET() {
  try {
    const customObjectsRef = db.collection("custom-objects");
    const snapshot = await customObjectsRef.orderBy("createdAt", "desc").get();

    const customObjects = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        // createdAt 이 Firestore Timestamp 라는 가정
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : null,
        shapes: data.shapes,
      };
    });

    return NextResponse.json(customObjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching custom objects from API:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch custom objects",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
