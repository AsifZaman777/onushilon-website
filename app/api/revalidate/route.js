import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CONTENT_TAG } from "../../../lib/serverData";

export const dynamic = "force-dynamic";

function authorised(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // open only in dev
  const provided =
    request.headers.get("x-revalidate-secret") ||
    new URL(request.url).searchParams.get("secret");
  return provided === secret;
}

async function handle(request) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG);
  revalidatePath("/");
  return NextResponse.json({ ok: true, revalidatedAt: Date.now() });
}

export const POST = handle;
export const GET = handle;
