import { connectDB } from "@/db/config";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

interface ProductDoc {
  name: string;
  description: string;
  price: number;
  category: string;
  createdBy?: string; // Reference to creator account
  updatedBy?: string; // Reference to updater account
}

export async function GET(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;
  console.log("Received request to fetch product with ID:", _id);

  await connectDB();

  console.log("Fetching Product with ID:", _id);

  const ProductId = _id;

  if (!ProductId) {
    return NextResponse.json({ error: "Missing Product ID" }, { status: 400 });
  }

  try {
    const product = await Product.findById(ProductId).lean<ProductDoc>();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { product, breadcrumb: product.name },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching product:", err);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  await connectDB();
  const { _id } = params;

  try {
    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(_id, body, {
      new: true,
    });

    if (!updated)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  await connectDB();
  const { _id } = params;

  try {
    const deleted = await Product.findByIdAndDelete(_id);
    if (!deleted)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
