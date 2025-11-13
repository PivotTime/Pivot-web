import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();


  const targetIso = "2025-11-9T10:00:00+09:00";
  const now = new Date();
  const target = Date.parse(targetIso);


  if (now.getTime() < target) {
    url.pathname = "/countDown"; 
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/"], 

};
console.log("✅ Middleware is running:");

