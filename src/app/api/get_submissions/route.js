// src/app/api/get_submissions/route.js
import "server-only";
import { NextResponse, NextResponse as Response } from "next/server";
import { db } from "../../../lib/firebase-admin.server.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const limitParam = searchParams.get("limit") ?? "5";
    const lastDocId = searchParams.get("lastDocId");
    const sinceDocId = searchParams.get("sinceDocId");
    const download = searchParams.get("download") === "true";

    const limit = parseInt(limitParam, 10) || 5;

    // 🔽 1) 전체 다운로드 모드
    if (download) {
      const allDocsQuery = db
        .collection("pivot-submissions")
        .orderBy("createdAt", "desc");

      const snapshot = await allDocsQuery.get();

      const submissions = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? "Unknown",
          tags: data.tags ?? [],
          createdAt:
            data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate().toISOString()
              : data.createdAt ?? null,
          objects: data.objects ?? [],
          trajectories: data.trajectories ?? [],
        };
      });

      return NextResponse.json(submissions, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": 'attachment; filename="submissions.json"',
        },
      });
    }

    // 🔽 2) 일반 조회 / 페이지네이션
    let query = db.collection("pivot-submissions");

    if (sinceDocId) {
      const sinceDoc = await db
        .collection("pivot-submissions")
        .doc(sinceDocId)
        .get();

      if (sinceDoc.exists) {
        const sinceData = sinceDoc.data();
        query = query
          .where("createdAt", ">", sinceData.createdAt)
          .orderBy("createdAt", "desc")
          .orderBy("__name__", "desc");
      } else {
        // sinceDocId가 유효하지 않으면 빈 결과 반환
        return NextResponse.json(
          { submissions: [], lastDocId: null, hasMore: false },
          { status: 200 }
        );
      }
    } else {
      // 페이지네이션
      query = query
        .orderBy("createdAt", "desc")
        .orderBy("__name__", "desc");

      if (lastDocId) {
        const lastDoc = await db
          .collection("pivot-submissions")
          .doc(lastDocId)
          .get();

        if (lastDoc.exists) {
          query = query.startAfter(lastDoc);
        }
      }

      query = query.limit(limit);
    }

    const snap = await query.get();

    const submissions = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name ?? "Unknown",
        tags: data.tags ?? [],
        createdAt:
          data.createdAt && data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? null,
        objects: data.objects ?? [],
        trajectories: data.trajectories ?? [],
      };
    });

    const newLastDocId =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].id : null;
    const hasMore = sinceDocId ? false : snap.docs.length === limit;

    return NextResponse.json(
      { submissions, lastDocId: newLastDocId, hasMore },
      { status: 200 }
    );
  } catch (error) {
    console.error("[get_submissions][ERROR]", error);
    return NextResponse.json(
      {
        message: "Failed to fetch submissions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
