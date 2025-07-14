"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
};

const ProductList = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!products.length)
    return <p className="text-gray-500 text-center">No products found.</p>;

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
        return;
      }

      router.refresh();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="relative bg-white  rounded-xl shadow-primary shadow-sm hover:shadow-md cursor-pointer  transition-all duration-300 p-5 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-primary font-semibold text-lg">
              QR {product.price.toFixed(2)}
            </span>
            <div className="flex gap-2">
              <Link
                href={`/products/${product._id}/update`}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-sm rounded-md transition"
              >
                Update
              </Link>
              <button
                onClick={() =>
                  setConfirmDeleteId(
                    confirmDeleteId === product._id ? null : product._id
                  )
                }
                className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>

          {confirmDeleteId === product._id && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] bg-opacity-30 flex items-center justify-center z-10 rounded-xl">
              <div className="bg-white p-5 rounded-lg shadow-lg text-center w-64">
                <p className="mb-4 text-gray-700 font-medium">
                  Are you sure you want to delete?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded-md text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
