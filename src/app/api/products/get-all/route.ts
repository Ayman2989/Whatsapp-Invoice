import { NextResponse } from "next/server";
import { connectDB } from "@/db/config";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
  await connectDB();
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let products;

  if (user.role === "User") {
    products = await Product.find({ createdBy: user.parentAccount }).select(
      "name price"
    );
  } else {
    products = await Product.find({ createdBy: user.id }).select("name price");
  }

  return NextResponse.json({ products }, { status: 200 });
}
