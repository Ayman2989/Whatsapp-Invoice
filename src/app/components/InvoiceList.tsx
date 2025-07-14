"use client";

import Link from "next/link";
import { Invoice } from "../../types/Invoice";
import { useState } from "react";

const InvoiceList = ({ invoices }: { invoices: Invoice[] }) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [invoiceList, setInvoiceList] = useState(invoices);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setInvoiceList((prev) => prev.filter((inv) => inv._id !== id));
      setConfirmingId(null);
    } else {
      alert("Failed to delete invoice.");
    }
  };

  if (invoiceList.length === 0) return <p>No invoices found.</p>;

  return (
    <div className="space-y-4">
      {invoiceList.map((invoice) => (
        <div
          key={invoice._id}
          className="relative  p-4 rounded shadow-sm transition-all duration-300 group  shadow-primary hover:border-primary hover:bg-blue-50 overflow-hidden"
        >
          {/* Hover overlay title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/30 backdrop-blur-[1px]">
            <h1 className="text-2xl font-bold text-primary">
              CLICK TO EDIT INVOICE
            </h1>
          </div>

          {/* Actual content with light fade on hover */}
          <div className="transition-opacity duration-300 group-hover:opacity-90">
            <Link href={`/invoices/${invoice._id}`} className="block">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  {invoice.customerName}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">Contact: {invoice.customerNumber}</p>
              <p className="font-bold">Total: {invoice.totalAmount} QR</p>
            </Link>
          </div>

          {/* Delete button remains on top */}
          <button
            onClick={() =>
              setConfirmingId((prev) =>
                prev === invoice._id ? null : invoice._id
              )
            }
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-semibold text-sm z-20"
          >
            <svg
              className="h-4 w-4 hover:scale-110 transition-transform duration-200 cursor-pointer"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </button>

          {/* Confirm delete popup */}
          {confirmingId === invoice._id && (
            <div className="absolute top-10 right-2 bg-white border border-red-300 shadow-md rounded p-2 w-48 text-sm z-30 animate-fade-in">
              <p className="mb-2 text-red-700 font-medium">Confirm Delete?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmingId(null)}
                  className="px-2 py-1 text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(invoice._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
