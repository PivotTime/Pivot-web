// src/app/api/comment/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase-admin.server";

// 필요하면 명시적으로 Node 런타임 사용
// export const runtime = "nodejs";

export async function GET(req) {
  try {
    console.log("[comment][GET] start");

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit") ?? "50";
    const lastDocId = searchParams.get("lastDocId") ?? null;

    const parsedLimit = Math.min(
      100,
      Math.max(1, parseInt(limitParam, 10) || 50)
    );

    let query = db.collection("comments").orderBy("createdAt", "desc");

    if (lastDocId) {
      const lastDoc = await db.collection("comments").doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snap = await query.limit(parsedLimit).get();

    const items = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const newLastDocId =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].id : null;

    const hasMore = snap.docs.length === parsedLimit;

    return NextResponse.json(
      { comments: items, lastDocId: newLastDocId, hasMore },
      { status: 200 }
    );
  } catch (err) {
    console.error("[comment][ERROR][GET]", err?.name, err?.message, err?.stack);
    return NextResponse.json(
      {
        error: "internal",
        name: err?.name,
        message: err?.message,
      },
      { status: 500 }
    );
  }
}


// POST: 새 댓글 작성
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("[comment][POST] body=", body);

    const { nicName, fromName, message } = body || {};

    if (!nicName || !fromName || !message) {
      return NextResponse.json(
        { error: "nicName, fromName, message 필수" },
        { status: 400 }
      );
    }

    const ref = await db.collection("comments").add({
      nicName,
      fromName,
      message,
      createdAt: new Date(),
    });

    console.log("[comment][POST] ok, id=", ref.id);

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error("[comment][ERROR][POST]", err?.name, err?.message, err?.stack);
    return NextResponse.json(
      {
        error: "internal",
        name: err?.name,
        message: err?.message,
      },
      { status: 500 }
    );
  }
}
