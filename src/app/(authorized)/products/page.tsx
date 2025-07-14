import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/db/config";
import Product from "@/models/Product";
import ProductList from "../../components/ProductList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  let products;
  if (user.role === "User") {
    products = await Product.find({ createdBy: user.parentAccount }).select(
      "name description price"
    );
  } else {
    products = await Product.find({ createdBy: user.id }).select(
      "name description price"
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-primary">Products</h1>

          {user.role !== "User" && (
            <Link
              href="/products/create-product"
              className="inline-block bg-primary text-white px-5 py-2 rounded-lg hover:scale-95 transition-all duration-300 shadow-sm"
            >
              + New Product
            </Link>
          )}
        </div>

        <p className="text-lg mb-6 text-gray-600">
          Manage all your products here.
        </p>

        <div className="bg-white shadow-md shadow-primary rounded-3xl p-6">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}
