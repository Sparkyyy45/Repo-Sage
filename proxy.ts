import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/favorites", "/repo", "/issue", "/settings", "/learn"];
const publicRoutes = ["/", "/api/auth"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isPublic = publicRoutes.some((r) => path.startsWith(r));

  const session = await auth();

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublic && session && path === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|svg|webp|jpg|jpeg|gif|ico)$).*)"],
};
