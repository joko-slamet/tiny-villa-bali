import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  const res = await fetch(
    "https://api.frankfurter.app/latest?from=IDR&to=USD,AUD,EUR",
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data.rates);
}
