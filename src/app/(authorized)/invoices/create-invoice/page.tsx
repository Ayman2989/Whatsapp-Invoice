import React from "react";
import InvoiceForm from "../../../components/InvoiceForm";

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <div className="p-6 bg-white min-h-screen text-primary">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <InvoiceForm />
    </div>
  );
};

export default Page;
