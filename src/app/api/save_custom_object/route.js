// src/app/api/save_custom_object/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase-admin.server.js";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    const customObjectData = await req.json();

    if (!Array.isArray(customObjectData) || customObjectData.length === 0) {
      return NextResponse.json(
        {
          message:
            "Invalid data format. Non-empty array of shapes expected.",
        },
        { status: 400 }
      );
    }

    const collectionRef = db.collection("custom-objects");

    const docRef = await collectionRef.add({
      createdAt: Timestamp.now(),
      shapes: customObjectData,
    });

    console.log(
      `Successfully saved custom object to Firestore. Document ID: ${docRef.id}`
    );

    return NextResponse.json(
      {
        message: "Custom object saved successfully",
        docId: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving custom object to Firestore:", error);
    return NextResponse.json(
      {
        message: "Error saving custom object to Firestore",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
