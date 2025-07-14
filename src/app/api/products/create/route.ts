import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/config";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: NextRequest) {
  await connectDB();

  const user = await getCurrentUser(); // <-- Add await here

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, price, category } = await req.json();

  if (!name || !description || !price || !category) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    createdBy: user.id,
    updatedBy: user.id,
  });

  return NextResponse.json(product, { status: 201 });
}
