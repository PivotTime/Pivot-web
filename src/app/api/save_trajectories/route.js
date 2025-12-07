// src/app/api/save_trajectories/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase-admin.server.js";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, tags, objects, trajectories } = body || {};

    // 이름 검증
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Invalid data format. Name is required." },
        { status: 400 }
      );
    }

    // tags 검증
    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        {
          message:
            "Invalid data format. Non-empty array of tags expected.",
        },
        { status: 400 }
      );
    }

    // objects 검증
    if (!Array.isArray(objects) || objects.length === 0) {
      return NextResponse.json(
        {
          message:
            "Invalid data format. Non-empty array of objects expected.",
        },
        { status: 400 }
      );
    }

    // trajectories 검증 (비어 있어도 되지만 배열이어야 함)
    if (!Array.isArray(trajectories)) {
      return NextResponse.json(
        {
          message:
            "Invalid data format. Array of trajectories expected.",
        },
        { status: 400 }
      );
    }

    const collectionRef = db.collection("pivot-submissions");

    const docRef = await collectionRef.add({
      name,
      tags,
      createdAt: Timestamp.now(),
      objects,
      trajectories,
    });

    console.log(
      `Successfully saved data to Firestore. Document ID: ${docRef.id}`
    );

    return NextResponse.json(
      {
        message: "Data saved successfully",
        docId: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    return NextResponse.json(
      {
        message: "Error saving to Firestore",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
